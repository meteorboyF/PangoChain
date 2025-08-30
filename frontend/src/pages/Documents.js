import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import './Documents.css'; // We'll update this file next

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [storageType, setStorageType] = useState('MongoDB'); // Default storage type
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // For this prototype, we'll hardcode a caseId.
  // In a real app, you would get this from the URL or state management.
  const caseId = 'YOUR_TEST_CASE_ID'; // IMPORTANT: REPLACE THIS with a real case ID from your database

  const { user } = useContext(AuthContext);

  // Function to fetch documents for the case
  const fetchDocuments = async () => {
    if (!caseId) return;
    try {
      setLoading(true);
      const response = await api.get(`/documents/${caseId}`);
      setDocuments(response.data);
    } catch (err) {
      setError('Failed to fetch documents.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents when the component mounts
  useEffect(() => {
    fetchDocuments();
  }, [caseId]); // Re-run if caseId changes

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    if (!user) {
        setError('You must be logged in to upload.');
        return;
    }

    // FormData is necessary for sending files
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('storageType', storageType);
    // The 'uploader' is handled by the backend using our authMiddleware

    setError('');
    setLoading(true);

    try {
      const response = await api.post(`/documents/${caseId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Add the new document to our state to instantly update the UI
      setDocuments(prevDocs => [...prevDocs, response.data.document]);
      setSelectedFile(null); // Clear the file input
      document.getElementById('file-input').value = ''; // A trick to clear the file input visually
    } catch (err) {
      setError(err.response?.data?.error || 'File upload failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="documents-page">
      <h2 className="page-title">Case Documents</h2>
      
      {/* Upload Form */}
      <div className="upload-container">
        <h3>Upload New Document</h3>
        <form onSubmit={handleUpload}>
          <input id="file-input" type="file" onChange={handleFileChange} className="file-input" />
          
          <div className="storage-options">
            <label>
              <input 
                type="radio" 
                value="MongoDB" 
                checked={storageType === 'MongoDB'} 
                onChange={(e) => setStorageType(e.target.value)} 
              />
              Standard (MongoDB)
            </label>
            <label>
              <input 
                type="radio" 
                value="Blockchain" 
                checked={storageType === 'Blockchain'} 
                onChange={(e) => setStorageType(e.target.value)} 
              />
              Secure Vault (Blockchain)
            </label>
          </div>
          
          <button type="submit" disabled={loading || !selectedFile}>
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Document List */}
      <div className="document-list">
        {documents.length === 0 && !loading && <p>No documents found for this case.</p>}
        {documents.map((doc) => (
          <div key={doc._id} className={`doc-card ${doc.storageType === 'Blockchain' ? 'vault' : ''}`}>
            <h4 className="doc-filename">{doc.originalName}</h4>
            <p>Type: {doc.contentType}</p>
            <p>Uploader: {doc.uploader?.name || 'N/A'}</p>
            <p>Uploaded: {new Date(doc.uploadedAt).toLocaleString()}</p>
            {doc.storageType === 'Blockchain' && <span className="vault-badge">Vault Protected</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;