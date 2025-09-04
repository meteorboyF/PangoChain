import React, { useState, useEffect, useCallback } from "react";
import "./Cases.css";
import { FaFolderOpen, FaPlus } from 'react-icons/fa'; // Example of using icons

// --- Helper function for API calls ---
const apiService = {
  async getCases() {
    try {
      const response = await fetch('/api/test/cases');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.cases || [];
    } catch (error) {
      console.error('Error loading cases:', error);
      return []; // Return empty array on error
    }
  },
  async createCase(caseData) {
    const response = await fetch('/api/test/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create case');
    }
    return await response.json();
  }
};

// --- Case Creation Form Component ---
const CaseForm = ({ onCaseCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    caseType: 'General'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const caseTypes = [
    'General', 'Contract', 'Criminal', 'Civil', 'Corporate', 
    'Family', 'Immigration', 'Real Estate', 'Intellectual Property'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Case title is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.createCase(formData);
      alert('Case created successfully!');
      onCaseCreated(); // Notify parent to refresh
    } catch (error) {
      console.error('Error creating case:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-glass create-case-form">
      <h3>Create New Case</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Case Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., 'Johnson v. Smith Contract Dispute'"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="clientName">Client Name</label>
            <input
              id="clientName"
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              placeholder="e.g., 'John Doe'"
            />
          </div>
          <div className="form-group">
            <label htmlFor="caseType">Case Type</label>
            <select
              id="caseType"
              name="caseType"
              value={formData.caseType}
              onChange={handleInputChange}
            >
              {caseTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide a brief summary of the case..."
            rows="4"
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'Creating...' : 'Create Case'}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Single Case Card Component ---
const CaseCard = ({ caseItem }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const handleViewDocuments = () => {
    window.location.href = `/documents?case=${caseItem._id}`;
  };

  return (
    <div className="card-glass case-card">
      <div className="case-card-header">
        <h4>{caseItem.title}</h4>
        <span className={`case-status status-${caseItem.status.toLowerCase().replace(' ', '-')}`}>
          {caseItem.status}
        </span>
      </div>
      <div className="case-card-body">
        <p><strong>Client:</strong> {caseItem.clientName || 'N/A'}</p>
        <p><strong>Type:</strong> {caseItem.caseType}</p>
        <p><strong>Created:</strong> {formatDate(caseItem.createdAt)}</p>
        {caseItem.description && (
          <p className="case-description"><strong>Description:</strong> {caseItem.description}</p>
        )}
      </div>
      <div className="case-card-footer">
        <button onClick={handleViewDocuments} className="btn btn-secondary">
          View Documents
        </button>
      </div>
    </div>
  );
};

// --- List of Cases Component ---
const CaseList = ({ cases }) => {
  if (cases.length === 0) {
    return (
      <div className="no-cases card-glass">
        <FaFolderOpen className="no-cases-icon" />
        <h3>No Cases Found</h3>
        <p>Create your first case to get started!</p>
      </div>
    );
  }

  return (
    <div className="cases-grid">
      {cases.map(caseItem => (
        <CaseCard key={caseItem._id} caseItem={caseItem} />
      ))}
    </div>
  );
};

// --- Main Parent Component ---
function Cases() {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadCases = useCallback(async () => {
    setIsLoading(true);
    const fetchedCases = await apiService.getCases();
    setCases(fetchedCases);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const handleCaseCreated = () => {
    setShowCreateForm(false);
    loadCases(); // Refresh the list
  };

  return (
    <div className="cases-page">
      <div className="cases-header">
        <h1>Case Management</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn btn-primary">
          <FaPlus /> {showCreateForm ? 'Cancel' : 'Create New Case'}
        </button>
      </div>

      {showCreateForm && (
        <CaseForm onCaseCreated={handleCaseCreated} onCancel={() => setShowCreateForm(false)} />
      )}

      <div className="cases-list">
        <h2>Your Cases ({cases.length})</h2>
        {isLoading ? <p>Loading cases...</p> : <CaseList cases={cases} />}
      </div>
    </div>
  );
}

export default Cases;