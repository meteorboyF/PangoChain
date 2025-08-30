const express = require('express');
const { cloudinary, documentHelpers } = require('../config/cloudinary');
const Document = require('../models/Document');
const AuditService = require('../services/auditService');
const { authenticateToken } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// ==========================
// STEP 1: ENHANCE UPLOADED IMAGE
// ==========================
router.post('/enhance/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const { enhancement = 'auto' } = req.body;
    
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (!document.fileType?.includes('image')) {
      return res.status(400).json({ message: 'Document must be an image for enhancement' });
    }

    console.log(`🔧 Enhancing image: ${document.fileName}`);

    // Apply Cloudinary enhancements based on type
    let transformations = {
      resource_type: 'image',
      type: 'private'
    };

    switch (enhancement) {
      case 'document':
        // Optimize for document scanning
        transformations = {
          ...transformations,
          effect: 'sharpen:400',
          improve: 'indoor',
          contrast: '20',
          gamma: '1.2',
          quality: 'auto:best',
          format: 'png'
        };
        break;
      case 'text':
        // Optimize for text recognition
        transformations = {
          ...transformations,
          effect: 'sharpen:600',
          contrast: '30',
          brightness: '10',
          quality: 'auto:best',
          format: 'png'
        };
        break;
      case 'perspective':
        // Fix perspective and straighten
        transformations = {
          ...transformations,
          effect: 'deshake',
          angle: 'auto',
          quality: 'auto:best',
          format: 'png'
        };
        break;
      default: // 'auto'
        transformations = {
          ...transformations,
          improve: 'auto',
          quality: 'auto:best',
          format: 'png'
        };
    }

    // Generate enhanced image URL
    const enhancedUrl = cloudinary.url(document.cloudinaryPublicId, {
      ...transformations,
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 7200 // 2 hours
    });

    // Update the document with the new URL
    await Document.findByIdAndUpdate(documentId, {
      cloudinaryUrl: enhancedUrl,
    });

    // Log enhancement to audit trail
    await AuditService.logAction(
      'IMAGE_ENHANCE',
      req.user.id,
      documentId,
      {
        enhancement: enhancement,
        originalFile: document.fileName,
        enhancementSettings: transformations
      },
      req
    );

    res.json({
      success: true,
      documentId: documentId,
      fileName: document.fileName,
      enhancement: enhancement,
      enhancedUrl: enhancedUrl,
      originalUrl: document.cloudinaryUrl,
      transformations: transformations,
      expiresAt: new Date(Date.now() + 7200000).toISOString()
    });

  } catch (error) {
    console.error('❌ Image enhancement error:', error);
    res.status(500).json({ 
      message: 'Error enhancing image',
      error: error.message 
    });
  }
});

// ==========================
// STEP 2: ENHANCED OCR WITH FORMATTING
// ==========================
router.post('/ocr-enhanced/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const { useEnhanced = false } = req.body;
    
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    console.log(`🔍 Performing enhanced OCR on: ${document.fileName}`);

    let publicId = document.cloudinaryPublicId;
    
    // If using enhanced version, apply enhancements first
    if (useEnhanced && document.fileType?.includes('image')) {
      publicId = document.cloudinaryPublicId;
      // Enhancement will be applied via transformation in the OCR call
    }

    // Determine correct resource type for the document
    const resourceType = documentHelpers.getResourceType(document.fileType, document.fileName);
    console.log(`📄 Using resource type: ${resourceType} for OCR on ${publicId}`);

    // For Cloudinary free plan, skip OCR API and use alternative approach
    console.log('Using Cloudinary free plan - implementing alternative OCR approach');
    
    // Skip the API resource call since we're on free plan and it's causing 404s
    // Generate a high-quality version for manual text extraction directly from the stored URL
    const enhancedUrl = cloudinary.url(publicId, {
      resource_type: resourceType,
      quality: 'auto:best',
      format: 'png',
      effect: 'sharpen:400',
      contrast: '20',
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600
    });

    let extractedText = '';
    let confidence = 0;
    let formattedStructure = null;

    // Since Cloudinary free plan doesn't include OCR, provide manual extraction interface
    extractedText = 'CLOUDINARY_FREE_PLAN_NO_OCR';
    confidence = 0;
    formattedStructure = {
      requiresManualInput: true,
      enhancedImageUrl: enhancedUrl,
      instructions: 'Please manually type the text from the enhanced image below'
    };

    console.log('OCR not available on free plan, returning enhanced image for manual extraction');

    // Enhanced legal keyword detection (skip for free plan placeholder)
    let keywordsFound = [];
    let documentType = 'general';
    let wordCount = 0;
    
    if (extractedText !== 'CLOUDINARY_FREE_PLAN_NO_OCR') {
      const legalKeywords = [
        'contract', 'agreement', 'plaintiff', 'defendant', 'court', 'case', 'lawsuit', 
        'evidence', 'witness', 'judge', 'legal', 'attorney', 'lawyer', 'law', 
        'jurisdiction', 'settlement', 'damages', 'liability', 'breach', 'motion', 
        'ruling', 'verdict', 'affidavit', 'deposition', 'subpoena', 'injunction',
        'whereas', 'therefore', 'party', 'parties', 'shall', 'hereby', 'pursuant'
      ];

      keywordsFound = legalKeywords.filter(keyword => 
        extractedText.toLowerCase().includes(keyword.toLowerCase())
      );

      // Detect document type based on content
      documentType = detectDocumentType(extractedText, keywordsFound);
      
      // Calculate word count
      wordCount = extractedText.split(' ').filter(word => word.length > 0).length;
    }

    // Update the document with the OCR results
    await Document.findByIdAndUpdate(documentId, {
      extractedText: extractedText,
      ocrConfidence: confidence,
      ocrWordCount: wordCount,
      ocrKeywords: keywordsFound,
      detectedDocumentType: documentType,
    });

    // Log OCR to audit trail
    await AuditService.logAction(
      'ENHANCED_OCR',
      req.user.id,
      documentId,
      {
        originalFile: document.fileName,
        useEnhanced: useEnhanced,
        confidence: confidence,
        wordCount: extractedText.split(' ').length,
        detectedType: documentType
      },
      req
    );

    res.json({
      success: true,
      documentId: documentId,
      fileName: document.fileName,
      extractedText: extractedText,
      confidence: confidence,
      wordCount: wordCount,
      keywordsFound: keywordsFound,
      detectedDocumentType: documentType,
      formattedStructure: formattedStructure,
      ocrTimestamp: new Date().toISOString(),
      enhanced: useEnhanced
    });

  } catch (error) {
    console.error('❌ Enhanced OCR error:', error);
    res.status(500).json({ 
      message: 'Error processing enhanced OCR',
      error: error.message 
    });
  }
});

// ==========================
// STEP 3: FORMAT AS DOCUMENT
// ==========================
router.post('/format-document/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const { 
      extractedText, 
      documentType = 'general',
      template = 'basic',
      formatting = {},
      metadata = {}
    } = req.body;

    console.log('Request Body:', req.body);

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    console.log(`📄 Formatting document: ${document.fileName} as ${documentType}`);

    // Validate extractedText
    if (!extractedText || extractedText.trim() === '') {
      return res.status(400).json({ 
        message: 'No extracted text provided. Please extract text from the document first or manually input text.',
        error: 'extractedText is required'
      });
    }

    // Apply document template
    const formattedDocument = applyDocumentTemplate(extractedText, documentType, template, formatting, metadata);

    // Store formatted version
    const formattedDoc = {
      originalDocumentId: documentId,
      originalFileName: document.fileName,
      formattedContent: formattedDocument,
      documentType: documentType,
      template: template,
      formatting: formatting,
      metadata: {
        ...metadata,
        createdBy: req.user.name,
        createdAt: new Date().toISOString(),
        wordCount: extractedText ? extractedText.split(' ').filter(word => word.length > 0).length : 0
      }
    };

    // Log formatting to audit trail
    await AuditService.logAction(
      'DOCUMENT_FORMAT',
      req.user.id,
      documentId,
      {
        originalFile: document.fileName,
        documentType: documentType,
        template: template,
        wordCount: extractedText.split(' ').length
      },
      req
    );

    res.json({
      success: true,
      documentId: documentId,
      originalFileName: document.fileName,
      formattedDocument: formattedDoc,
      previewHtml: generatePreviewHTML(formattedDocument),
      readyForExport: true
    });

  } catch (error) {
    console.error('❌ Document formatting error:', error);
    res.status(500).json({ 
      message: 'Error formatting document',
      error: error.message 
    });
  }
});

// ==========================
// STEP 4: EXPORT TO PDF/WORD
// ==========================
router.post('/export/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const { 
      format = 'pdf',
      formattedContent,
      documentType = 'general',
      exportOptions = {}
    } = req.body;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    console.log(`💾 Exporting ${format.toUpperCase()}: ${document.fileName}`);

    let exportResult;

    if (format === 'pdf') {
      exportResult = await exportToPDF(formattedContent, document.fileName, exportOptions);
    } else if (format === 'docx') {
      exportResult = await exportToWord(formattedContent, document.fileName, exportOptions);
    } else {
      return res.status(400).json({ message: 'Unsupported export format' });
    }

    // Log export to audit trail
    await AuditService.logAction(
      'DOCUMENT_EXPORT',
      req.user.id,
      documentId,
      {
        originalFile: document.fileName,
        exportFormat: format,
        exportedFileName: exportResult.fileName,
        fileSize: exportResult.fileSize
      },
      req
    );

    res.json({
      success: true,
      documentId: documentId,
      originalFileName: document.fileName,
      exportFormat: format,
      exportedFile: exportResult,
      downloadUrl: exportResult.downloadUrl,
      expiresAt: exportResult.expiresAt
    });

  } catch (error) {
    console.error('❌ Document export error:', error);
    res.status(500).json({ 
      message: 'Error exporting document',
      error: error.message 
    });
  }
});

// ==========================
// HELPER FUNCTIONS
// ==========================

function extractParagraphs(textBlocks) {
  // Group text blocks into paragraphs based on position and spacing
  const paragraphs = [];
  let currentParagraph = [];
  let lastY = 0;

  textBlocks.forEach(block => {
    const y = block.boundingPoly?.vertices?.[0]?.y || 0;
    const lineHeight = 30; // Approximate line height threshold
    
    if (y - lastY > lineHeight * 2 && currentParagraph.length > 0) {
      paragraphs.push(currentParagraph.join(' '));
      currentParagraph = [];
    }
    
    currentParagraph.push(block.description);
    lastY = y;
  });

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(' '));
  }

  return paragraphs;
}

function extractHeadings(textBlocks) {
  // Identify potential headings (larger text, bold, all caps, etc.)
  return textBlocks
    .filter(block => {
      const text = block.description || '';
      return text.length < 100 && // Short text
             (text === text.toUpperCase() || // All caps
              text.match(/^[A-Z][A-Z\s]+$/)); // Title case
    })
    .map(block => block.description);
}

function extractLists(textBlocks) {
  // Identify list items (numbered, bulleted)
  return textBlocks
    .filter(block => {
      const text = block.description || '';
      return text.match(/^[\d\w]\.|^\*|^-|^•/); // Numbered or bulleted
    })
    .map(block => block.description);
}

function detectDocumentType(text, keywords) {
  const lowercaseText = text.toLowerCase();
  
  if (keywords.includes('contract') || keywords.includes('agreement')) {
    return 'contract';
  } else if (keywords.includes('motion') || keywords.includes('court')) {
    return 'motion';
  } else if (keywords.includes('evidence') || keywords.includes('exhibit')) {
    return 'evidence';
  } else if (keywords.includes('plaintiff') || keywords.includes('defendant')) {
    return 'pleading';
  } else if (lowercaseText.includes('correspondence') || lowercaseText.includes('letter')) {
    return 'correspondence';
  }
  
  return 'general';
}

function applyDocumentTemplate(text, documentType, template, formatting, metadata) {
  const templates = {
    contract: {
      header: `CONTRACT AGREEMENT\n\nDate: ${metadata.date || new Date().toLocaleDateString()}\nParties: ${metadata.parties || '[TO BE FILLED]'}\n\n`,
      footer: '\n\n_____________________\nSignature\n\nDate: _______________'
    },
    motion: {
      header: `MOTION TO THE COURT\n\nCase No: ${metadata.caseNumber || '[CASE NUMBER]'}\nDate: ${metadata.date || new Date().toLocaleDateString()}\n\n`,
      footer: '\n\nRespectfully submitted,\n\n_____________________\nAttorney Name\nBar Number: [BAR NUMBER]'
    },
    basic: {
      header: `${metadata.title || 'DOCUMENT'}\n\nDate: ${metadata.date || new Date().toLocaleDateString()}\n\n`,
      footer: ''
    }
  };

  const selectedTemplate = templates[template] || templates.basic;
  
  return {
    header: selectedTemplate.header,
    body: text,
    footer: selectedTemplate.footer,
    fullDocument: selectedTemplate.header + text + selectedTemplate.footer
  };
}

function generatePreviewHTML(formattedDocument) {
  return `
    <div style="font-family: 'Times New Roman', serif; max-width: 8.5in; margin: 0 auto; padding: 1in; background: white;">
      <div style="white-space: pre-line; margin-bottom: 2em; font-weight: bold;">
        ${formattedDocument.header}
      </div>
      <div style="white-space: pre-line; line-height: 1.6; text-align: justify;">
        ${formattedDocument.body}
      </div>
      <div style="white-space: pre-line; margin-top: 2em; text-align: right;">
        ${formattedDocument.footer}
      </div>
    </div>
  `;
}

async function exportToPDF(formattedContent, originalFileName, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: {
          top: 72,    // 1 inch
          bottom: 72,  // 1 inch  
          left: 72,   // 1 inch
          right: 72   // 1 inch
        }
      });

      const fileName = `${originalFileName.replace(/\.[^/.]+$/, '')}_formatted.pdf`;
      const filePath = path.join(__dirname, '../temp', fileName);
      
      // Ensure temp directory exists
      const tempDir = path.dirname(filePath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Add content
      doc.fontSize(12)
         .font('Times-Roman');

      // Header
      if (formattedContent.header) {
        doc.fontSize(14)
           .font('Times-Bold')
           .text(formattedContent.header, { align: 'center' })
           .moveDown();
      }

      // Body
      doc.fontSize(12)
         .font('Times-Roman')
         .text(formattedContent.body, { align: 'justify' })
         .moveDown();

      // Footer
      if (formattedContent.footer) {
        doc.text(formattedContent.footer, { align: 'right' });
      }

      doc.end();

      stream.on('finish', () => {
        const stats = fs.statSync(filePath);
        resolve({
          fileName: fileName,
          filePath: filePath,
          fileSize: stats.size,
          downloadUrl: `/api/scan-to-doc/download/${fileName}`,
          expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour
        });
      });

    } catch (error) {
      reject(error);
    }
  });
}

async function exportToWord(formattedContent, originalFileName, options = {}) {
  // For Word export, we'd use a library like docx
  // For now, return formatted text that can be downloaded
  const fileName = `${originalFileName.replace(/\.[^/.]+$/, '')}_formatted.txt`;
  const filePath = path.join(__dirname, '../temp', fileName);
  
  const tempDir = path.dirname(filePath);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const content = formattedContent.fullDocument || 
    `${formattedContent.header || ''}\n\n${formattedContent.body}\n\n${formattedContent.footer || ''}`;
  
  fs.writeFileSync(filePath, content, 'utf8');
  const stats = fs.statSync(filePath);

  return {
    fileName: fileName,
    filePath: filePath,
    fileSize: stats.size,
    downloadUrl: `/api/scan-to-doc/download/${fileName}`,
    expiresAt: new Date(Date.now() + 3600000).toISOString()
  };
}

// ==========================
// DOWNLOAD ENDPOINT
// ==========================
router.get('/download/:filename', authenticateToken, (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../temp', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
      
      // Cleanup file after download
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }, 60000); // Delete after 1 minute
    });

  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
});

module.exports = router;