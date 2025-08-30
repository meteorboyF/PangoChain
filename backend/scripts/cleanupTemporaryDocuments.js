const mongoose = require('mongoose');
const Document = require('../models/Document');
require('dotenv').config({ path: '../.env' });

const cleanupTemporaryDocuments = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for cleanup...');

    // Calculate the date 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find temporary documents older than 24 hours
    const oldTempDocs = await Document.find({
      isTemporary: true,
      uploadedAt: { $lt: twentyFourHoursAgo },
    });

    if (oldTempDocs.length === 0) {
      console.log('No old temporary documents to clean up.');
      return;
    }

    console.log(`Found ${oldTempDocs.length} old temporary documents to delete...`);

    // Delete the old temporary documents
    const deleteResult = await Document.deleteMany({
      _id: { $in: oldTempDocs.map(doc => doc._id) },
    });

    console.log(`Successfully deleted ${deleteResult.deletedCount} documents.`);

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

cleanupTemporaryDocuments();
