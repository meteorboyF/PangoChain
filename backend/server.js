require('./logging'); // Initialize logging
const express = require('express');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const AuditService = require("./services/auditService");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for file uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/log", logRoutes);
app.use("/api/documents", require("./routes/blockchainDocumentRoutes")); // Blockchain-enabled documents
app.use("/api/cloudinary", require("./routes/cloudinaryRoutes")); // Cloudinary OCR and features
app.use("/api/scan-to-doc", require("./routes/scanToDocRoutes")); // Image to Document conversion
app.use("/api/advanced", require("./routes/advancedFeaturesRoutes")); // Advanced blockchain features

// Test routes (for development)
if (process.env.NODE_ENV !== 'production') {
  // Quick test route for cases
  app.get('/api/test/cases', async (req, res) => {
    try {
      const Case = require('./models/Case');
      const cases = await Case.find({}).sort({ createdAt: -1 });
      res.json({ cases });
    } catch (error) {
      res.status(500).json({ error: error.message, cases: [] });
    }
  });

  // Create a new case
  app.post('/api/test/cases', async (req, res) => {
    try {
      const Case = require('./models/Case');
      const { title, description, clientName, caseType } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: 'Case title is required' });
      }

      const newCase = new Case({
        title,
        description: description || '',
        clientName: clientName || 'Unknown Client',
        caseType: caseType || 'General',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedCase = await newCase.save();
      res.status(201).json({ case: savedCase, message: 'Case created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "✅ PangoChain Backend API is running",
    version: "2.0.0",
    blockchain: {
      ethereum: "Connected to Sepolia Testnet",
      hyperledger: "Connected to PangoChain Network", 
      auditChain: "Operational"
    },
    features: [
      "Document Management",
      "Blockchain Integration", 
      "Audit Trail",
      "Cross-chain Storage",
      "Cryptographic Verification"
    ],
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Check database connection
    const mongoose = require("mongoose");
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    
    // Check audit system
    let auditStatus = "Unknown";
    try {
      const stats = await AuditService.getSystemStats();
      auditStatus = stats.totalBlocks > 0 ? "Operational" : "Initializing";
    } catch (error) {
      auditStatus = "Error";
    }

    res.json({
      status: "Healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        auditChain: auditStatus,
        blockchain: {
          ethereum: "Operational",
          hyperledger: "Operational"
        }
      },
      uptime: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
      nodeVersion: process.version
    });
  } catch (error) {
    res.status(500).json({
      status: "Unhealthy",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Initialize blockchain audit system on startup
const initializeSystem = async () => {
  console.log('🚀 Initializing PangoChain Blockchain System...');
  
  try {
    // Initialize audit chain
    const auditInitialized = await AuditService.initialize();
    if (auditInitialized) {
      console.log('✅ Blockchain audit system initialized');
    } else {
      console.log('⚠️  Blockchain audit system failed to initialize');
    }
    
    // Log system startup to audit chain
    const systemUserId = process.env.SYSTEM_USER_ID || '000000000000000000000000';
    await AuditService.logAction(
      'SYSTEM_START',
      systemUserId,
      'system',
      {
        version: '2.0.0',
        features: ['blockchain', 'audit', 'documents', 'cloudinary'],
        nodeEnv: process.env.NODE_ENV || 'development',
        timestamp: new Date(),
        action: 'PangoChain system started with blockchain integration',
        serverPort: process.env.PORT || 5001
      }
    );
    
    console.log('✅ System startup logged to blockchain audit trail');
    
  } catch (error) {
    console.error('❌ System initialization failed:', error);
  }
};

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`🔄 Graceful shutdown initiated by ${signal}...`);
  
  try {
    // Log shutdown to audit chain
    const systemUserId = process.env.SYSTEM_USER_ID || '000000000000000000000000';
    await AuditService.logAction(
      'SYSTEM_SHUTDOWN',
      systemUserId,
      'system',
      {
        signal,
        action: 'PangoChain system shutdown initiated',
        timestamp: new Date(),
        uptime: Math.floor(process.uptime())
      }
    );
    console.log('✅ System shutdown logged to blockchain');
  } catch (error) {
    console.error('❌ Shutdown logging failed:', error);
  }
  
  // Close database connection
  try {
    const mongoose = require("mongoose");
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database:', error);
  }
  
  console.log('👋 PangoChain server shutdown complete');
  process.exit(0);
};

// Handle shutdown signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, async () => {
  console.log('');
  console.log('🔗 ============================================');
  console.log('🔗 PangoChain Blockchain Legal System');
  console.log('🔗 ============================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔗 Blockchain networks: Ethereum (Sepolia), Hyperledger Fabric`);
  console.log(`💾 Database: ${process.env.MONGO_URI ? 'Connected' : 'Configuration missing'}`);
  console.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured'}`);
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Missing'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🔗 ============================================');
  console.log('');
  
  // Initialize system after server starts
  await initializeSystem();
  
  console.log('✅ PangoChain system ready for blockchain operations!');
  console.log('');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

module.exports = app;