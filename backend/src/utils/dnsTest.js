const dns = require('dns');
const { execSync } = require('child_process');
const util = require('util');

const resolveSrv = util.promisify(dns.resolveSrv);

async function testDNS() {
  const target = '_mongodb._tcp.beathub.2mawry2.mongodb.net';

  console.log('--- 1. Windows Native DNS (nslookup) ---');
  try {
    const output = execSync(`nslookup -type=SRV ${target}`).toString();
    console.log(output);
  } catch (err) {
    console.error('nslookup failed:', err.message);
  }

  console.log('\n--- 2. Node.js Default DNS ---');
  console.log('Current Servers:', dns.getServers());
  try {
    const srv = await resolveSrv(target);
    console.log('Success:', srv);
  } catch (err) {
    console.error('Failed:', err.message);
  }

  console.log('\n--- 3. Node.js Custom DNS (8.8.8.8) ---');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log('Current Servers:', dns.getServers());
  try {
    const srv = await resolveSrv(target);
    console.log('Success:', srv);
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

testDNS();
