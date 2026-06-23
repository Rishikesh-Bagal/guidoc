const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    console.log('[DB Setup] Starting MongoDB connection process...');
    
    if (!config.mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    console.log('[DB Setup] Validating URI format...');
    const maskedURI = config.mongoURI.replace(/:([^:@]+)@/, ':****@');
    console.log(`[DB Setup] Attempting to connect to: ${maskedURI}`);

    console.log('[DB Setup] Initiating mongoose.connect()...');
    const conn = await mongoose.connect(config.mongoURI);
    
    console.log(`[DB Setup] MongoDB Connected Successfully!`);
    console.log(`[DB Setup] Host: ${conn.connection.host}`);
    console.log(`[DB Setup] Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('\n=============================================');
    console.error('❌ MONGODB CONNECTION FAILED ❌');
    console.error('=============================================');
    console.error(`Stage: Initiating mongoose.connect()`);
    console.error(`Error Name: ${error.name || 'Unknown'}`);
    console.error(`Error Code: ${error.code || 'N/A'}`);
    console.error(`Full Reason: ${error.message}`);
    console.error('Stack Trace:', error.stack);
    console.error('=============================================\n');
    process.exit(1);
  }
};

module.exports = connectDB;

