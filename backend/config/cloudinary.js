const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const crypto = require('crypto');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Always use HTTPS
});

// Validate Cloudinary configuration on startup
const validateCloudinaryConfig = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary configuration missing. Check your environment variables:');
    console.error('   - CLOUDINARY_CLOUD_NAME');
    console.error('   - CLOUDINARY_API_KEY');
    console.error('   - CLOUDINARY_API_SECRET');
    process.exit(1);
  }
  console.log('✅ Cloudinary configuration loaded successfully');
};

// Call validation
validateCloudinaryConfig();

// ==========================
// DOCUMENT STORAGE CONFIGURATION
// ==========================

// Define storage configuration for legal documents
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      // Organize by case for better file management
      const caseId = req.body.caseId || req.params.caseId || 'general';
      return `pangochain/documents/${caseId}`;
    },
    allowed_formats: [
      // Document formats
      'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt',
      // Image formats for evidence
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp',
      // Other legal formats
      'xls', 'xlsx', 'ppt', 'pptx', 'csv'
    ],
    access_mode: 'authenticated', // Secure access for legal documents
    type: 'private', // Private storage for sensitive legal documents
    use_filename: false, // Use custom public_id instead of original filename
    unique_filename: true, // Add random chars to prevent conflicts
    public_id: (req, file) => {
      // Create organized, searchable file naming
      const timestamp = Date.now();
      const userId = req.user?.id || 'anonymous';
      const cleanFileName = file.originalname
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[^a-zA-Z0-9]/g, '_') // Replace special chars with underscore
        .substring(0, 50); // Limit length
      
      return `case_${req.body.caseId || req.params.caseId || 'general'}_${timestamp}_${cleanFileName}_by_${userId}`;
    },
    // Add metadata for better organization
    context: (req, file) => ({
      caseId: req.body.caseId || '',
      uploadedBy: req.user?.id || '',
      documentType: req.body.documentType || 'general',
      fileName: file.originalname,
      uploadDate: new Date().toISOString()
    }),
    // Add tags for searchability
    tags: (req, file) => {
      const tags = ['legal-document', 'pangochain'];
      if (req.body.caseId) tags.push(`case-${req.body.caseId}`);
      if (req.body.documentType) tags.push(`type-${req.body.documentType}`);
      if (req.user?.role) tags.push(`role-${req.user.role}`);
      return tags;
    }
  },
});

// Configure multer with Cloudinary storage for documents
const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for legal documents
    files: 10 // Maximum 10 files per upload
  },
  fileFilter: (req, file, cb) => {
    console.log(`📄 Processing file upload: ${file.originalname} (${file.mimetype})`);
    
    // Enhanced file type validation for legal documents
    const allowedMimes = [
      // Document types
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/rtf',
      'application/rtf',
      'application/vnd.oasis.opendocument.text',
      // Spreadsheets
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      // Presentations
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Images for evidence
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      console.log(`✅ File type accepted: ${file.mimetype}`);
      cb(null, true);
    } else {
      console.log(`❌ File type rejected: ${file.mimetype}`);
      cb(new Error(`Invalid file type: ${file.mimetype}. Only legal document formats are allowed.`), false);
    }
  }
});

// ==========================
// PROFILE PICTURE STORAGE CONFIGURATION
// ==========================

const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pangochain/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image',
    access_mode: 'public', // Profile pictures can be public
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Square crop focused on face
      { quality: 'auto:good' }, // Optimize quality
      { format: 'auto' } // Auto-select best format
    ],
    public_id: (req, file) => {
      const userId = req.user?.id || req.body.userId || 'anonymous';
      return `profile_${userId}_${Date.now()}`;
    },
    tags: ['profile-picture', 'user-avatar', 'pangochain']
  },
});

const uploadProfile = multer({
  storage: profileStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for profile pictures
    files: 1 // Only one profile picture at a time
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile pictures.'), false);
    }
  }
});

// ==========================
// CLOUDINARY HELPER FUNCTIONS
// ==========================

const documentHelpers = {
  
  // Helper function to determine resource type from file extension or MIME type
  getResourceType: (fileType, fileName = '') => {
    if (!fileType && !fileName) return 'raw';
    
    // Extract extension from filename if fileType is not available
    const extension = fileType ? fileType.toLowerCase() : fileName.split('.').pop().toLowerCase();
    
    // PDF documents should be treated as images for OCR
    if (['pdf', 'application/pdf'].includes(extension)) {
      return 'image';
    }

    // Image formats
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp'].includes(extension)) {
      return 'image';
    }
    
    // Video formats
    if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'ogv', 'video/mp4', 'video/mov', 'video/avi', 'video/webm'].includes(extension)) {
      return 'video';
    }
    
    // All other formats (DOC, etc.) are treated as raw
    return 'raw';
  },
  
  // Generate secure signed URL for private documents
  generateSecureUrl: (publicId, options = {}) => {
    try {
      // Determine resource type if not provided
      if (!options.resource_type) {
        options.resource_type = 'auto'; // Use auto-detection which works better
      }

      // Simple signed URL generation for private documents
      const defaultOptions = {
        type: 'private',
        resource_type: options.resource_type,
        sign_url: true,
        secure: true,
        expires_at: Math.floor(Date.now() / 1000) + (options.expiresIn || 3600)
      };

      // Merge custom options
      const signedOptions = { ...defaultOptions, ...options };
      
      const secureUrl = cloudinary.url(publicId, signedOptions);
      
      console.log(`Generated secure URL: ${secureUrl}`);
      console.log(`🔐 Generated secure URL for: ${publicId} (expires in ${options.expiresIn || 3600}s)`);
      
      return secureUrl;
    } catch (error) {
      console.error('❌ Failed to generate secure URL:', error);
      throw new Error(`Failed to generate secure URL: ${error.message}`);
    }
  },

  // Generate secure URL specifically for downloads
  generateDownloadUrl: (publicId, fileName, expiresIn = 3600) => {
    return documentHelpers.generateSecureUrl(publicId, {
      expiresIn,
      flags: 'attachment:' + fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    });
  },

  // Delete document from Cloudinary
  deleteDocument: async (publicId, fileType = '', fileName = '') => {
    try {
      console.log(`🗑️ Deleting document: ${publicId}`);
      
      const resourceType = documentHelpers.getResourceType(fileType, fileName);
      console.log(`📄 Using resource type: ${resourceType} for ${publicId}`);
      
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        type: 'private'
      });
      
      if (result.result === 'ok') {
        console.log(`✅ Document deleted successfully: ${publicId}`);
        return { success: true, result };
      } else {
        console.log(`⚠️ Document deletion result: ${result.result} for ${publicId}`);
        return { success: false, result };
      }
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  },

  // Get detailed document information
  getDocumentInfo: async (publicId, fileType = '', fileName = '') => {
    try {
      console.log(`ℹ️ Getting document info: ${publicId}`);
      
      const resourceType = documentHelpers.getResourceType(fileType, fileName);
      console.log(`📄 Using resource type: ${resourceType} for ${publicId}`);
      
      const result = await cloudinary.api.resource(publicId, {
        resource_type: resourceType,
        type: 'private'
      });
      
      return {
        publicId: result.public_id,
        format: result.format,
        resourceType: result.resource_type,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        createdAt: result.created_at,
        secureUrl: result.secure_url,
        context: result.context,
        tags: result.tags,
        metadata: result.metadata
      };
    } catch (error) {
      console.error('❌ Failed to get document info:', error);
      throw new Error(`Failed to get document info: ${error.message}`);
    }
  },

  // Generate PDF preview (first page as image)
  generatePdfPreview: (publicId, options = {}) => {
    try {
      const previewOptions = {
        resource_type: 'image',
        type: 'private',
        format: 'jpg',
        page: options.page || 1, // First page by default
        width: options.width || 400,
        height: options.height || 500,
        crop: 'fit',
        quality: 'auto:good',
        secure: true,
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
      };

      return cloudinary.url(publicId, previewOptions);
    } catch (error) {
      console.error('❌ Failed to generate PDF preview:', error);
      return null;
    }
  },

  // Generate thumbnail for any document type
  generateThumbnail: (publicId, width = 200, height = 200, fileType = '', fileName = '') => {
    try {
      const resourceType = documentHelpers.getResourceType(fileType, fileName);
      console.log(`📄 Using resource type: ${resourceType} for thumbnail ${publicId}`);
      
      return cloudinary.url(publicId, {
        resource_type: resourceType,
        type: 'private',
        width,
        height,
        crop: 'fit',
        quality: 'auto:good',
        format: 'jpg',
        secure: true,
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600
      });
    } catch (error) {
      console.error('❌ Failed to generate thumbnail:', error);
      return null;
    }
  },

  // Search documents by tags or context
  searchDocuments: async (searchOptions = {}) => {
    try {
      console.log('🔍 Searching documents:', searchOptions);
      
      // For search, we need to search across all resource types
      // We'll do separate searches and combine results
      const resourceTypes = ['raw', 'image', 'video'];
      let allResults = [];

      // Build search expression
      let expression = 'folder:pangochain/documents/*';
      
      if (searchOptions.caseId) {
        expression += ` AND tags:case-${searchOptions.caseId}`;
      }
      
      if (searchOptions.documentType) {
        expression += ` AND tags:type-${searchOptions.documentType}`;
      }
      
      if (searchOptions.uploadedBy) {
        expression += ` AND context:uploadedBy=${searchOptions.uploadedBy}`;
      }

      // Search across all resource types
      for (const resourceType of resourceTypes) {
        try {
          const searchParams = {
            resource_type: resourceType,
            type: 'private',
            max_results: searchOptions.limit || 50,
            ...searchOptions
          };
          
          const result = await cloudinary.search
            .expression(expression)
            .resource_type(resourceType)
            .execute();
          
          if (result.resources) {
            allResults = allResults.concat(result.resources);
          }
        } catch (error) {
          console.log(`⚠️ Search failed for resource type ${resourceType}:`, error.message);
          // Continue with next resource type
        }
      }
      
      return {
        total: allResults.length,
        documents: allResults.map(resource => ({
          publicId: resource.public_id,
          fileName: resource.context?.fileName || 'Unknown',
          format: resource.format,
          bytes: resource.bytes,
          createdAt: resource.created_at,
          caseId: resource.context?.caseId,
          documentType: resource.context?.documentType,
          uploadedBy: resource.context?.uploadedBy
        }))
      };
    } catch (error) {
      console.error('❌ Document search failed:', error);
      throw new Error(`Document search failed: ${error.message}`);
    }
  },

  // Validate document integrity using Cloudinary's hash
  validateDocumentIntegrity: async (publicId, expectedHash = null) => {
    try {
      const documentInfo = await documentHelpers.getDocumentInfo(publicId);
      
      // Cloudinary provides etag which can be used for integrity checking
      const cloudinaryHash = documentInfo.etag;
      
      if (expectedHash) {
        const isValid = cloudinaryHash === expectedHash;
        return {
          valid: isValid,
          cloudinaryHash,
          expectedHash,
          message: isValid ? 'Document integrity verified' : 'Document integrity violation detected'
        };
      }
      
      return {
        valid: true,
        cloudinaryHash,
        message: 'Document hash retrieved successfully'
      };
    } catch (error) {
      console.error('❌ Integrity validation failed:', error);
      throw new Error(`Integrity validation failed: ${error.message}`);
    }
  },

  // Batch operations for multiple documents
  batchDeleteDocuments: async (documentsArray) => {
    try {
      console.log(`🗑️ Batch deleting ${documentsArray.length} documents`);
      
      const deletePromises = documentsArray.map(doc => {
        const publicId = doc.publicId || doc;
        const fileType = doc.fileType || '';
        const fileName = doc.fileName || '';
        const resourceType = documentHelpers.getResourceType(fileType, fileName);
        
        console.log(`📄 Deleting ${publicId} as ${resourceType}`);
        
        return cloudinary.uploader.destroy(publicId, { 
          resource_type: resourceType,
          type: 'private' 
        });
      });
      
      const results = await Promise.allSettled(deletePromises);
      
      const successful = results.filter(result => result.status === 'fulfilled' && result.value.result === 'ok').length;
      const failed = results.length - successful;
      
      console.log(`✅ Batch delete complete: ${successful} successful, ${failed} failed`);
      
      return {
        total: documentsArray.length,
        successful,
        failed,
        details: results
      };
    } catch (error) {
      console.error('❌ Batch delete failed:', error);
      throw new Error(`Batch delete failed: ${error.message}`);
    }
  },

  // Generate usage statistics
  getUsageStats: async () => {
    try {
      const usage = await cloudinary.api.usage();
      
      return {
        plan: usage.plan,
        storage: {
          used: usage.storage.used_bytes,
          limit: usage.storage.limit,
          percentage: Math.round((usage.storage.used_bytes / usage.storage.limit) * 100)
        },
        bandwidth: {
          used: usage.bandwidth.used_bytes,
          limit: usage.bandwidth.limit,
          percentage: Math.round((usage.bandwidth.used_bytes / usage.bandwidth.limit) * 100)
        },
        requests: {
          used: usage.requests,
          limit: usage.requests_limit,
          percentage: Math.round((usage.requests / usage.requests_limit) * 100)
        },
        transformations: {
          used: usage.transformations,
          limit: usage.transformations_limit,
          percentage: Math.round((usage.transformations / usage.transformations_limit) * 100)
        }
      };
    } catch (error) {
      console.error('❌ Failed to get usage stats:', error);
      throw new Error(`Failed to get usage stats: ${error.message}`);
    }
  },

  // Test Cloudinary connection
  testConnection: async () => {
    try {
      console.log('🧪 Testing Cloudinary connection...');
      
      const pingResult = await cloudinary.api.ping();
      console.log('✅ Cloudinary ping successful:', pingResult);
      
      const usage = await cloudinary.api.usage();
      console.log('✅ Cloudinary usage retrieved successfully');
      
      return {
        connected: true,
        ping: pingResult,
        usage: {
          plan: usage.plan,
          storage: usage.storage,
          bandwidth: usage.bandwidth
        }
      };
    } catch (error) {
      console.error('❌ Cloudinary connection test failed:', error);
      return {
        connected: false,
        error: error.message
      };
    }
  }
};

// ==========================
// INITIALIZATION AND VALIDATION
// ==========================

// Test connection on module load (optional - can be disabled in production)
if (process.env.NODE_ENV !== 'production') {
  documentHelpers.testConnection()
    .then(result => {
      if (result.connected) {
        console.log('✅ Cloudinary connection verified');
      } else {
        console.log('⚠️ Cloudinary connection test failed:', result.error);
      }
    })
    .catch(error => {
      console.log('⚠️ Cloudinary connection test error:', error.message);
    });
}

// ==========================
// EXPORTS
// ==========================

module.exports = {
  cloudinary,
  uploadDocument,
  uploadProfile,
  documentHelpers,
  
  // Additional exports for advanced usage
  CloudinaryStorage, // For custom storage configurations
  
  // Configuration validation
  isConfigured: () => {
    return !!(process.env.CLOUDINARY_CLOUD_NAME && 
              process.env.CLOUDINARY_API_KEY && 
              process.env.CLOUDINARY_API_SECRET);
  },
  
  // Get current configuration (without sensitive data)
  getConfig: () => ({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'Not set',
    configured: module.exports.isConfigured()
  })
};