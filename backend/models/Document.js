const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true, index: true },
  description: { type: String },
  documentType: { type: String, required: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: false, index: true }, // Not required for temporary documents
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fileSize: { type: Number, required: true, min: 1 },
  fileType: { type: String, index: true },
  filePath: { type: String },
  cloudinaryPublicId: { type: String, index: true },
  cloudinaryUrl: { type: String },
  cloudinaryId: { type: String }, // Keep for backward compatibility
  documentHash: { type: String, required: true, minlength: 64, maxlength: 64 },
  blockchainStored: { type: Boolean, default: false, index: true },
  blockchainVerified: { type: Boolean, default: false, index: true },
  blockchainTransactions: [{
    network: String,
    transactionHash: String,
    transactionId: String,
    blockNumber: Number,
    gasUsed: Number,
    contractAddress: String,
    channel: String,
    chaincode: String,
    timestamp: Date
  }],
  isTemporary: { type: Boolean, default: false, index: true }, // To identify temporary documents
  extractedText: { type: String },
  ocrConfidence: { type: Number },
  ocrWordCount: { type: Number },
  ocrKeywords: [String],
  detectedDocumentType: { type: String, index: true },
  uploadedAt: { type: Date, default: Date.now, index: true }
});

// Add compound indexes for common queries
documentSchema.index({ uploadedBy: 1, uploadedAt: -1 });
documentSchema.index({ caseId: 1, uploadedAt: -1 });
documentSchema.index({ blockchainStored: 1, uploadedAt: -1 });
documentSchema.index({ isTemporary: 1, uploadedAt: 1 });
documentSchema.index({ documentType: 1, uploadedAt: -1 });
documentSchema.index({ uploadedBy: 1, caseId: 1 });

// Add text index for search functionality
documentSchema.index({ 
  fileName: 'text', 
  description: 'text', 
  extractedText: 'text' 
}, { 
  weights: { 
    fileName: 10, 
    description: 5, 
    extractedText: 1 
  } 
});

module.exports = mongoose.model('Document', documentSchema);