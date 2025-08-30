import React, { useState, useEffect } from "react";
import "./Cases.css";

function Cases() {
  const [cases, setCases] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    caseType: 'General'
  });
  const [creating, setCreating] = useState(false);

  const caseTypes = [
    'General', 'Contract', 'Criminal', 'Civil', 'Corporate', 
    'Family', 'Immigration', 'Real Estate', 'Intellectual Property'
  ];

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const response = await fetch('/api/test/cases');
      const data = await response.json();
      setCases(data.cases || []);
    } catch (error) {
      console.error('Error loading cases:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Case title is required');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/test/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Case created successfully!');
        setFormData({ title: '', description: '', clientName: '', caseType: 'General' });
        setShowCreateForm(false);
        loadCases(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create case'}`);
      }
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Error creating case');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="cases">
      <div className="cases-header">
        <h2>📂 Case Management</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-create-case"
        >
          ➕ Create New Case
        </button>
      </div>

      {showCreateForm && (
        <div className="create-case-form">
          <h3>Create New Case</h3>
          <form onSubmit={handleCreateCase}>
            <div className="form-group">
              <label>Case Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter case title"
                required
              />
            </div>

            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="Enter client name"
              />
            </div>

            <div className="form-group">
              <label>Case Type</label>
              <select
                name="caseType"
                value={formData.caseType}
                onChange={handleInputChange}
              >
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter case description"
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                disabled={creating}
                className="btn-submit"
              >
                {creating ? 'Creating...' : 'Create Case'}
              </button>
              <button 
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cases-list">
        <h3>Your Cases ({cases.length})</h3>
        
        {cases.length === 0 ? (
          <div className="no-cases">
            <p>No cases found. Create your first case to get started!</p>
          </div>
        ) : (
          <div className="cases-grid">
            {cases.map(caseItem => (
              <div key={caseItem._id} className="case-card">
                <div className="case-header">
                  <h4>{caseItem.title}</h4>
                  <span className={`case-status status-${caseItem.status}`}>
                    {caseItem.status}
                  </span>
                </div>
                
                <div className="case-details">
                  <p><strong>Client:</strong> {caseItem.clientName}</p>
                  <p><strong>Type:</strong> {caseItem.caseType}</p>
                  <p><strong>Created:</strong> {formatDate(caseItem.createdAt)}</p>
                  {caseItem.description && (
                    <p><strong>Description:</strong> {caseItem.description}</p>
                  )}
                </div>

                <div className="case-actions">
                  <button 
                    onClick={() => window.location.href = `/documents?case=${caseItem._id}`}
                    className="btn-view-documents"
                  >
                    📄 View Documents
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cases;
