// create importFabricAdmin.js
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function importFabricAdmin() {
    try {
        const walletPath = path.join(process.cwd(), 'server', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Read the admin certificate and private key from Fabric crypto materials
        const certPath = 'fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/cert.pem';
        const keyPath = 'fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/53f4612994add5b9ffa0f58e0d8eee517948e8f879c75eb9a9100fdb7f6b59b0_sk';

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
        console.log('Successfully imported Fabric admin identity into wallet');

    } catch (error) {
        console.error(`Failed to import Fabric admin: ${error}`);
    }
}

importFabricAdmin();