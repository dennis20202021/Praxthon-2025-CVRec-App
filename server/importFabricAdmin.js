const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function importFabricAdmin() {
    try {
        // Use absolute path to avoid issues
        const walletPath = path.join(__dirname, 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if admin already exists
        const existingIdentity = await wallet.get('admin');
        if (existingIdentity) {
            console.log('Removing existing admin identity...');
            await wallet.remove('admin');
        }

        // Use absolute paths for certificate files
        const certPath = path.join(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'users', 'Admin@org1.example.com', 'msp', 'signcerts', 'cert.pem');
        const keystorePath = path.join(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'users', 'Admin@org1.example.com', 'msp', 'keystore');

        console.log('Looking for cert at:', certPath);
        console.log('Looking for key in:', keystorePath);

        // Check if files exist
        if (!fs.existsSync(certPath)) {
            throw new Error(`Certificate file not found: ${certPath}`);
        }
        if (!fs.existsSync(keystorePath)) {
            throw new Error(`Keystore directory not found: ${keystorePath}`);
        }

        // Find the private key file (it has a random name)
        const keyFiles = fs.readdirSync(keystorePath);
        const privateKeyFile = keyFiles.find(file => file.endsWith('_sk'));
        
        if (!privateKeyFile) {
            throw new Error(`No private key file found in: ${keystorePath}`);
        }

        const keyPath = path.join(keystorePath, privateKeyFile);
        console.log('Found private key file:', privateKeyFile);

        const certificate = fs.readFileSync(certPath, 'utf8');
        const privateKey = fs.readFileSync(keyPath, 'utf8');

        const identity = {
            credentials: {
                certificate,
                privateKey,
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put('admin', identity);
        console.log('✅ Successfully imported REAL Fabric admin identity into wallet');

        // Verify the identity was saved
        const savedIdentity = await wallet.get('admin');
        if (savedIdentity) {
            console.log('✅ Admin identity verified in wallet');
            console.log('MSP ID:', savedIdentity.mspId);
        } else {
            console.log('❌ Failed to verify admin identity in wallet');
        }

    } catch (error) {
        console.error(`❌ Failed to import Fabric admin: ${error.message}`);
        console.error(error.stack);
    }
}

// Run if called directly
if (require.main === module) {
    importFabricAdmin().then(() => {
        console.log('Admin import process completed');
        process.exit(0);
    }).catch(error => {
        console.error('Admin import failed:', error);
        process.exit(1);
    });
}

module.exports = { importFabricAdmin };