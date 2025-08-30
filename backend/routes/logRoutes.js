const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const AuditService = require('../services/auditService');
const { authenticateToken } = require('../middleware/auth');

const logFile = path.join(__dirname, '../../gemini.md');

// Original logging endpoint
router.post('/', (req, res) => {
  const { level, message } = req.body;
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${level.toUpperCase()} (FRONTEND): ${message}\n`;

  fs.appendFileSync(logFile, logMessage);

  res.sendStatus(200);
});

// ==========================
// BLOCKCHAIN AUDIT TRAIL ENDPOINTS
// ==========================

// Get audit trail with pagination and filtering
router.get('/audit-trail', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, filter = 'all', targetId } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(Math.max(1, parseInt(limit)), 100);

    let auditTrail;
    if (targetId) {
      // Get audit trail for specific resource
      auditTrail = await AuditService.getAuditTrail(targetId, limitNum * pageNum);
    } else if (filter === 'user') {
      // Get user activity for current user
      auditTrail = await AuditService.getUserActivity(req.user.id, limitNum * pageNum);
    } else {
      // Get system-wide audit trail with filtering
      auditTrail = await AuditService.getFilteredAuditTrail({
        actionType: filter !== 'all' ? filter : undefined,
        page: pageNum,
        limit: limitNum
      });
    }

    const startIndex = (pageNum - 1) * limitNum;
    const paginatedTrail = auditTrail.slice(startIndex, startIndex + limitNum);
    const totalCount = auditTrail.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      auditTrail: paginatedTrail,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('❌ Get audit trail error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit trail',
      error: error.message
    });
  }
});

// Get blockchain chain statistics
router.get('/chain-stats', authenticateToken, async (req, res) => {
  try {
    const stats = await AuditService.getSystemStats();
    
    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Get chain stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chain statistics',
      error: error.message
    });
  }
});

// Verify blockchain chain integrity
router.post('/verify-chain', authenticateToken, async (req, res) => {
  try {
    const verification = await AuditService.verifyChainIntegrity();
    
    // Log the verification attempt
    await AuditService.logAction(
      'CHAIN_VERIFICATION',
      req.user.id,
      null,
      {
        action: 'Blockchain integrity verification performed',
        result: verification.valid ? 'VALID' : 'INVALID',
        totalBlocks: verification.totalBlocks,
        invalidBlocks: verification.invalidBlocks?.length || 0
      },
      req
    );

    res.json({
      success: true,
      verification
    });

  } catch (error) {
    console.error('❌ Chain verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying chain integrity',
      error: error.message
    });
  }
});

// Generate audit report for date range
router.post('/generate-report', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const report = await AuditService.generateAuditReport(startDate, endDate);
    
    // Log the report generation
    await AuditService.logAction(
      'AUDIT_REPORT_GENERATED',
      req.user.id,
      null,
      {
        action: 'Audit report generated',
        period: `${startDate} to ${endDate}`,
        totalActions: report.totalActions,
        totalBlocks: report.totalBlocks
      },
      req
    );

    res.json({
      success: true,
      report
    });

  } catch (error) {
    console.error('❌ Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating audit report',
      error: error.message
    });
  }
});

module.exports = router;
