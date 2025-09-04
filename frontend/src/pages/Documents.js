import React, { useState, useEffect } from "react";
import "./Documents.css";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCase, setSelectedCase] = useState("");
  const [cases, setCases] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [blockchainMode, setBlockchainMode] = useState("dual");
  const [showBlockchainStatus, setShowBlockchainStatus] = useState(true);
  const [verifyingDocument, setVerifyingDocument] = useState(null);
  const [ocrProcessing, setOcrProcessing] = useState(null);
  const [ocrResults, setOcrResults] = useState({});

  // Document types for legal practice
  const documentTypes = [
    { value: "contract", label: "Contract" },
    { value: "evidence", label: "Evidence" },
    { value: "correspondence", label: "Correspondence" },
    { value: "pleading", label: "Pleading" },
    { value: "motion", label: "Motion" },
    { value: "discovery", label: "Discovery" },
    { value: "brief", label: "Brief" },
    { value: "general", label: "General" }
  ];

  // Blockchain storage options
  const blockchainOptions = [
    { value: "ethereum", label: "Ethereum Only", icon: "⟠", color: "#627eea" },
    { value: "hyperledger", label: "Hyperledger Only", icon: "🏢", color: "#2f5bea" },
    { value: "dual", label: "Both Networks (Recommended)", icon: "🔗", color: "#10b981" }
  ];

  useEffect(() => {
    loadCases();
    if (selectedCase) {
      loadDocuments(selectedCase);
    }
  }, [selectedCase]);

  const loadCases = async () => {
    try {
      const response = await fetch("/api/test/cases", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCases(data.cases || []);
      if (data.cases?.length > 0 && !selectedCase) {
        setSelectedCase(data.cases[0]._id);
      }
    } catch (error) {
      console.error("Error loading cases:", error);
    }
  };

  const loadDocuments = async (caseId) => {
    try {
      const response = await fetch(`/api/documents/case/${caseId}?includeAudit=true`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Error loading documents:", error);
      setDocuments([]);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0 || !selectedCase) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('document', file);
        formData.append('caseId', selectedCase);
        formData.append('documentType', document.getElementById('documentType').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('blockchainStorage', blockchainMode);

        const response = await fetch(`/api/documents/upload/${selectedCase}`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }

        const result = await response.json();
        
        // Show blockchain confirmation
        if (result.blockchain?.success) {
          console.log('🎉 Document stored on blockchain:', result.blockchain);
        }

        // Update progress
        const progress = Math.round(((i + 1) / files.length) * 100);
        setUploadProgress(progress);
      }

      // Refresh documents list
      await loadDocuments(selectedCase);
      
      // Reset form
      document.getElementById('fileInput').value = '';
      document.getElementById('description').value = '';
      
      alert(`Successfully uploaded ${files.length} document(s) to blockchain!`);
      
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/url?action=download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // Open secure URL in new tab for download
      window.open(data.secureUrl, '_blank');
      
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to generate download link");
    }
  };

  const handleView = async (documentId) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/url?action=view`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // Open secure URL in new tab for viewing
      window.open(data.secureUrl, '_blank');
      
    } catch (error) {
      console.error("View error:", error);
      alert("Failed to generate view link");
    }
  };

  const handleBlockchainVerification = async (documentId, fileName) => {
    setVerifyingDocument(documentId);
    
    try {
      const response = await fetch(`/api/documents/${documentId}/verify`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Verification request failed');
      }
      
      const verification = await response.json();
      
      // Show verification results
      const networkResults = Object.entries(verification.networks || {});
      let message = `🔍 Blockchain Verification Results for "${fileName}":\n\n`;
      
      networkResults.forEach(([network, result]) => {
        const networkIcon = network === 'ethereum' ? '⟠' : '🏢';
        const status = result.isValid || result.found ? '✅ VERIFIED' : '❌ FAILED';
        message += `${networkIcon} ${network.toUpperCase()}: ${status}\n`;
        
        if (network === 'ethereum' && result.transactionHash) {
          message += `   Transaction: ${result.transactionHash.substring(0, 20)}...\n`;
          message += `   Block: ${result.blockNumber}\n`;
        }
        if (network === 'hyperledger' && result.transactionId) {
          message += `   Transaction: ${result.transactionId.substring(0, 20)}...\n`;
          message += `   Channel: ${result.channel}\n`;
        }
        message += '\n';
      });
      
      message += `Overall Status: ${verification.overallStatus}\n`;
      message += `Compliance: ${verification.complianceStatus}`;
      
      alert(message);
      
    } catch (error) {
      console.error("Verification error:", error);
      alert(`Blockchain verification failed: ${error.message}`);
    } finally {
      setVerifyingDocument(null);
    }
  };

  const handleOCRProcessing = async (documentId, fileName) => {
    setOcrProcessing(documentId);
    
    try {
      const response = await fetch(`/api/cloudinary/ocr/${documentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('OCR processing failed');
      }
      
      const ocrData = await response.json();
      
      // Store OCR results
      setOcrResults(prev => ({
        ...prev,
        [documentId]: ocrData
      }));
      
      // Show OCR results in alert (you can make this prettier)
      let message = `🔍 OCR Results for "${fileName}":\n\n`;
      message += `Confidence: ${ocrData.confidence}%\n`;
      message += `Words: ${ocrData.wordCount}\n\n`;
      
      if (ocrData.keywordsFound && ocrData.keywordsFound.length > 0) {
        message += `Keywords found: ${ocrData.keywordsFound.join(', ')}\n\n`;
      }
      
      message += `Extracted Text:\n${ocrData.extractedText.substring(0, 500)}`;
      if (ocrData.extractedText.length > 500) {
        message += '...\n\n[View full text in Cloudinary tab]';
      }
      
      alert(message);
      
    } catch (error) {
      console.error("OCR error:", error);
      alert(`OCR processing failed: ${error.message}`);
    } finally {
      setOcrProcessing(null);
    }
  };

  const handleDelete = async (documentId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone and will be recorded on the blockchain.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Delete request failed');
      }
      
      await loadDocuments(selectedCase);
      alert("Document deleted successfully and logged to blockchain audit trail");
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Failed to delete document: ${error.message}`);
    }
  };

  const getBlockchainStatusIcon = (doc) => {
    if (!doc.blockchainStored) return '⚠️';
    
    const transactions = doc.blockchainTransactions || [];
    const hasEthereum = transactions.some(tx => tx.network === 'ethereum');
    const hasHyperledger = transactions.some(tx => tx.network === 'hyperledger');
    
    if (hasEthereum && hasHyperledger) return '🔗'; // Dual chain
    if (hasEthereum) return '⟠'; // Ethereum only
    if (hasHyperledger) return '🏢'; // Hyperledger only
    return '❓'; // Unknown
  };

  const getBlockchainStatusText = (doc) => {
    if (!doc.blockchainStored) return 'Not on blockchain';
    
    const transactions = doc.blockchainTransactions || [];
    const hasEthereum = transactions.some(tx => tx.network === 'ethereum');
    const hasHyperledger = transactions.some(tx => tx.network === 'hyperledger');
    
    if (hasEthereum && hasHyperledger) return 'Stored on both networks';
    if (hasEthereum) return 'Stored on Ethereum';
    if (hasHyperledger) return 'Stored on Hyperledger';
    return 'Unknown blockchain status';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === "all" || doc.documentType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="documents">
      <div className="documents-header">
        <h2>📄 Blockchain Document Management</h2>
        <p>Upload, organize, and securely manage legal documents with blockchain integrity</p>
      </div>

      {/* Case Selection */}
      <div className="case-selector">
        <label htmlFor="caseSelect">Select Case:</label>
        <select 
          id="caseSelect"
          value={selectedCase} 
          onChange={(e) => setSelectedCase(e.target.value)}
          className="case-select"
        >
          <option value="">Select a case...</option>
          {cases.map(caseItem => (
            <option key={caseItem._id} value={caseItem._id}>
              {caseItem.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCase && (
        <>
          {/* Upload Section with Blockchain Options */}
          <div className="upload-section">
            <h3>📤 Upload Documents to Blockchain</h3>
            
            <div className="blockchain-mode-selector">
              <label>Blockchain Storage Mode:</label>
              <div className="blockchain-options">
                {blockchainOptions.map(option => (
                  <div 
                    key={option.value}
                    className={`blockchain-option ${blockchainMode === option.value ? 'selected' : ''}`}
                    onClick={() => setBlockchainMode(option.value)}
                    style={{ borderColor: blockchainMode === option.value ? option.color : '#e5e7eb' }}
                  >
                    <div className="option-icon" style={{ color: option.color }}>
                      {option.icon}
                    </div>
                    <div className="option-label">{option.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="upload-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="documentType">Document Type:</label>
                  <select id="documentType" className="form-control">
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description (optional):</label>
                  <input 
                    type="text" 
                    id="description" 
                    placeholder="Brief description of the document"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="file-input-container">
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="file-input"
                />
                <label htmlFor="fileInput" className={`file-input-label ${uploading ? 'disabled' : ''}`}>
                  {uploading ? 'Uploading to Blockchain...' : '🔗 Upload to Blockchain'}
                </label>
              </div>

              {uploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill blockchain-progress" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}% - Processing blockchain transactions...</span>
                </div>
              )}
            </div>
          </div>

          {/* Blockchain Status Toggle */}
          <div className="blockchain-controls">
            <label className="blockchain-toggle">
              <input
                type="checkbox"
                checked={showBlockchainStatus}
                onChange={(e) => setShowBlockchainStatus(e.target.checked)}
              />
<span>Show Blockchain Status</span>            </label>
          </div>

          {/* Search and Filter */}
          <div className="documents-controls">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents List */}
          <div className="documents-list">
            <h3>Case Documents ({filteredDocuments.length})</h3>
            
            {filteredDocuments.length === 0 ? (
              <div className="no-documents">
                <p>No documents found. Upload some documents to get started with blockchain storage.</p>
              </div>
            ) : (
              <div className="documents-grid">
                {filteredDocuments.map(doc => (
                  <div key={doc.id} className={`document-card ${doc.blockchainStored ? 'blockchain-stored' : ''}`}>
                    <div className="document-info">
                      <div className="document-header">
                        <h4 className="document-name" title={doc.fileName}>
                          {doc.fileName}
                        </h4>
                        <div className="document-badges">
                          <span className={`document-type type-${doc.documentType}`}>
                            {doc.documentType}
                          </span>
                          {showBlockchainStatus && (
                            <span className="blockchain-status" title={getBlockchainStatusText(doc)}>
                              {getBlockchainStatusIcon(doc)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {doc.description && (
                        <p className="document-description">{doc.description}</p>
                      )}

                      {showBlockchainStatus && doc.blockchainStored && (
                        <div className="blockchain-info">
                          <div className="blockchain-status-text">
                            🔗 {getBlockchainStatusText(doc)}
                          </div>
                          {doc.documentHash && (
                            <div className="document-hash">
                              <small>Hash: {doc.documentHash.substring(0, 16)}...</small>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="document-meta">
                        <span className="file-size">{formatFileSize(doc.fileSize)}</span>
                        <span className="upload-date">{formatDate(doc.uploadedAt)}</span>
                      </div>

                      {doc.previewUrl && (
                        <div className="document-preview">
                          <img 
                            src={doc.previewUrl} 
                            alt="Document preview" 
                            className="preview-image"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="document-actions">
                      <button 
                        onClick={() => handleView(doc.id)}
                        className="btn btn-primary"
                        title="View document"
                      >
                        👁️ View
                      </button>
                      <button 
                        onClick={() => handleDownload(doc.id, doc.fileName)}
                        className="btn btn-secondary"
                        title="Download document"
                      >
                        ⬇️ Download
                      </button>
                      {doc.blockchainStored && (
                        <button 
                          onClick={() => handleBlockchainVerification(doc.id, doc.fileName)}
                          className={`btn btn-blockchain ${verifyingDocument === doc.id ? 'verifying' : ''}`}
                          title="Verify blockchain integrity"
                          disabled={verifyingDocument === doc.id}
                        >
                          {verifyingDocument === doc.id ? '🔍 Verifying...' : '🔗 Verify'}
                        </button>
                      )}
                      {(doc.fileName.toLowerCase().includes('.pdf') || doc.fileName.toLowerCase().includes('.png') || doc.fileName.toLowerCase().includes('.jpg') || doc.fileName.toLowerCase().includes('.jpeg')) && (
                        <button 
                          onClick={() => handleOCRProcessing(doc.id, doc.fileName)}
                          className={`btn btn-ocr ${ocrProcessing === doc.id ? 'processing' : ''}`}
                          title="Extract text with OCR"
                          disabled={ocrProcessing === doc.id}
                        >
                          {ocrProcessing === doc.id ? '⏳ Processing...' : '🔍 OCR'}
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(doc.id, doc.fileName)}
                        className="btn btn-danger"
                        title="Delete document"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <style jsx="true">{`
        .blockchain-mode-selector {
          margin-bottom: 20px;
        }

        .blockchain-mode-selector label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #374151;
        }

        .blockchain-options {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .blockchain-option {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
          min-width: 200px;
        }

        .blockchain-option:hover {
          background: #f9fafb;
        }

        .blockchain-option.selected {
          background: #f0f9ff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .option-icon {
          font-size: 18px;
          margin-right: 10px;
        }

        .option-label {
          font-weight: 500;
          font-size: 14px;
        }

        .blockchain-controls {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .blockchain-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
        }

        .document-card.blockchain-stored {
          border-left: 4px solid #10b981;
        }

        .document-badges {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .blockchain-status {
          font-size: 16px;
          cursor: help;
        }

        .blockchain-info {
          background: linear-gradient(135deg, #10b98110, #059f6910);
          padding: 10px;
          border-radius: 6px;
          margin: 10px 0;
          border: 1px solid #d1fae5;
        }

        .blockchain-status-text {
          font-size: 12px;
          font-weight: 600;
          color: #059669;
          margin-bottom: 5px;
        }

        .document-hash {
          font-family: monospace;
        }

        .document-hash small {
          color: #6b7280;
          font-size: 11px;
        }

        .progress-fill.blockchain-progress {
          background: linear-gradient(90deg, #10b981, #059669);
        }

        .btn-blockchain {
          color: #10b981;
          border: 1px solid #10b981;
        }

        .btn-blockchain:hover:not(.verifying) {
          background: #10b981;
          color: white;
        }

        .btn-blockchain.verifying {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-ocr {
          color: #e67e22;
          border: 1px solid #e67e22;
        }

        .btn-ocr:hover:not(.processing) {
          background: #e67e22;
          color: white;
        }

        .btn-ocr.processing {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .file-input-label {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .file-input-label:hover:not(.disabled) {
          background: linear-gradient(135deg, #059669, #047857);
        }

        @media (max-width: 768px) {
          .blockchain-options {
            flex-direction: column;
          }
          
          .blockchain-option {
            min-width: auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default Documents;