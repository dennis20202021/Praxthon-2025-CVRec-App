const fs = require('fs');
const path = require('path');

function loadCertificates(ccp) {
    // Load TLS certificates from files
    if (ccp.peers) {
        for (const peerName in ccp.peers) {
            const peer = ccp.peers[peerName];
            if (peer.tlsCACerts && peer.tlsCACerts.path) {
                try {
                    peer.tlsCACerts.pem = fs.readFileSync(
                        path.resolve(__dirname, '..', peer.tlsCACerts.path), 
                        'utf8'
                    );
                } catch (error) {
                    console.warn(`Could not load TLS cert for ${peerName}: ${error.message}`);
                }
            }
        }
    }

    if (ccp.certificateAuthorities) {
        for (const caName in ccp.certificateAuthorities) {
            const ca = ccp.certificateAuthorities[caName];
            if (ca.tlsCACerts && ca.tlsCACerts.path) {
                try {
                    ca.tlsCACerts.pem = fs.readFileSync(
                        path.resolve(__dirname, '..', ca.tlsCACerts.path), 
                        'utf8'
                    );
                } catch (error) {
                    console.warn(`Could not load TLS cert for ${caName}: ${error.message}`);
                }
            }
        }
    }

    if (ccp.orderers) {
        for (const ordererName in ccp.orderers) {
            const orderer = ccp.orderers[ordererName];
            if (orderer.tlsCACerts && orderer.tlsCACerts.path) {
                try {
                    orderer.tlsCACerts.pem = fs.readFileSync(
                        path.resolve(__dirname, '..', orderer.tlsCACerts.path), 
                        'utf8'
                    );
                } catch (error) {
                    console.warn(`Could not load TLS cert for ${ordererName}: ${error.message}`);
                }
            }
        }
    }

    return ccp;
}

module.exports = { loadCertificates };