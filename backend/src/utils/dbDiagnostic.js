const dns = require('dns');
const util = require('util');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const resolveSrv = util.promisify(dns.resolveSrv);
const resolveTxt = util.promisify(dns.resolveTxt);

async function runDiagnostics() {
  console.log('=============================================');
  console.log('🔍 MONGODB ATLAS DIAGNOSTIC TOOL 🔍');
  console.log('=============================================\n');

  const uri = process.env.MONGODB_URI;

  // 1. Validate URI Format
  console.log('--- 1. URI Validation ---');
  if (!uri) {
    console.error('❌ MONGODB_URI is undefined in .env file!');
    process.exit(1);
  }

  const maskedURI = uri.replace(/:([^:@]+)@/, ':****@');
  console.log(`✅ URI Found: ${maskedURI}`);

  if (!uri.startsWith('mongodb+srv://') && !uri.startsWith('mongodb://')) {
    console.error('❌ Invalid URI format. Must start with mongodb:// or mongodb+srv://');
    process.exit(1);
  }

  // Check for URL encoded password
  try {
    const urlObj = new URL(uri);
    const password = urlObj.password;
    if (password && decodeURIComponent(password) !== password) {
      console.log('✅ Password contains URL encoded characters (Good)');
    } else if (password && /[^a-zA-Z0-9]/.test(password)) {
      console.log('⚠️  WARNING: Password contains special characters but may not be properly URL encoded.');
      console.log('   If connection fails, try encoding special characters in your password.');
    }
  } catch (err) {
    console.log('⚠️  Could not parse URI structure to verify password encoding (this is normal for some connection strings).');
  }

  console.log('\n--- 2. DNS Resolution ---');
  if (uri.startsWith('mongodb+srv://')) {
    try {
      const hostPart = uri.split('mongodb+srv://')[1].split('/')[0].split('?')[0];
      const hostname = hostPart.includes('@') ? hostPart.split('@')[1] : hostPart;
      console.log(`Looking up SRV records for _mongodb._tcp.${hostname}...`);
      
      const srvRecords = await resolveSrv(`_mongodb._tcp.${hostname}`);
      console.log('✅ SRV Records resolved successfully:');
      console.log(srvRecords);

      console.log(`\nLooking up TXT records for ${hostname}...`);
      const txtRecords = await resolveTxt(`${hostname}`);
      console.log('✅ TXT Records resolved successfully:');
      console.log(txtRecords);
    } catch (err) {
      console.error('❌ DNS Resolution Failed!');
      console.error('Error Code:', err.code);
      console.error('Error Message:', err.message);
      console.error('\nPossible causes:');
      console.error('- Your network/ISP or VPN is blocking DNS SRV queries.');
      console.error('- The Atlas cluster URL is misspelled or the cluster was deleted.');
      console.error("\nTry changing your computer's DNS server to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare).");
    }
  } else {
    console.log('Skipping SRV lookup for standard mongodb:// URI');
  }

  console.log('\n--- 3. Direct MongoDB Connectivity ---');
  try {
    console.log('Attempting to connect with mongoose...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected successfully!');
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully.');
  } catch (err) {
    console.error('❌ MongoDB Connectivity Failed!');
    console.error('Error Name:', err.name);
    console.error('Error Code:', err.code);
    console.error('Message:', err.message);
    if (err.name === 'MongoServerSelectionError') {
      console.error('\nPossible causes:');
      console.error('- Your IP address is not whitelisted in MongoDB Atlas Network Access.');
      console.error('- Your network is blocking outgoing connections on port 27017.');
    }
  }

  console.log('\n=============================================');
  console.log('🏁 DIAGNOSTICS COMPLETE 🏁');
  console.log('=============================================');
  process.exit(0);
}

runDiagnostics();
