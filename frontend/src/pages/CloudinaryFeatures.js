import React, { useState, useEffect } from "react";

function CloudinaryFeatures() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [ocrResults, setOcrResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');

  useEffect(() => {
    loadAllDocuments();
  }, []);

  const loadAllDocuments = async () => {
    try {
      const response = await fetch('/api/cloudinary/documents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  const performOCR = async (documentId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cloudinary/ocr/${documentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOcrResults(data);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("OCR processing failed");
    } finally {
      setLoading(false);
    }
  };

  const generatePreview = async (documentId) => {
    try {
      const response = await fetch(`/api/cloudinary/preview/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      return data.previewUrl;
    } catch (error) {
      console.error("Preview Error:", error);
      return null;
    }
  };

  const getFileTypeIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('word')) return '📝';
    return '📎';
  };

  return (
    <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
      <div style={{marginBottom: '30px'}}>
        <h1 style={{color: '#2c3e50', marginBottom: '10px'}}>☁️ Cloudinary Document Processing</h1>
        <p style={{color: '#6c757d'}}>OCR, PDF reading, and advanced document processing powered by Cloudinary AI</p>
      </div>

      {/* Tab Navigation */}
      <div style={{marginBottom: '30px', borderBottom: '2px solid #e9ecef'}}>
        <div style={{display: 'flex', gap: '0px'}}>
          <button 
            onClick={() => setActiveTab('documents')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: activeTab === 'documents' ? '#007bff' : 'transparent',
              color: activeTab === 'documents' ? 'white' : '#007bff',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              borderBottom: activeTab === 'documents' ? '3px solid #007bff' : '3px solid transparent'
            }}
          >
            📄 All Documents
          </button>
          <button 
            onClick={() => setActiveTab('ocr')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: activeTab === 'ocr' ? '#28a745' : 'transparent',
              color: activeTab === 'ocr' ? 'white' : '#28a745',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              borderBottom: activeTab === 'ocr' ? '3px solid #28a745' : '3px solid transparent'
            }}
          >
            🔍 OCR Processing
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: activeTab === 'analytics' ? '#ffc107' : 'transparent',
              color: activeTab === 'analytics' ? 'black' : '#ffc107',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              borderBottom: activeTab === 'analytics' ? '3px solid #ffc107' : '3px solid transparent'
            }}
          >
            📊 Analytics
          </button>
        </div>
      </div>

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div>
          <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>All Uploaded Documents</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
            {documents.map(doc => (
              <div key={doc.id} style={{
                background: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
                  <span style={{fontSize: '24px', marginRight: '10px'}}>
                    {getFileTypeIcon(doc.fileType)}
                  </span>
                  <div>
                    <h4 style={{margin: '0', fontSize: '16px', color: '#2c3e50'}}>{doc.fileName}</h4>
                    <p style={{margin: '0', fontSize: '12px', color: '#6c757d'}}>{doc.fileType}</p>
                  </div>
                </div>
                
                <div style={{marginBottom: '15px'}}>
                  <p style={{margin: '0 0 5px 0', fontSize: '12px', color: '#6c757d'}}>
                    Size: {Math.round(doc.fileSize / 1024)}KB | Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                  {doc.blockchainStored && (
                    <span style={{
                      background: '#d4edda',
                      color: '#155724',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      🔗 Blockchain Verified
                    </span>
                  )}
                </div>

                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  <button 
                    onClick={() => setSelectedDoc(doc)}
                    style={{
                      padding: '6px 12px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    👁️ View
                  </button>
                  {(doc.fileType?.includes('pdf') || doc.fileType?.includes('image')) && (
                    <button 
                      onClick={() => performOCR(doc.id)}
                      disabled={loading}
                      style={{
                        padding: '6px 12px',
                        background: loading ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {loading ? '⏳ Processing...' : '🔍 OCR'}
                    </button>
                  )}
                  <button 
                    style={{
                      padding: '6px 12px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    📊 Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px dashed #dee2e6'
            }}>
              <p style={{color: '#6c757d', fontSize: '18px'}}>No documents found. Upload some documents first!</p>
            </div>
          )}
        </div>
      )}

      {/* OCR Tab */}
      {activeTab === 'ocr' && (
        <div>
          <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>🔍 OCR Text Extraction Results</h3>
          
          {ocrResults ? (
            <div style={{
              background: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{color: '#28a745', marginBottom: '15px'}}>✅ OCR Processing Complete</h4>
              
              <div style={{marginBottom: '20px'}}>
                <strong>Document:</strong> {ocrResults.fileName}
                <br/>
                <strong>Confidence:</strong> {ocrResults.confidence}%
                <br/>
                <strong>Words Detected:</strong> {ocrResults.wordCount}
              </div>

              <div style={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '15px',
                maxHeight: '400px',
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                <h5 style={{color: '#2c3e50', marginBottom: '10px'}}>Extracted Text:</h5>
                <div>{ocrResults.extractedText}</div>
              </div>

              {ocrResults.keywordsFound && ocrResults.keywordsFound.length > 0 && (
                <div style={{marginTop: '15px'}}>
                  <h5 style={{color: '#2c3e50', marginBottom: '10px'}}>🏷️ Keywords Found:</h5>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
                    {ocrResults.keywordsFound.map((keyword, idx) => (
                      <span key={idx} style={{
                        background: '#e3f2fd',
                        color: '#1565c0',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px dashed #dee2e6'
            }}>
              <p style={{color: '#6c757d', fontSize: '18px'}}>Select a document and click "OCR" to extract text content</p>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>📊 Document Analytics</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'}}>
            <div style={{background: 'white', border: '1px solid #dee2e6', borderRadius: '12px', padding: '20px'}}>
              <h4 style={{color: '#007bff', marginBottom: '10px'}}>📄 Total Documents</h4>
              <p style={{fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#2c3e50'}}>{documents.length}</p>
            </div>
            
            <div style={{background: 'white', border: '1px solid #dee2e6', borderRadius: '12px', padding: '20px'}}>
              <h4 style={{color: '#28a745', marginBottom: '10px'}}>🔗 Blockchain Stored</h4>
              <p style={{fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#2c3e50'}}>
                {documents.filter(doc => doc.blockchainStored).length}
              </p>
            </div>
            
            <div style={{background: 'white', border: '1px solid #dee2e6', borderRadius: '12px', padding: '20px'}}>
              <h4 style={{color: '#ffc107', marginBottom: '10px'}}>💾 Total Storage</h4>
              <p style={{fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#2c3e50'}}>
                {Math.round(documents.reduce((total, doc) => total + doc.fileSize, 0) / 1024 / 1024)}MB
              </p>
            </div>
            
            <div style={{background: 'white', border: '1px solid #dee2e6', borderRadius: '12px', padding: '20px'}}>
              <h4 style={{color: '#dc3545', marginBottom: '10px'}}>📊 File Types</h4>
              <div style={{fontSize: '14px'}}>
                {Array.from(new Set(documents.map(doc => doc.fileType?.split('/')[1] || 'unknown')))
                  .map(type => (
                    <div key={type} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                      <span>{type.toUpperCase()}</span>
                      <span>{documents.filter(doc => doc.fileType?.includes(type)).length}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '80%',
            maxHeight: '80%',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedDoc(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            
            <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>{selectedDoc.fileName}</h3>
            
            <div style={{marginBottom: '20px'}}>
              <p><strong>File Type:</strong> {selectedDoc.fileType}</p>
              <p><strong>Size:</strong> {Math.round(selectedDoc.fileSize / 1024)}KB</p>
              <p><strong>Uploaded:</strong> {new Date(selectedDoc.uploadedAt).toLocaleString()}</p>
              {selectedDoc.blockchainStored && (
                <p><strong>Blockchain Hash:</strong> <code>{selectedDoc.documentHash}</code></p>
              )}
            </div>

            <div style={{textAlign: 'center'}}>
              <p style={{color: '#6c757d'}}>Document viewer and preview functionality will be implemented here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CloudinaryFeatures;