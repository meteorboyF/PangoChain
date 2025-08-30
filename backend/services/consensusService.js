const crypto = require('crypto');
const CryptoService = require('./cryptoService');

class ConsensusNode {
  constructor(nodeId, nodeType = 'validator') {
    this.nodeId = nodeId;
    this.nodeType = nodeType; // validator, orderer, peer
    this.status = 'active';
    this.reputation = 100;
    this.lastSeen = new Date();
    this.votingPower = nodeType === 'validator' ? 1 : 0;
    this.publicKey = null;
    this.isOnline = true;
  }

  // Simulate node going online/offline
  toggleOnlineStatus() {
    this.isOnline = !this.isOnline;
    this.lastSeen = this.isOnline ? new Date() : this.lastSeen;
    return this.isOnline;
  }

  // Cast a vote on a block
  vote(blockHash, decision) {
    if (!this.isOnline) return null;
    
    const vote = {
      nodeId: this.nodeId,
      blockHash,
      decision, // 'accept', 'reject'
      timestamp: new Date(),
      signature: crypto.createHash('sha256').update(`${this.nodeId}${blockHash}${decision}`).digest('hex')
    };
    
    console.log(`🗳️  Node ${this.nodeId} voted: ${decision.toUpperCase()} for block ${blockHash.substring(0, 8)}...`);
    return vote;
  }

  // Validate a proposed block
  validateBlock(block) {
    // Simulate validation logic with high success rate for demo
    const validationChecks = {
      hasValidStructure: block.blockId && block.blockHeight !== undefined,
      hasValidHash: block.blockHash && block.blockHash.length === 64,
      hasValidPreviousHash: block.previousHash && block.previousHash.length === 64,
      hasValidActions: Array.isArray(block.actions) && block.actions.length > 0,
      hashMatches: block.blockHash === this.calculateBlockHash(block)
    };

    // For demo purposes, add some randomness but bias toward success (90% success rate)
    const demoSuccessRate = Math.random() > 0.1; // 90% chance of success
    const isValid = Object.values(validationChecks).every(check => check) && demoSuccessRate;
    
    return {
      nodeId: this.nodeId,
      blockHash: block.blockHash,
      isValid,
      validationChecks,
      timestamp: new Date()
    };
  }

  calculateBlockHash(block) {
    const blockData = {
      blockHeight: block.blockHeight,
      previousHash: block.previousHash,
      actions: block.actions.map(a => a.signature || a.actionType || JSON.stringify(a)).join('|'),
      timestamp: block.timestamp
    };
    return crypto.createHash('sha256').update(JSON.stringify(blockData)).digest('hex');
  }
}

class ConsensusService {
  constructor() {
    this.cryptoService = new CryptoService();
    this.nodes = new Map();
    this.consensusType = 'PBFT'; // Practical Byzantine Fault Tolerance
    this.minimumNodes = 4; // For Byzantine fault tolerance (3f + 1 where f = 1)
    this.consensusThreshold = 0.67; // 67% agreement required
    this.currentRound = 0;
    this.consensusHistory = [];
    
    // Initialize with simulated nodes
    this.initializeNodes();
  }

  // Initialize simulated network nodes
  initializeNodes() {
    const nodeTypes = [
      { id: 'eth-validator-1', type: 'validator' },
      { id: 'eth-validator-2', type: 'validator' },
      { id: 'eth-validator-3', type: 'validator' },
      { id: 'hlf-orderer-1', type: 'orderer' },
      { id: 'hlf-peer-1', type: 'peer' },
      { id: 'hlf-peer-2', type: 'peer' },
      { id: 'pangochain-node-1', type: 'validator' }
    ];

    nodeTypes.forEach(({ id, type }) => {
      const node = new ConsensusNode(id, type);
      this.nodes.set(id, node);
    });

    console.log(`🌐 Consensus network initialized with ${this.nodes.size} nodes`);
  }

  // Get network status
  getNetworkStatus() {
    const nodes = Array.from(this.nodes.values());
    const online = nodes.filter(n => n.isOnline);
    const validators = nodes.filter(n => n.nodeType === 'validator');
    const onlineValidators = validators.filter(n => n.isOnline);

    return {
      totalNodes: nodes.length,
      onlineNodes: online.length,
      totalValidators: validators.length,
      onlineValidators: onlineValidators.length,
      consensusType: this.consensusType,
      networkHealth: online.length / nodes.length,
      canReachConsensus: onlineValidators.length >= Math.ceil(validators.length * this.consensusThreshold),
      byzantineFaultTolerance: Math.floor((onlineValidators.length - 1) / 3),
      currentRound: this.currentRound
    };
  }

  // Simulate consensus process for a block
  async simulateBlockConsensus(block) {
    console.log(`\n🏛️  Starting consensus for block ${block.blockHeight}...`);
    this.currentRound++;

    const consensusRound = {
      roundId: this.currentRound,
      blockHeight: block.blockHeight,
      blockHash: block.blockHash,
      startTime: new Date(),
      phase: 'PRE_PREPARE',
      votes: [],
      validations: [],
      result: null
    };

    // Phase 1: PRE-PREPARE - Broadcast block proposal
    console.log('📢 Phase 1: PRE-PREPARE - Broadcasting block proposal...');
    const validators = Array.from(this.nodes.values()).filter(n => 
      n.nodeType === 'validator' && n.isOnline
    );

    if (validators.length < 3) {
      consensusRound.result = {
        success: false,
        reason: 'Insufficient validators online',
        phase: 'PRE_PREPARE'
      };
      return consensusRound;
    }

    // Phase 2: PREPARE - Validators validate the block
    console.log('🔍 Phase 2: PREPARE - Validators validating block...');
    await this.simulateDelay(500, 1000); // Simulate network delay

    for (const validator of validators) {
      const validation = validator.validateBlock(block);
      consensusRound.validations.push(validation);
      
      // Vote based on validation
      const decision = validation.isValid ? 'accept' : 'reject';
      const vote = validator.vote(block.blockHash, decision);
      if (vote) consensusRound.votes.push(vote);
    }

    // Check if enough validators agreed
    const acceptVotes = consensusRound.votes.filter(v => v.decision === 'accept');
    const requiredVotes = Math.ceil(validators.length * this.consensusThreshold);
    
    console.log(`📊 Consensus results: ${acceptVotes.length}/${validators.length} validators accepted (required: ${requiredVotes})`);

    // Phase 3: COMMIT - Finalize consensus
    console.log('✅ Phase 3: COMMIT - Finalizing consensus...');
    const consensusReached = acceptVotes.length >= requiredVotes;
    
    if (consensusReached) {
      consensusRound.result = {
        success: true,
        acceptedBy: acceptVotes.length,
        totalValidators: validators.length,
        consensusPercentage: (acceptVotes.length / validators.length * 100).toFixed(1),
        finalizedAt: new Date()
      };
      console.log(`✅ CONSENSUS REACHED: Block ${block.blockHeight} accepted by ${acceptVotes.length}/${validators.length} validators`);
    } else {
      consensusRound.result = {
        success: false,
        reason: 'Insufficient consensus',
        acceptedBy: acceptVotes.length,
        totalValidators: validators.length,
        requiredVotes,
        phase: 'COMMIT'
      };
      console.log(`❌ CONSENSUS FAILED: Block ${block.blockHeight} rejected`);
    }

    consensusRound.endTime = new Date();
    consensusRound.duration = consensusRound.endTime - consensusRound.startTime;
    this.consensusHistory.push(consensusRound);

    // Keep only last 10 consensus rounds
    if (this.consensusHistory.length > 10) {
      this.consensusHistory = this.consensusHistory.slice(-10);
    }

    return consensusRound;
  }

  // Simulate Proof of Authority consensus
  async simulatePoAConsensus(block) {
    console.log(`\n👑 Starting Proof of Authority consensus for block ${block.blockHeight}...`);
    
    const authorities = Array.from(this.nodes.values()).filter(n => 
      n.nodeType === 'validator' && n.isOnline && n.reputation >= 80
    );

    if (authorities.length === 0) {
      return {
        success: false,
        reason: 'No authorities available',
        consensusType: 'Proof of Authority'
      };
    }

    // Select authority based on round-robin or reputation
    const selectedAuthority = authorities[this.currentRound % authorities.length];
    console.log(`👑 Selected authority: ${selectedAuthority.nodeId}`);

    await this.simulateDelay(500, 1500);

    const validation = selectedAuthority.validateBlock(block);
    const decision = validation.isValid ? 'accept' : 'reject';

    return {
      success: validation.isValid,
      authorizedBy: selectedAuthority.nodeId,
      validation,
      consensusType: 'Proof of Authority',
      timestamp: new Date()
    };
  }

  // Simulate network partition (Byzantine failure)
  simulateNetworkPartition(percentage = 0.3) {
    const nodes = Array.from(this.nodes.values());
    const nodesToDisconnect = Math.floor(nodes.length * percentage);
    const shuffled = nodes.sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < nodesToDisconnect; i++) {
      shuffled[i].isOnline = false;
      console.log(`🔌 Node ${shuffled[i].nodeId} disconnected (network partition)`);
    }

    return {
      disconnectedNodes: nodesToDisconnect,
      totalNodes: nodes.length,
      remainingOnline: nodes.length - nodesToDisconnect
    };
  }

  // Restore network connectivity
  restoreNetwork() {
    let restored = 0;
    this.nodes.forEach(node => {
      if (!node.isOnline) {
        node.isOnline = true;
        node.lastSeen = new Date();
        restored++;
      }
    });
    
    console.log(`🔗 Network restored: ${restored} nodes reconnected`);
    return restored;
  }

  // Get consensus statistics for frontend display
  getConsensusStatistics() {
    const recentRounds = this.consensusHistory.slice(-5);
    const successRate = recentRounds.length > 0 ? 
      recentRounds.filter(r => r.result.success).length / recentRounds.length * 100 : 0;

    const averageTime = recentRounds.length > 0 ?
      recentRounds.reduce((sum, r) => sum + r.duration, 0) / recentRounds.length : 0;

    return {
      totalRounds: this.consensusHistory.length,
      recentSuccessRate: parseFloat(successRate.toFixed(1)),
      averageConsensusTime: Math.round(averageTime),
      currentRound: this.currentRound,
      consensusType: this.consensusType,
      networkStatus: this.getNetworkStatus(),
      recentHistory: recentRounds.map(r => ({
        round: r.roundId,
        blockHeight: r.blockHeight,
        success: r.result.success,
        duration: r.duration,
        votes: r.votes.length,
        timestamp: r.startTime
      }))
    };
  }

  // Get detailed node information for frontend
  getNodeDetails() {
    return Array.from(this.nodes.values()).map(node => ({
      nodeId: node.nodeId,
      type: node.nodeType,
      status: node.isOnline ? 'online' : 'offline',
      reputation: node.reputation,
      lastSeen: node.lastSeen,
      votingPower: node.votingPower
    }));
  }

  // Simulate different consensus algorithms
  async runConsensusAlgorithm(block, algorithm = 'PBFT') {
    switch (algorithm) {
      case 'PBFT':
        return await this.simulateBlockConsensus(block);
      case 'PoA':
        return await this.simulatePoAConsensus(block);
      case 'Raft':
        return await this.simulateRaftConsensus(block);
      default:
        throw new Error(`Unknown consensus algorithm: ${algorithm}`);
    }
  }

  // Simulate Raft consensus
  async simulateRaftConsensus(block) {
    console.log(`\n📊 Starting Raft consensus for block ${block.blockHeight}...`);
    
    const nodes = Array.from(this.nodes.values()).filter(n => n.isOnline);
    if (nodes.length < 3) {
      return { success: false, reason: 'Insufficient nodes for Raft consensus' };
    }

    // Select leader
    const leader = nodes[Math.floor(Math.random() * nodes.length)];
    console.log(`👑 Leader elected: ${leader.nodeId}`);

    // Leader proposes block
    await this.simulateDelay(200, 800);
    const followers = nodes.filter(n => n.nodeId !== leader.nodeId);
    const acceptances = followers.filter(f => Math.random() > 0.1); // 90% acceptance rate

    const majorityRequired = Math.floor(nodes.length / 2) + 1;
    const success = acceptances.length + 1 >= majorityRequired; // +1 for leader

    return {
      success,
      consensusType: 'Raft',
      leader: leader.nodeId,
      acceptances: acceptances.length + 1,
      totalNodes: nodes.length,
      majorityRequired,
      timestamp: new Date()
    };
  }

  // Utility method for simulating network delays
  async simulateDelay(minMs = 100, maxMs = 1000) {
    const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

module.exports = ConsensusService;