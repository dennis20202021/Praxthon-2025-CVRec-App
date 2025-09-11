// server/utils/checkWallet.js
const { Wallets } = require('fabric-network');
const path = require('path');

async function checkWallet() {
    try {
        const walletPath = path.join(process.cwd(), 'server', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        
        const identities = await wallet.list();
        console.log('Wallet identities:', identities);
        
        const adminIdentity = await wallet.get('admin');
        if (adminIdentity) {
            console.log('✅ Admin identity found in wallet');
            console.log('MSP ID:', adminIdentity.mspId);
            console.log('Type:', adminIdentity.type);
        } else {
            console.log('❌ Admin identity not found in wallet');
        }
    } catch (error) {
        console.error('Error checking wallet:', error);
    }
}

checkWallet();