const mongoose = require('mongoose');
const AuditChain = require('../models/AuditChain');
require('dotenv').config();

async function resetAuditChain() {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    console.log('🗑️  Dropping existing audit chain...');
    await AuditChain.deleteMany({});
    console.log('✅ Audit chain cleared');

    console.log('🆕 Creating fresh genesis block...');
    const genesisBlock = await AuditChain.createGenesisBlock();
    console.log('✅ Genesis block created:', genesisBlock.blockId);

    console.log('🔍 Verifying chain integrity...');
    const validation = await AuditChain.validateChain();
    console.log('✅ Chain validation results:', validation);

    console.log('🎉 Audit chain reset completed successfully!');
    
    await mongoose.disconnect();
    console.log('👋 Database disconnected');
    
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

resetAuditChain();