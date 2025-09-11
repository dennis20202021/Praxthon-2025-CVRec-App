const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');
const { loadCertificates } = require('./utils/certLoader');

async function enrollAdmin() {
    try {
        // Load connection profile
        const ccpPath = path.resolve(__dirname, '../network', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        ccp = loadCertificates(ccp);

        // Create a new CA client
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, {
            trustedRoots: caTLSCACerts,
            verify: false
        }, caInfo.caName);

        // Create wallet
        const walletPath = path.join(process.cwd(), 'server', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if admin already exists
        const adminIdentity = await wallet.get('admin');
        if (adminIdentity) {
            console.log('Removing existing admin identity...');
            await wallet.remove('admin');
        }

        // Enroll the admin user with proper attributes
        const enrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw',
            attr_reqs: [
                { name: 'hf.Registrar.Roles', optional: true },
                { name: 'hf.Registrar.Attributes', optional: true },
                { name: 'hf.Revoker', optional: true },
                { name: 'hf.IntermediateCA', optional: true },
                { name: 'hf.GenCRL', optional: true },
                { name: 'hf.Registrar.DelegateRoles', optional: true },
                { name: 'hf.Registrar.DelegateAttributes', optional: true }
            ]
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user with proper privileges');

    } catch (error) {
        console.error(`Failed to enroll admin user: ${error}`);
        process.exit(1);
    }
}

// Also create a function to register and enroll a user
async function registerAndEnrollUser(userId, userRole) {
    try {
        // Load connection profile
        const ccpPath = path.resolve(__dirname, '../network', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        ccp = loadCertificates(ccp);

        // Create a new CA client
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, {
            trustedRoots: caTLSCACerts,
            verify: false
        }, caInfo.caName);

        // Get the wallet
        const walletPath = path.join(process.cwd(), 'server', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if user already exists
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            console.log(`An identity for the user "${userId}" already exists in the wallet`);
            return;
        }

        // Check if admin user exists to act as registrar
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('Admin user does not exist. Please enroll admin first.');
            return;
        }

        // Build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: userId,
            role: 'client',
            attrs: [{ name: 'role', value: userRole, ecert: true }]
        }, adminUser);

        // In registerUser.js, update the enrollment part:
        const enrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put(userId, x509Identity);
        console.log(`Successfully registered and enrolled user "${userId}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to register user "${userId}": ${error}`);
    }
}

// Export functions
module.exports = { enrollAdmin, registerAndEnrollUser };

// Run if called directly
if (require.main === module) {
    enrollAdmin();
}