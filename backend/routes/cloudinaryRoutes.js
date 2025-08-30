const express = require('express');
const { documentHelpers, cloudinary } = require('../config/cloudinary');
const Document = require('../models/Document');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// ==========================
// GET ALL DOCUMENTS FOR CLOUDINARY FEATURES
// ==========================
router.get('/documents', authenticateToken, async (req, res) => {
  try {
    // Get documents only for the authenticated user
    const documents = await Document.find({ uploadedBy: req.user.id })
      .populate('uploadedBy', 'name email')
      .sort({ uploadedAt: -1 })
      .limit(100); // Limit for performance

    const transformedDocuments = documents.map(doc => ({
      id: doc._id,
      fileName: doc.fileName,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      uploadedAt: doc.uploadedAt,
      uploadedBy: doc.uploadedBy,
      documentHash: doc.documentHash,
      blockchainStored: doc.blockchainStored,
      cloudinaryPublicId: doc.cloudinaryPublicId,
      cloudinaryUrl: doc.cloudinaryUrl,
      description: doc.description,
      documentType: doc.documentType
    }));

    res.json({
      success: true,
      documents: transformedDocuments,
      total: transformedDocuments.length
    });

  } catch (error) {
    console.error('❌ Get documents error:', error);
    res.status(500).json({ 
      message: 'Error fetching documents',
      error: error.message 
    });
  }
});

// ==========================
// OCR TEXT EXTRACTION
// ==========================
router.post('/ocr/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    console.log(`🔍 Performing OCR on document: ${document.fileName}`);

    // Determine correct resource type for the document
    const resourceType = documentHelpers.getResourceType(document.fileType, document.fileName);
    console.log(`📄 Using resource type: ${resourceType} for OCR on ${document.cloudinaryPublicId}`);

    // Use Cloudinary's OCR capabilities
    const ocrResult = await cloudinary.api.resource(document.cloudinaryPublicId, {
      resource_type: resourceType,
      type: 'private',
      ocr: 'adv_ocr' // Advanced OCR
    });

    // Extract text from OCR results
    let extractedText = '';
    let confidence = 0;
    let wordCount = 0;

    if (ocrResult.info && ocrResult.info.ocr) {
      const ocrData = ocrResult.info.ocr.adv_ocr;
      if (ocrData && ocrData.data) {
        extractedText = ocrData.data.map(item => item.textAnnotations || [])
          .flat()
          .map(annotation => annotation.description)
          .join(' ');
        
        // Calculate average confidence
        const confidenceScores = ocrData.data
          .map(item => item.textAnnotations || [])
          .flat()
          .map(annotation => annotation.confidence || 0);
        
        confidence = confidenceScores.length > 0 
          ? Math.round(confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length * 100)
          : 0;
        
        wordCount = extractedText.split(' ').filter(word => word.length > 0).length;
      }
    }

    // Perform keyword analysis
    const legalKeywords = ['contract', 'agreement', 'plaintiff', 'defendant', 'court', 'case', 'lawsuit', 'evidence', 'witness', 'judge', 'legal', 'attorney', 'law', 'jurisdiction', 'settlement', 'damages', 'liability', 'breach', 'motion', 'ruling'];
    const keywordsFound = legalKeywords.filter(keyword => 
      extractedText.toLowerCase().includes(keyword)
    );

    const response = {
      success: true,
      documentId: documentId,
      fileName: document.fileName,
      extractedText: extractedText || 'No text could be extracted from this document.',
      confidence: confidence,
      wordCount: wordCount,
      keywordsFound: keywordsFound,
      ocrTimestamp: new Date().toISOString(),
      cloudinaryData: ocrResult.info || null
    };

    res.json(response);

  } catch (error) {
    console.error('❌ OCR processing error:', error);
    
    // Fallback response for documents without OCR support
    if (error.message && error.message.includes('ocr')) {
      return res.json({
        success: false,
        message: 'OCR not available for this file type',
        extractedText: 'OCR is only available for PDF files and images.',
        confidence: 0,
        wordCount: 0,
        keywordsFound: []
      });
    }

    res.status(500).json({ 
      message: 'Error processing OCR',
      error: error.message 
    });
  }
});

// ==========================
// GENERATE DOCUMENT PREVIEW
// ==========================
router.get('/preview/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    let previewUrl = null;
    
    // Generate different previews based on file type
    if (document.fileType?.includes('pdf')) {
      // PDF preview (first page as image)
      previewUrl = documentHelpers.generatePdfPreview(document.cloudinaryPublicId, {
        page: 1,
        width: 800,
        height: 1000
      });
    } else if (document.fileType?.includes('image')) {
      // Image thumbnail
      previewUrl = documentHelpers.generateThumbnail(document.cloudinaryPublicId, 800, 600);
    } else {
      // Generic file icon for other types
      previewUrl = null;
    }

    res.json({
      success: true,
      documentId: documentId,
      fileName: document.fileName,
      fileType: document.fileType,
      previewUrl: previewUrl,
      previewType: document.fileType?.includes('pdf') ? 'pdf_page' : 
                   document.fileType?.includes('image') ? 'thumbnail' : 'none'
    });

  } catch (error) {
    console.error('❌ Preview generation error:', error);
    res.status(500).json({ 
      message: 'Error generating preview',
      error: error.message 
    });
  }
});

// ==========================
// DOCUMENT TRANSFORMATION & ANALYSIS
// ==========================
router.post('/transform/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const { transformation } = req.body; // e.g., 'enhance', 'compress', 'convert'
    
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    let transformedUrl = null;
    
    // Determine correct resource type for the document
    const resourceType = documentHelpers.getResourceType(document.fileType, document.fileName);
    console.log(`📄 Using resource type: ${resourceType} for transformation ${transformation} on ${document.cloudinaryPublicId}`);
    
    switch (transformation) {
      case 'enhance':
        // Enhance document quality
        transformedUrl = cloudinary.url(document.cloudinaryPublicId, {
          resource_type: resourceType,
          type: 'private',
          quality: 'auto:best',
          fetch_format: 'auto',
          enhance: true,
          sign_url: true,
          expires_at: Math.floor(Date.now() / 1000) + 3600
        });
        break;
        
      case 'compress':
        // Compress for web viewing
        transformedUrl = cloudinary.url(document.cloudinaryPublicId, {
          resource_type: resourceType,
          type: 'private',
          quality: 'auto:low',
          fetch_format: 'auto',
          sign_url: true,
          expires_at: Math.floor(Date.now() / 1000) + 3600
        });
        break;
        
      case 'convert_pdf':
        // Convert to PDF (if supported)
        transformedUrl = cloudinary.url(document.cloudinaryPublicId, {
          resource_type: 'image',
          type: 'private',
          format: 'pdf',
          sign_url: true,
          expires_at: Math.floor(Date.now() / 1000) + 3600
        });
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid transformation type' });
    }

    res.json({
      success: true,
      documentId: documentId,
      transformation: transformation,
      transformedUrl: transformedUrl,
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour
    });

  } catch (error) {
    console.error('❌ Document transformation error:', error);
    res.status(500).json({ 
      message: 'Error transforming document',
      error: error.message 
    });
  }
});

// ==========================
// CLOUDINARY USAGE STATS
// ==========================
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const usageStats = await documentHelpers.getUsageStats();
    
    // Get document statistics
    const documentStats = await Document.aggregate([
      {
        $group: {
          _id: null,
          totalDocuments: { $sum: 1 },
          totalSize: { $sum: '$fileSize' },
          blockchainDocuments: {
            $sum: { $cond: ['$blockchainStored', 1, 0] }
          }
        }
      }
    ]);

    // Get file type distribution
    const fileTypeStats = await Document.aggregate([
      {
        $group: {
          _id: '$fileType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      cloudinary: usageStats,
      documents: documentStats[0] || {
        totalDocuments: 0,
        totalSize: 0,
        blockchainDocuments: 0
      },
      fileTypes: fileTypeStats,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching stats',
      error: error.message 
    });
  }
});

// ==========================
// DEBUG ENDPOINT - DOCUMENT URL TESTING
// ==========================
router.get('/debug/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Test different resource types
    const resourceType = documentHelpers.getResourceType(document.fileType, document.fileName);
    
    // Generate URLs with different resource types for testing
    const testUrls = {};
    const resourceTypes = ['auto', 'raw', 'image', 'video'];
    
    for (const type of resourceTypes) {
      try {
        testUrls[type] = documentHelpers.generateSecureUrl(document.cloudinaryPublicId, {
          resource_type: type,
          type: 'private'
        });
      } catch (error) {
        testUrls[type] = `Error: ${error.message}`;
      }
    }

    // Also test with the auto-detected resource type
    let detectedUrl;
    try {
      detectedUrl = documentHelpers.generateSecureUrl(document.cloudinaryPublicId, {
        resource_type: resourceType,
        type: 'private'
      });
    } catch (error) {
      detectedUrl = `Error: ${error.message}`;
    }

    res.json({
      success: true,
      document: {
        id: document._id,
        fileName: document.fileName,
        fileType: document.fileType,
        cloudinaryPublicId: document.cloudinaryPublicId,
        detectedResourceType: resourceType
      },
      testUrls: testUrls,
      detectedUrl: detectedUrl,
      directCloudinaryUrl: document.cloudinaryUrl
    });

  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    res.status(500).json({ 
      message: 'Error in debug endpoint',
      error: error.message 
    });
  }
});

module.exports = router;