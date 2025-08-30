const mongoose = require('mongoose');
const crypto = require('crypto');

const actionSchema = new mongoose.Schema({
  actionId: { type: String, required: true, unique: true },
  actionType: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: String, index: true },
  details: { type: Object },
  signature: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const auditChainSchema = new mongoose.Schema({
  blockId: { type: String, required: true, unique: true, index: true },
  blockHeight: { type: Number, required: true, unique: true },
  previousHash: { type: String, required: true },
  blockHash: { type: String, required: true },
  actions: [actionSchema],
  timestamp: { type: Date, default: Date.now }
});

// Method to calculate the hash of a block
auditChainSchema.methods.calculateHash = function() {
  const blockData = {
    blockHeight: this.blockHeight,
    previousHash: this.previousHash,
    actions: this.actions.map(a => a.signature).join('|'),
    timestamp: this.timestamp
  };
  return crypto.createHash('sha256').update(JSON.stringify(blockData)).digest('hex');
};

// Static method to create the Genesis Block
auditChainSchema.statics.createGenesisBlock = async function() {
  const genesisBlock = new this({
    blockId: 'genesis-block-0',
    blockHeight: 0,
    previousHash: '0'.repeat(64),
    actions: [{
      actionId: 'SYSTEM_INIT-0',
      actionType: 'SYSTEM_INIT',
      userId: mongoose.Types.ObjectId.createFromHexString('000000000000000000000000'),
      details: { message: 'Genesis Block' },
      signature: crypto.createHash('sha256').update('Genesis').digest('hex')
    }]
  });
  genesisBlock.blockHash = genesisBlock.calculateHash();
  return await genesisBlock.save();
};

// Static method to add a new block of actions
auditChainSchema.statics.addAuditBlock = async function(action) {
  // Use findOneAndUpdate with upsert to ensure atomicity
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const lastBlock = await this.findOne().sort({ blockHeight: -1 });
      if (!lastBlock) {
        throw new Error('Genesis block not found. Please initialize the chain.');
      }

      const newBlockHeight = lastBlock.blockHeight + 1;
      const newBlock = new this({
        blockId: `block-${newBlockHeight}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        blockHeight: newBlockHeight,
        previousHash: lastBlock.blockHash,
        actions: [action]
      });
      newBlock.blockHash = newBlock.calculateHash();
      
      // Use save with unique constraint check
      return await newBlock.save();
    } catch (error) {
      if (error.code === 11000 && attempts < maxAttempts - 1) {
        // Duplicate key error, retry with small delay
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 10 * attempts));
        continue;
      }
      throw error;
    }
  }
};

// Static method to validate the entire chain
auditChainSchema.statics.validateChain = async function() {
  const blocks = await this.find().sort({ blockHeight: 'asc' });
  const results = [];

  for (let i = 0; i < blocks.length; i++) {
    const currentBlock = blocks[i];
    const validation = { blockHeight: currentBlock.blockHeight, valid: true, error: null };

    // Check hash integrity
    if (currentBlock.blockHash !== currentBlock.calculateHash()) {
      validation.valid = false;
      validation.error = 'Block hash is invalid.';
    }

    // Check chain link
    if (i > 0) {
      const previousBlock = blocks[i - 1];
      if (currentBlock.previousHash !== previousBlock.blockHash) {
        validation.valid = false;
        validation.error = (validation.error ? validation.error + ' ' : '') + 'Chain link is broken.';
      }
    }
    results.push(validation);
  }
  return results;
};

module.exports = mongoose.model('AuditChain', auditChainSchema);