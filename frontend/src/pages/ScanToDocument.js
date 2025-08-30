import React, { useState, useEffect } from "react";

function ScanToDocument() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [ocrResults, setOcrResults] = useState(null);
  const [manualText, setManualText] = useState('');
  const [formattedDocument, setFormattedDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  const steps = [
    { number: 1, title: "Upload Image", icon: "📱", desc: "Select document photo" },
    { number: 2, title: "Enhance", icon: "🔧", desc: "Optimize for OCR" },
    { number: 3, title: "Extract Text", icon: "🔍", desc: "OCR processing" },
    { number: 4, title: "Format Document", icon: "📄", desc: "Apply template" },
    { number: 5, title: "Export", icon: "💾", desc: "Download PDF/Word" }
  ];

  const documentTypes = [
    { value: 'contract', label: 'Contract', template: 'contract' },
    { value: 'motion', label: 'Court Motion', template: 'motion' },
    { value: 'evidence', label: 'Evidence Document', template: 'basic' },
    { value: 'correspondence', label: 'Correspondence', template: 'basic' },
    { value: 'general', label: 'General Document', template: 'basic' }
  ];

  const enhancementTypes = [
    { value: 'auto', label: 'Auto Enhance', desc: 'General improvement' },
    { value: 'document', label: 'Document Mode', desc: 'Optimize for documents' },
    { value: 'text', label: 'Text Mode', desc: 'Best for text recognition' },
    { value: 'perspective', label: 'Fix Perspective', desc: 'Straighten skewed docs' }
  ];

  // Step 1: File Upload
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setLoading(true);

    try {
      // Upload to server first (using existing upload endpoint)
      const formData = new FormData();
      formData.append('document', file);
      formData.append('caseId', 'scan-to-doc-temp');
      formData.append('documentType', 'scan-source');
      formData.append('description', 'Scan-to-Document source image');
      formData.append('blockchainStorage', 'ethereum');

      const response = await fetch(`/api/documents/upload/scan-to-doc-temp`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setDocumentData(result.document);
      setCurrentStep(2);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Enhance Image
  const handleEnhancement = async (enhancementType) => {
    if (!documentData) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/scan-to-doc/enhance/${documentData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ enhancement: enhancementType })
      });

      const result = await response.json();
      setEnhancedImage(result);
      setCurrentStep(3);
      
    } catch (error) {
      console.error('Enhancement error:', error);
      alert('Enhancement failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: OCR Processing
  const handleOCR = async () => {
    if (!documentData) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/scan-to-doc/ocr-enhanced/${documentData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ useEnhanced: !!enhancedImage })
      });

      const result = await response.json();
      setOcrResults(result);
      setCurrentStep(4);
      
    } catch (error) {
      console.error('OCR error:', error);
      alert('OCR processing failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Format Document
  const handleFormatting = async (docType, template, metadata = {}) => {
    if (!ocrResults) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/scan-to-doc/format-document/${documentData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          extractedText: manualText || ocrResults.extractedText,
          documentType: docType,
          template: template,
          formatting: { fontSize: 12, fontFamily: 'Times New Roman' },
          metadata: metadata
        })
      });

      const result = await response.json();
      setFormattedDocument(result);
      setCurrentStep(5);
      
    } catch (error) {
      console.error('Formatting error:', error);
      alert('Document formatting failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Export Document
  const handleExport = async (format) => {
    if (!formattedDocument) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/scan-to-doc/export/${documentData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          format: format,
          formattedContent: formattedDocument.formattedDocument.formattedContent,
          documentType: formattedDocument.formattedDocument.documentType,
          exportOptions: { quality: 'high' }
        })
      });

      const result = await response.json();
      setExportResult(result);
      
      // Auto-download
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      }
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
      {/* Header */}
      <div style={{marginBottom: '30px', textAlign: 'center'}}>
        <h1 style={{color: '#2c3e50', marginBottom: '10px'}}>📱➡️📄 Scan to Document</h1>
        <p style={{color: '#6c757d', fontSize: '16px'}}>Transform photos into professional legal documents</p>
      </div>

      {/* Progress Steps */}
      <div style={{marginBottom: '40px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          {steps.map((step) => (
            <div key={step.number} style={{flex: 1, textAlign: 'center'}}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: currentStep >= step.number ? '#007bff' : '#e9ecef',
                color: currentStep >= step.number ? 'white' : '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px auto',
                fontSize: '24px',
                border: currentStep === step.number ? '3px solid #ffc107' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {step.icon}
              </div>
              <h4 style={{margin: '0 0 5px 0', fontSize: '14px', color: currentStep >= step.number ? '#2c3e50' : '#6c757d'}}>
                {step.title}
              </h4>
              <p style={{margin: '0', fontSize: '12px', color: '#6c757d'}}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div style={{height: '4px', background: '#e9ecef', borderRadius: '2px', position: 'relative'}}>
          <div style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #007bff, #28a745)',
            borderRadius: '2px',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
      </div>

      {/* Step Content */}
      <div style={{background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
        
        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <div style={{textAlign: 'center'}}>
            <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>📱 Upload Document Photo</h3>
            <div style={{
              border: '2px dashed #dee2e6',
              borderRadius: '12px',
              padding: '60px 20px',
              marginBottom: '20px',
              background: '#f8f9fa'
            }}>
              <div style={{fontSize: '48px', marginBottom: '20px'}}>📷</div>
              <p style={{color: '#6c757d', marginBottom: '20px'}}>
                Select a photo of your document to convert it into a formatted legal document
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{display: 'none'}}
                id="fileUpload"
                disabled={loading}
              />
              <label 
                htmlFor="fileUpload" 
                style={{
                  padding: '12px 30px',
                  background: loading ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'inline-block'
                }}
              >
                {loading ? '⏳ Uploading...' : '📤 Choose Image File'}
              </label>
            </div>
            <p style={{color: '#6c757d', fontSize: '14px'}}>
              Supported formats: JPG, PNG, WebP. For best results, ensure good lighting and clear text visibility.
            </p>
          </div>
        )}

        {/* Step 2: Enhancement */}
        {currentStep === 2 && (
          <div>
            <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>🔧 Enhance Image Quality</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px'}}>
              {enhancementTypes.map((enhancement) => (
                <div 
                  key={enhancement.value}
                  onClick={() => handleEnhancement(enhancement.value)}
                  style={{
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '20px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    background: 'white',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.background = '#f8f9fa')}
                  onMouseLeave={(e) => (e.target.style.background = 'white')}
                >
                  <h4 style={{color: '#2c3e50', marginBottom: '10px'}}>{enhancement.label}</h4>
                  <p style={{color: '#6c757d', fontSize: '14px', margin: '0'}}>{enhancement.desc}</p>
                </div>
              ))}
            </div>
            
            {selectedFile && (
              <div style={{textAlign: 'center', marginTop: '20px'}}>
                <h4 style={{color: '#2c3e50', marginBottom: '15px'}}>Original Image:</h4>
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Original document" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: OCR */}
        {currentStep === 3 && (
          <div>
            <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>🔍 Extract Text with OCR</h3>
            
            {enhancedImage && (
              <div style={{textAlign: 'center', marginBottom: '30px'}}>
                <h4 style={{color: '#28a745', marginBottom: '15px'}}>✅ Enhanced Image Ready</h4>
                <div style={{
                  background: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <p style={{margin: '0', color: '#155724'}}>
                    Enhancement applied: <strong>{enhancedImage.enhancement}</strong>
                  </p>
                  <p style={{margin: '5px 0 0 0', fontSize: '14px', color: '#155724'}}>
                    Image optimized for better text recognition accuracy
                  </p>
                </div>
              </div>
            )}

            <div style={{textAlign: 'center'}}>
              <button
                onClick={handleOCR}
                disabled={loading}
                style={{
                  padding: '15px 40px',
                  background: loading ? '#6c757d' : 'linear-gradient(45deg, #28a745, #20c997)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(40, 167, 69, 0.3)',
                  transition: 'all 0.3s ease',
                  animation: loading ? 'pulse 2s ease-in-out infinite' : 'none'
                }}
              >
                {loading ? '⚡ Processing OCR... (Live)' : '🔍 Extract Text Now'}
              </button>
              
              {loading && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'rgba(40, 167, 69, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(40, 167, 69, 0.2)'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px'}}>
                    <div style={{
                      width: '8px', height: '8px', background: '#28a745', 
                      borderRadius: '50%', animation: 'pulse 1s ease-in-out infinite'
                    }}></div>
                    <span style={{color: '#28a745', fontWeight: '600'}}>🚀 Live OCR Processing</span>
                  </div>
                  <div style={{
                    width: '100%', height: '4px', background: 'rgba(40, 167, 69, 0.2)',
                    borderRadius: '2px', overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', background: 'linear-gradient(90deg, #28a745, #20c997)',
                      borderRadius: '2px', animation: 'progressBar 3s ease-in-out infinite'
                    }}></div>
                  </div>
                  <p style={{color: '#28a745', margin: '10px 0 0 0', fontSize: '14px'}}>
                    ⚡ Advanced OCR with real-time blockchain verification
                  </p>
                </div>
              )}
              
              <p style={{color: '#6c757d', marginTop: '15px'}}>
                This may take a few moments depending on document complexity
              </p>
            </div>
            
            <style jsx>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
              }
              
              @keyframes progressBar {
                0% { width: 0%; }
                50% { width: 70%; }
                100% { width: 100%; }
              }
            `}</style>
          </div>
        )}

        {/* Step 4: Format Document */}
        {currentStep === 4 && ocrResults && (
          <div>
            <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>📄 Format as Legal Document</h3>
            
            {/* Check if using Cloudinary free plan (manual input needed) */}
            {ocrResults.extractedText === 'CLOUDINARY_FREE_PLAN_NO_OCR' ? (
              <div>
                {/* Manual Text Input for Free Plan */}
                <div style={{
                  background: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '30px'
                }}>
                  <h4 style={{color: '#856404', marginBottom: '15px'}}>⚠️ Manual Text Input Required</h4>
                  <p style={{color: '#856404', marginBottom: '15px'}}>
                    Cloudinary free plan doesn't support automatic OCR. Please view the enhanced image below and manually type the text you see.
                  </p>
                  
                  {/* Enhanced Image Display */}
                  {ocrResults.enhancedImageUrl && (
                    <div style={{textAlign: 'center', marginBottom: '20px'}}>
                      <h5 style={{color: '#856404', marginBottom: '10px'}}>📸 Enhanced Document Image:</h5>
                      <img 
                        src={ocrResults.enhancedImageUrl}
                        alt="Enhanced document for manual transcription" 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '500px',
                          border: '2px solid #ffeaa7',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Manual Text Input */}
                  <div>
                    <label style={{display: 'block', color: '#856404', fontWeight: '600', marginBottom: '10px'}}>
                      Type the text you see in the image:
                    </label>
                    <textarea
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Please type all the text visible in the document image above..."
                      style={{
                        width: '100%',
                        minHeight: '200px',
                        padding: '15px',
                        border: '2px solid #ffeaa7',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'Arial, sans-serif',
                        lineHeight: '1.5',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{marginTop: '10px', fontSize: '14px', color: '#856404'}}>
                      Words typed: <strong>{manualText.split(/\s+/).filter(word => word.length > 0).length}</strong>
                    </div>
                  </div>
                </div>
                
                {/* Document Type Selection - only show if text is entered */}
                {manualText.trim() && (
                  <div style={{marginBottom: '30px'}}>
                    <h4 style={{color: '#2c3e50', marginBottom: '15px'}}>Select Document Type:</h4>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                      {documentTypes.map((docType) => (
                        <button
                          key={docType.value}
                          onClick={() => handleFormatting(docType.value, docType.template, {
                            title: docType.label.toUpperCase(),
                            date: new Date().toLocaleDateString(),
                            caseNumber: '[CASE NUMBER]',
                            parties: '[PARTIES]'
                          })}
                          disabled={loading}
                          style={{
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            padding: '15px',
                            background: loading ? '#f8f9fa' : 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <h5 style={{color: '#2c3e50', marginBottom: '5px'}}>{docType.label}</h5>
                          <p style={{color: '#6c757d', fontSize: '14px', margin: '0'}}>
                            Uses {docType.template} template
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Automatic OCR Results */}
                <div style={{
                  background: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '30px'
                }}>
                  <h4 style={{color: '#155724', marginBottom: '10px'}}>✅ Text Extraction Complete</h4>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px'}}>
                    <div>
                      <strong>Confidence:</strong> {ocrResults.confidence || 'N/A'}%
                    </div>
                    <div>
                      <strong>Words:</strong> {ocrResults.wordCount || 0}
                    </div>
                    <div>
                      <strong>Detected Type:</strong> {ocrResults.detectedDocumentType || 'Unknown'}
                    </div>
                    <div>
                      <strong>Keywords:</strong> {ocrResults.keywordsFound?.length || 0}
                    </div>
                  </div>
                  
                  {ocrResults.keywordsFound && ocrResults.keywordsFound.length > 0 && (
                    <div style={{marginTop: '15px'}}>
                      <strong>Legal Keywords Found:</strong>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                        {ocrResults.keywordsFound.slice(0, 10).map((keyword, idx) => (
                          <span key={idx} style={{
                            background: '#c3e6cb',
                            color: '#155724',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Type Selection */}
                <div style={{marginBottom: '30px'}}>
                  <h4 style={{color: '#2c3e50', marginBottom: '15px'}}>Select Document Type:</h4>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                    {documentTypes.map((docType) => (
                      <button
                        key={docType.value}
                        onClick={() => handleFormatting(docType.value, docType.template, {
                          title: docType.label.toUpperCase(),
                          date: new Date().toLocaleDateString(),
                          caseNumber: '[CASE NUMBER]',
                          parties: '[PARTIES]'
                        })}
                        disabled={loading}
                        style={{
                          border: '1px solid #dee2e6',
                          borderRadius: '8px',
                          padding: '15px',
                          background: loading ? '#f8f9fa' : 'white',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <h5 style={{color: '#2c3e50', marginBottom: '5px'}}>{docType.label}</h5>
                        <p style={{color: '#6c757d', fontSize: '14px', margin: '0'}}>
                          Uses {docType.template} template
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Automatic OCR Text Preview */}
                <div>
                  <h4 style={{color: '#2c3e50', marginBottom: '15px'}}>Extracted Text Preview:</h4>
                  <div style={{
                    background: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '15px',
                    maxHeight: '300px',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {ocrResults.extractedText ? ocrResults.extractedText.substring(0, 1000) : 'No text extracted'}
                    {ocrResults.extractedText && ocrResults.extractedText.length > 1000 && '...'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Export */}
        {currentStep === 5 && formattedDocument && (
          <div>
            <h3 style={{color: '#2c3e50', marginBottom: '20px'}}>💾 Export Document</h3>
            
            {/* Success Message */}
            <div style={{
              background: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <h4 style={{color: '#155724', marginBottom: '10px'}}>✅ Document Formatted Successfully!</h4>
              <p style={{color: '#155724', margin: '0'}}>Your document is ready for export</p>
            </div>

            {/* Document Preview */}
            {formattedDocument.previewHtml && (
              <div style={{marginBottom: '30px'}}>
                <h4 style={{color: '#2c3e50', marginBottom: '15px'}}>Document Preview:</h4>
                <div style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '20px',
                  background: '#fff',
                  maxHeight: '400px',
                  overflow: 'auto',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div dangerouslySetInnerHTML={{ __html: formattedDocument.previewHtml }} />
                </div>
              </div>
            )}

            {/* Export Buttons */}
            <div style={{textAlign: 'center'}}>
              <h4 style={{color: '#2c3e50', marginBottom: '20px'}}>Choose Export Format:</h4>
              <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={loading}
                  style={{
                    padding: '15px 30px',
                    background: loading ? '#6c757d' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span>📄</span>
                  {loading ? 'Generating...' : 'Export as PDF'}
                </button>
                
                <button
                  onClick={() => handleExport('docx')}
                  disabled={loading}
                  style={{
                    padding: '15px 30px',
                    background: loading ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span>📝</span>
                  {loading ? 'Generating...' : 'Export as Word'}
                </button>
              </div>
              
              {exportResult && (
                <div style={{
                  background: '#d1ecf1',
                  border: '1px solid #bee5eb',
                  borderRadius: '8px',
                  padding: '15px',
                  marginTop: '20px'
                }}>
                  <p style={{color: '#0c5460', margin: '0', fontWeight: '600'}}>
                    ✅ Export Complete! File: {exportResult.exportedFile.fileName}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e9ecef'}}>
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || loading}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: currentStep === 1 || loading ? '#6c757d' : '#007bff',
              border: '1px solid',
              borderColor: currentStep === 1 || loading ? '#6c757d' : '#007bff',
              borderRadius: '6px',
              cursor: currentStep === 1 || loading ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous Step
          </button>

          <div style={{color: '#6c757d', fontSize: '14px'}}>
            Step {currentStep} of {steps.length}
          </div>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🔄 Start Over
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScanToDocument;