const fs = require('fs');
const path = require('path');

function loadCertificates(ccp) {
    const basePath = path.resolve(__dirname, '..', '..'); // Go to project root
    
    // Load TLS certificates from files
    if (ccp.peers) {
        for (const peerName in ccp.peers) {
            const peer = ccp.peers[peerName];
            if (peer.tlsCACerts && peer.tlsCACerts.path) {
                try {
                    const certPath = path.resolve(basePath, peer.tlsCACerts.path);
                    if (fs.existsSync(certPath)) {
                        peer.tlsCACerts.pem = fs.readFileSync(certPath, 'utf8');
                        console.log(`✅ Loaded TLS cert for ${peerName}: ${certPath}`);
                    } else {
                        console.warn(`❌ TLS cert file not found: ${certPath}`);
                    }
                } catch (error) {
                    console.warn(`❌ Could not load TLS cert for ${peerName}: ${error.message}`);
                }
            }
        }
    }

    if (ccp.certificateAuthorities) {
        for (const caName in ccp.certificateAuthorities) {
            const ca = ccp.certificateAuthorities[caName];
            if (ca.tlsCACerts && ca.tlsCACerts.path) {
                try {
                    const certPath = path.resolve(basePath, ca.tlsCACerts.path);
                    if (fs.existsSync(certPath)) {
                        ca.tlsCACerts.pem = fs.readFileSync(certPath, 'utf8');
                        console.log(`✅ Loaded TLS cert for ${caName}: ${certPath}`);
                    } else {
                        console.warn(`❌ TLS cert file not found: ${certPath}`);
                    }
                } catch (error) {
                    console.warn(`❌ Could not load TLS cert for ${caName}: ${error.message}`);
                }
            }
        }
    }

    if (ccp.orderers) {
        for (const ordererName in ccp.orderers) {
            const orderer = ccp.orderers[ordererName];
            if (orderer.tlsCACerts && orderer.tlsCACerts.path) {
                try {
                    const certPath = path.resolve(basePath, orderer.tlsCACerts.path);
                    if (fs.existsSync(certPath)) {
                        orderer.tlsCACerts.pem = fs.readFileSync(certPath, 'utf8');
                        console.log(`✅ Loaded TLS cert for ${ordererName}: ${certPath}`);
                    } else {
                        console.warn(`❌ TLS cert file not found: ${certPath}`);
                    }
                } catch (error) {
                    console.warn(`❌ Could not load TLS cert for ${ordererName}: ${error.message}`);
                }
            }
        }
    }

    return ccp;
}

module.exports = { loadCertificates };