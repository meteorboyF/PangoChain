const AuditChain = require('../models/AuditChain');
const crypto = require('crypto');
const CryptoService = require('./cryptoService');
const PrivacyService = require('./privacyService');

class AuditService {
  constructor() {
    this.cryptoService = new CryptoService();
    this.privacyService = new PrivacyService();
  }
  
  // Initialize the audit chain with genesis block
  static async initialize() {
    try {
      const existingBlocks = await AuditChain.countDocuments();
      
      if (existingBlocks === 0) {
        console.log('Creating genesis block...');
        await AuditChain.createGenesisBlock();
        console.log('✅ Genesis block created');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Audit chain initialization failed:', error);
      return false;
    }
  }

  // Log any action in the system
  static async logAction(actionType, userId, targetId = null, details = {}, req = null) {
    try {
      // Extract request information for audit trail
      const auditDetails = {
        ...details,
        ip: req?.ip || 'unknown',
        userAgent: req?.get('User-Agent') || 'unknown',
        timestamp: new Date()
      };

      // Create digital signature of the action
      const actionData = {
        actionType,
        userId: userId.toString(),
        targetId,
        timestamp: auditDetails.timestamp
      };
      
      const signature = crypto
        .createHash('sha256')
        .update(JSON.stringify(actionData) + process.env.AUDIT_SECRET)
        .digest('hex');

      // Create audit action
      const auditAction = {
        actionId: `${actionType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        actionType,
        userId,
        targetId,
        details: auditDetails,
        signature
      };

      // Add to blockchain-inspired audit chain
      const auditBlock = await AuditChain.addAuditBlock(auditAction);
      
      console.log(`📝 Audit logged: ${actionType} by user ${userId}`);
      return auditBlock;
      
    } catch (error) {
      console.error('❌ Audit logging failed:', error);
      throw error;
    }
  }

  // Specialized logging methods for common actions
  static async logDocumentUpload(userId, documentId, fileName, caseId, req) {
    return await this.logAction('DOCUMENT_UPLOAD', userId, documentId, {
      fileName,
      caseId: caseId.toString(),
      action: 'File uploaded to case'
    }, req);
  }

  static async logDocumentView(userId, documentId, fileName, req) {
    return await this.logAction('DOCUMENT_VIEW', userId, documentId, {
      fileName,
      action: 'Document viewed'
    }, req);
  }

  static async logDocumentDownload(userId, documentId, fileName, req) {
    return await this.logAction('DOCUMENT_DOWNLOAD', userId, documentId, {
      fileName,
      action: 'Document downloaded'
    }, req);
  }

  static async logDocumentDelete(userId, documentId, fileName, req) {
    return await this.logAction('DOCUMENT_DELETE', userId, documentId, {
      fileName,
      action: 'Document permanently deleted',
      severity: 'HIGH'
    }, req);
  }

  static async logUserLogin(userId, email, req) {
    return await this.logAction('USER_LOGIN', userId, userId, {
      email,
      action: 'User logged in'
    }, req);
  }

  static async logUserRegister(userId, email, name, req) {
    return await this.logAction('USER_REGISTER', userId, userId, {
      email,
      name,
      action: 'New user registered'
    }, req);
  }

  static async logCaseCreate(userId, caseId, caseTitle, req) {
    return await this.logAction('CASE_CREATE', userId, caseId, {
      caseTitle,
      action: 'New case created'
    }, req);
  }

  static async logPermissionChange(adminUserId, targetUserId, oldRole, newRole, req) {
    return await this.logAction('PERMISSION_CHANGE', adminUserId, targetUserId, {
      oldValue: oldRole,
      newValue: newRole,
      action: 'User role changed',
      severity: 'HIGH'
    }, req);
  }

  // Get audit trail for a specific resource
  static async getAuditTrail(targetId, limit = 50) {
    try {
      const blocks = await AuditChain.find({
        'actions.targetId': targetId
      })
      .populate('actions.userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(limit);

      // Extract relevant actions
      const auditTrail = [];
      
      blocks.forEach(block => {
        block.actions.forEach(action => {
          if (action.targetId === targetId) {
            auditTrail.push({
              actionId: action.actionId,
              actionType: action.actionType,
              user: action.userId,
              details: action.details,
              timestamp: action.timestamp,
              blockId: block.blockId,
              blockHeight: block.blockHeight,
              signature: action.signature
            });
          }
        });
      });

      return auditTrail.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
    } catch (error) {
      console.error('❌ Get audit trail failed:', error);
      throw error;
    }
  }

  // Get user activity log
  static async getUserActivity(userId, limit = 50) {
    try {
      const blocks = await AuditChain.find({
        'actions.userId': userId
      })
      .populate('actions.userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(limit);

      const activities = [];
      
      blocks.forEach(block => {
        block.actions.forEach(action => {
          if (action.userId.toString() === userId.toString()) {
            activities.push({
              actionType: action.actionType,
              targetId: action.targetId,
              details: action.details,
              timestamp: action.timestamp,
              blockHeight: block.blockHeight
            });
          }
        });
      });

      return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
    } catch (error) {
      console.error('❌ Get user activity failed:', error);
      throw error;
    }
  }

  // Verify audit chain integrity
  static async verifyChainIntegrity() {
    try {
      console.log('🔍 Verifying audit chain integrity...');
      const results = await AuditChain.validateChain();
      
      const invalidBlocks = results.filter(r => !r.valid);
      
      if (invalidBlocks.length === 0) {
        console.log('✅ Audit chain integrity verified - all blocks valid');
        return { valid: true, totalBlocks: results.length };
      } else {
        console.log(`❌ Found ${invalidBlocks.length} invalid blocks`);
        invalidBlocks.forEach(block => {
          console.log(`   Block ${block.blockHeight}: ${block.error}`);
        });
        return { valid: false, totalBlocks: results.length, invalidBlocks };
      }
      
    } catch (error) {
      console.error('❌ Chain verification failed:', error);
      throw error;
    }
  }

  // Generate audit report
  static async generateAuditReport(startDate, endDate, options = {}) {
    try {
      const query = {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      const blocks = await AuditChain.find(query)
        .populate('actions.userId', 'name email role')
        .sort({ timestamp: 1 });

      const report = {
        period: { start: startDate, end: endDate },
        totalBlocks: blocks.length,
        totalActions: 0,
        actionSummary: {},
        userActivity: {},
        timeline: [],
        securityEvents: []
      };

      blocks.forEach(block => {
        block.actions.forEach(action => {
          report.totalActions++;
          
          // Action type summary
          if (!report.actionSummary[action.actionType]) {
            report.actionSummary[action.actionType] = 0;
          }
          report.actionSummary[action.actionType]++;
          
          // User activity summary
          const userKey = action.userId.name || 'Unknown User';
          if (!report.userActivity[userKey]) {
            report.userActivity[userKey] = 0;
          }
          report.userActivity[userKey]++;
          
          // Timeline entry
          report.timeline.push({
            timestamp: action.timestamp,
            user: userKey,
            action: action.actionType,
            target: action.targetId,
            details: action.details?.action || 'No description'
          });
          
          // Security events (high severity actions)
          if (action.details?.severity === 'HIGH') {
            report.securityEvents.push({
              timestamp: action.timestamp,
              user: userKey,
              action: action.actionType,
              details: action.details,
              blockId: block.blockId
            });
          }
        });
      });

      return report;
      
    } catch (error) {
      console.error('❌ Generate audit report failed:', error);
      throw error;
    }
  }

  // Create tamper-evident document hash
  static createDocumentHash(fileBuffer, metadata = {}) {
    const documentData = {
      content: crypto.createHash('sha256').update(fileBuffer).digest('hex'),
      metadata: {
        fileName: metadata.fileName,
        fileSize: metadata.fileSize,
        uploadedAt: metadata.uploadedAt || new Date(),
        uploadedBy: metadata.uploadedBy
      }
    };
    
    return crypto.createHash('sha256')
      .update(JSON.stringify(documentData))
      .digest('hex');
  }

  // Verify document integrity
  static verifyDocumentIntegrity(fileBuffer, originalHash, metadata) {
    const currentHash = this.createDocumentHash(fileBuffer, metadata);
    return currentHash === originalHash;
  }

  // Get filtered audit trail (new method for frontend)
  static async getFilteredAuditTrail(options = {}) {
    try {
      const { actionType, page = 1, limit = 20 } = options;
      
      let query = {};
      if (actionType) {
        query['actions.actionType'] = actionType;
      }

      const blocks = await AuditChain.find(query)
        .populate('actions.userId', 'name email role')
        .sort({ timestamp: -1 })
        .limit(limit * 5); // Get more blocks to ensure we have enough actions

      // Extract and flatten actions
      const auditTrail = [];
      
      blocks.forEach(block => {
        block.actions.forEach(action => {
          if (!actionType || action.actionType === actionType) {
            auditTrail.push({
              actionId: action.actionId,
              actionType: action.actionType,
              user: action.userId,
              details: action.details,
              timestamp: action.timestamp,
              blockId: block.blockId,
              blockHeight: block.blockHeight,
              signature: action.signature
            });
          }
        });
      });

      return auditTrail.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
    } catch (error) {
      console.error('❌ Get filtered audit trail failed:', error);
      throw error;
    }
  }

  // Get system statistics
  static async getSystemStats() {
    try {
      const totalBlocks = await AuditChain.countDocuments();
      const latestBlock = await AuditChain.findOne().sort({ blockHeight: -1 });
      
      // Count actions by type in the last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentBlocks = await AuditChain.find({
        timestamp: { $gte: thirtyDaysAgo }
      });
      
      const recentActionCounts = {};
      let totalRecentActions = 0;
      
      recentBlocks.forEach(block => {
        block.actions.forEach(action => {
          totalRecentActions++;
          if (!recentActionCounts[action.actionType]) {
            recentActionCounts[action.actionType] = 0;
          }
          recentActionCounts[action.actionType]++;
        });
      });

      return {
        totalBlocks,
        latestBlockHeight: latestBlock?.blockHeight || 0,
        chainStarted: latestBlock?.timestamp || null,
        last30Days: {
          totalActions: totalRecentActions,
          actionBreakdown: recentActionCounts
        }
      };
      
    } catch (error) {
      console.error('❌ Get system stats failed:', error);
      throw error;
    }
  }
}

module.exports = AuditService;