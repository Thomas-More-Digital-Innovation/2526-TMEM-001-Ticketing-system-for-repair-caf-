import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const certDir = path.join(__dirname, 'certificates');

// Create certificates directory if it doesn't exist
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

const keyPath = path.join(certDir, 'localhost-key.pem');
const certPath = path.join(certDir, 'localhost.pem');

// Check if certificates already exist
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('✅ SSL certificates already exist');
  process.exit(0);
}

try {
  console.log('📝 Generating self-signed SSL certificates using mkcert...');
  
  // Try to install mkcert CA first (safe to run multiple times)
  try {
    execSync('mkcert -install', { stdio: 'pipe' });
  } catch {
    // Ignore if already installed
  }
  
  // Get local IP addresses
  let localIPs = [];
  try {
    const ipOutput = execSync('ipconfig', { encoding: 'utf-8' });
    const matches = ipOutput.match(/IPv4.*?:\s*(\d+\.\d+\.\d+\.\d+)/g);
    if (matches) {
      localIPs = matches
        .map(m => m.match(/(\d+\.\d+\.\d+\.\d+)/)[1])
        .filter(ip => ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.'));
    }
  } catch {
    // Fallback - use common local network IPs
    localIPs = ['192.168.1.1', '192.168.0.1'];
  }
  
  // Generate certificate using mkcert for localhost and detected local IPs
  const hosts = ['localhost', '127.0.0.1', '::1', ...localIPs];
  const hostsArg = hosts.join(' ');
  
  execSync(
    `mkcert -key-file "${keyPath}" -cert-file "${certPath}" ${hostsArg}`,
    { stdio: 'inherit' }
  );
  
  console.log('✅ SSL certificates generated successfully!');
  console.log(`   Key: ${keyPath}`);
  console.log(`   Cert: ${certPath}`);
  console.log('');
  console.log('🔒 Certificates generated for:');
  hosts.forEach(host => console.log(`   - ${host}`));
  console.log('');
  console.log('📱 Access from your phone using one of these IPs:');
  localIPs.forEach(ip => console.log(`   https://${ip}:3000`));
} catch (error) {
  console.error('❌ Error generating certificates.');
  console.error(error.message || error);
  console.error('');
  console.error('Please make sure mkcert is installed:');
  console.error('   choco install mkcert');
  console.error('');
  console.error('Or download from: https://github.com/FiloSottile/mkcert/releases');
  process.exit(1);
}
