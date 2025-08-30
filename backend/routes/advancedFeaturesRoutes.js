const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const CryptoService = require('../services/cryptoService');
const ConsensusService = require('../services/consensusService');
const PrivacyService = require('../services/privacyService');
const AuditService = require('../services/auditService');

// Initialize services
const cryptoService = new CryptoService();
const consensusService = new ConsensusService();
const privacyService = new PrivacyService();

// ==========================
// DIGITAL SIGNATURES ROUTES
// ==========================

// Generate user key pair
router.post('/crypto/generate-keys', authenticateToken, async (req, res) => {
  try {
    const keyPair = await cryptoService.generateUserKeyPair(req.userId);
    
    // Log key generation
    await AuditService.logAction(
      'CRYPTO_KEY_GENERATION',
      req.userId,
      req.userId,
      { action: 'RSA key pair generated', keyId: keyPair.keyId },
      req
    );

    res.json({
      success: true,
      keyId: keyPair.keyId,
      publicKey: keyPair.publicKey,
      message: 'RSA key pair generated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's public key
router.get('/crypto/public-key', authenticateToken, async (req, res) => {
  try {
    const publicKey = await cryptoService.getUserPublicKey(req.userId);
    res.json({ publicKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign data with user's private key
router.post('/crypto/sign', authenticateToken, async (req, res) => {
  try {
    const { data } = req.body;
    const signature = await cryptoService.signData(data, req.userId);
    
    await AuditService.logAction(
      'DIGITAL_SIGNATURE_CREATED',
      req.userId,
      null,
      { action: 'Data digitally signed', algorithm: signature.algorithm },
      req
    );

    res.json({ signature });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify digital signature
router.post('/crypto/verify', authenticateToken, async (req, res) => {
  try {
    const { data, signature, userId } = req.body;
    const verification = await cryptoService.verifySignature(data, signature, userId);
    
    await AuditService.logAction(
      'SIGNATURE_VERIFICATION',
      req.userId,
      userId,
      { 
        action: 'Digital signature verified',
        isValid: verification.isValid,
        verifiedBy: req.userId
      },
      req
    );

    res.json({ verification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate user certificate
router.get('/crypto/certificate', authenticateToken, async (req, res) => {
  try {
    const certificate = await cryptoService.generateUserCertificate(req.userId, req.user);
    
    await AuditService.logAction(
      'CERTIFICATE_GENERATED',
      req.userId,
      req.userId,
      { action: 'Digital certificate generated', serialNumber: certificate.certificate.serialNumber },
      req
    );

    res.json({ certificate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cryptographic system statistics
router.get('/crypto/stats', authenticateToken, requireRole(['partner', 'lawyer', 'associate', 'junior', 'paralegal']), async (req, res) => {
  try {
    const stats = await cryptoService.getSystemCryptoStats();
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================
// CONSENSUS SIMULATION ROUTES
// ==========================

// Get network status
router.get('/consensus/network-status', authenticateToken, async (req, res) => {
  try {
    const networkStatus = consensusService.getNetworkStatus();
    res.json({ networkStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detailed node information
router.get('/consensus/nodes', authenticateToken, async (req, res) => {
  try {
    const nodes = consensusService.getNodeDetails();
    res.json({ nodes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulate consensus for a test block
router.post('/consensus/simulate', authenticateToken, requireRole(['partner', 'lawyer', 'associate', 'junior']), async (req, res) => {
  try {
    const { algorithm = 'PBFT' } = req.body;
    
    // Create a test block
    const testBlock = {
      blockId: `test-block-${Date.now()}`,
      blockHeight: Math.floor(Date.now() / 1000),
      previousHash: '0'.repeat(64),
      actions: [{
        actionType: 'CONSENSUS_TEST',
        userId: req.userId,
        details: { action: 'Testing consensus mechanism' }
      }],
      timestamp: new Date()
    };
    
    // Calculate proper block hash
    const blockData = {
      blockHeight: testBlock.blockHeight,
      previousHash: testBlock.previousHash,
      actions: testBlock.actions.map(a => a.actionType || JSON.stringify(a)).join('|'),
      timestamp: testBlock.timestamp
    };
    testBlock.blockHash = require('crypto').createHash('sha256').update(JSON.stringify(blockData)).digest('hex');

    const consensusResult = await consensusService.runConsensusAlgorithm(testBlock, algorithm);
    
    await AuditService.logAction(
      'CONSENSUS_SIMULATION',
      req.userId,
      null,
      { 
        action: 'Consensus simulation executed',
        algorithm,
        success: consensusResult.success || consensusResult.result?.success,
        blockHeight: testBlock.blockHeight
      },
      req
    );

    res.json({ 
      testBlock: {
        blockHeight: testBlock.blockHeight,
        blockHash: testBlock.blockHash.substring(0, 16) + '...'
      },
      consensusResult 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get consensus statistics
router.get('/consensus/stats', authenticateToken, async (req, res) => {
  try {
    const stats = consensusService.getConsensusStatistics();
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulate network partition 
router.post('/consensus/simulate-partition', authenticateToken, async (req, res) => {
  try {
    const { percentage = 0.3 } = req.body;
    const partitionResult = consensusService.simulateNetworkPartition(percentage);
    
    await AuditService.logAction(
      'NETWORK_PARTITION_SIMULATION',
      req.userId,
      null,
      { 
        action: 'Network partition simulated',
        percentage,
        nodesAffected: partitionResult.disconnectedNodes,
        severity: 'HIGH'
      },
      req
    );

    res.json({ partitionResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restore network connectivity
router.post('/consensus/restore-network', authenticateToken, async (req, res) => {
  try {
    const restored = consensusService.restoreNetwork();
    
    await AuditService.logAction(
      'NETWORK_RESTORATION',
      req.userId,
      null,
      { action: 'Network connectivity restored', nodesRestored: restored },
      req
    );

    res.json({ message: 'Network restored', nodesRestored: restored });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================
// PRIVACY FEATURES ROUTES
// ==========================

// Get user's anonymized profile
router.get('/privacy/profile/:level?', authenticateToken, async (req, res) => {
  try {
    const level = parseInt(req.params.level) || 2; // Default to MODERATE
    const anonymizedProfile = privacyService.anonymizeUserProfile(req.user, level);
    
    res.json({ profile: anonymizedProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate zero-knowledge proof for document access
router.post('/privacy/generate-zk-proof', authenticateToken, async (req, res) => {
  try {
    const { documentHash } = req.body;
    if (!documentHash) {
      return res.status(400).json({ error: 'Document hash required' });
    }

    const proof = privacyService.generateDocumentExistenceProof(documentHash, req.userId);
    
    await AuditService.logAction(
      'ZK_PROOF_GENERATED',
      req.userId,
      null,
      { 
        action: 'Zero-knowledge proof generated',
        proofType: 'document-existence',
        privacyPreserving: true
      },
      req
    );

    res.json({ proof });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify zero-knowledge proof
router.post('/privacy/verify-zk-proof', authenticateToken, async (req, res) => {
  try {
    const { proof } = req.body;
    const verification = privacyService.verifyDocumentExistenceProof(proof);
    
    await AuditService.logAction(
      'ZK_PROOF_VERIFIED',
      req.userId,
      null,
      { 
        action: 'Zero-knowledge proof verified',
        isValid: verification.verified,
        privacyPreserving: true
      },
      req
    );

    res.json({ verification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get privacy-preserving analytics
router.get('/privacy/analytics', authenticateToken, requireRole(['partner', 'lawyer', 'associate', 'junior']), async (req, res) => {
  try {
    // Mock data for demonstration
    const mockData = {
      userActions: Array(50).fill().map((_, i) => ({ id: i })),
      documentAccess: Array(30).fill().map((_, i) => ({
        documentType: ['contract', 'brief', 'evidence'][i % 3],
        timeOfDay: ['morning', 'afternoon', 'evening'][i % 3],
        fileSize: Math.floor(Math.random() * 1000000)
      })),
      roleDistribution: {
        lawyer: 15,
        paralegal: 8,
        partner: 3,
        client: 25
      }
    };

    const analytics = await privacyService.generatePrivateAnalytics(mockData, 2);
    
    await AuditService.logAction(
      'PRIVACY_ANALYTICS_GENERATED',
      req.userId,
      null,
      { action: 'Privacy-preserving analytics generated', privacyLevel: 2 },
      req
    );

    res.json({ analytics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get privacy capabilities and compliance info
router.get('/privacy/capabilities', authenticateToken, async (req, res) => {
  try {
    const capabilities = privacyService.getPrivacyCapabilities();
    res.json({ capabilities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate privacy compliance report
router.get('/privacy/compliance-report', authenticateToken, async (req, res) => {
  try {
    const report = privacyService.generatePrivacyReport();
    
    await AuditService.logAction(
      'PRIVACY_REPORT_GENERATED',
      req.userId,
      null,
      { action: 'Privacy compliance report generated', reportType: report.reportType },
      req
    );

    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create privacy-preserving audit entry
router.post('/privacy/create-audit', authenticateToken, async (req, res) => {
  try {
    const { action, details, privacyLevel = 2 } = req.body;
    const privateAudit = privacyService.createPrivateAuditEntry(action, req.userId, details, privacyLevel);
    
    res.json({ audit: privateAudit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================
// COMBINED FEATURES DEMO
// ==========================

// Demonstrate all three features working together
router.post('/demo/integrated-features', authenticateToken, requireRole(['partner', 'lawyer', 'associate', 'junior']), async (req, res) => {
  try {
    console.log('\n🚀 Starting integrated features demonstration...');

    // 1. Digital Signatures Demo
    const testData = { message: 'PangoChain Advanced Features Demo', timestamp: new Date() };
    const signature = await cryptoService.signData(testData, req.userId);
    const verification = await cryptoService.verifySignature(testData, signature, req.userId);

    // 2. Consensus Demo
    const testBlock = {
      blockId: `demo-block-${Date.now()}`,
      blockHeight: Math.floor(Date.now() / 1000),
      previousHash: '0'.repeat(64),
      actions: [{ actionType: 'DEMO_TRANSACTION', userId: req.userId }],
      timestamp: new Date()
    };
    
    // Calculate proper block hash
    const blockData = {
      blockHeight: testBlock.blockHeight,
      previousHash: testBlock.previousHash,
      actions: testBlock.actions.map(a => a.actionType || JSON.stringify(a)).join('|'),
      timestamp: testBlock.timestamp
    };
    testBlock.blockHash = require('crypto').createHash('sha256').update(JSON.stringify(blockData)).digest('hex');
    const consensusResult = await consensusService.runConsensusAlgorithm(testBlock, 'PBFT');

    // 3. Privacy Demo
    const anonymizedProfile = privacyService.anonymizeUserProfile(req.user, 2);
    const zkProof = privacyService.generateDocumentExistenceProof(testBlock.blockHash, req.userId);
    const zkVerification = privacyService.verifyDocumentExistenceProof(zkProof);

    // Combined result
    const demoResult = {
      demo: 'PangoChain Advanced Features Integration',
      timestamp: new Date(),
      features: {
        digitalSignatures: {
          signature: signature.signature.substring(0, 20) + '...',
          verified: verification.isValid,
          algorithm: signature.algorithm
        },
        consensus: {
          algorithm: 'PBFT',
          success: consensusResult.result?.success,
          validators: consensusResult.votes?.length || 0,
          blockHeight: testBlock.blockHeight
        },
        privacy: {
          anonymizedUser: anonymizedProfile.id,
          privacyLevel: anonymizedProfile.privacyLevel,
          zkProofGenerated: !!zkProof.proof,
          zkProofVerified: zkVerification.verified
        }
      },
      summary: {
        allFeaturesWorking: verification.isValid && 
                          (consensusResult.result?.success || consensusResult.success) && 
                          zkVerification.verified,
        securityLevel: 'Enterprise Grade',
        privacyCompliant: true,
        blockchainReady: true
      }
    };

    // Log the integrated demo
    await AuditService.logAction(
      'INTEGRATED_FEATURES_DEMO',
      req.userId,
      null,
      { 
        action: 'Advanced features integration demonstrated',
        features: ['digital-signatures', 'consensus', 'privacy'],
        success: demoResult.summary.allFeaturesWorking,
        severity: 'HIGH'
      },
      req
    );

    res.json({ demo: demoResult });
  } catch (error) {
    console.error('❌ Integrated demo failed:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;