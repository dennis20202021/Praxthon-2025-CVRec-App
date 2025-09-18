#!/bin/bash

echo "=== Deploying Chaincode to Fabric Network ==="

# Set environment variables
export FABRIC_CFG_PATH=${PWD}/fabric-samples/config/
export PATH=${PWD}/fabric-samples/bin:$PATH

cd fabric-samples/test-network

# Source environment variables
source ./scripts/envVar.sh

echo "1. Installing chaincode dependencies..."
cd ../../server/chaincode
rm -rf node_modules package-lock.json
npm install
cd ../../fabric-samples/test-network

echo "2. Packaging chaincode..."
peer lifecycle chaincode package cvchaincode.tar.gz \
    --path ../../server/chaincode/ \
    --lang node \
    --label cvchaincode_1.0

echo "3. Installing chaincode on Org1 peer..."
setGlobals 1
peer lifecycle chaincode install cvchaincode.tar.gz

echo "4. Installing chaincode on Org2 peer..."
setGlobals 2
peer lifecycle chaincode install cvchaincode.tar.gz

echo "5. Querying installed chaincode to get package ID..."
setGlobals 1
INSTALLED_CHAINCODE=$(peer lifecycle chaincode queryinstalled)

# Extract the package ID from the output
PKGID=$(echo "$INSTALLED_CHAINCODE" | grep "cvchaincode_1.0" | awk '{print $3}' | sed 's/,$//')

if [ -z "$PKGID" ]; then
    echo "❌ Failed to get package ID. Trying alternative method..."
    # Alternative method to get package ID
    PKGID=$(peer lifecycle chaincode queryinstalled | grep -A 1 "cvchaincode_1.0" | tail -1 | awk '{print $2}' | sed 's/,//')
fi

if [ -z "$PKGID" ]; then
    echo "❌ Failed to get package ID. Please check chaincode installation."
    exit 1
fi

echo "Package ID: $PKGID"

echo "6. Approving chaincode for Org1..."
setGlobals 1
peer lifecycle chaincode approveformyorg \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls \
    --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
    --channelID mychannel \
    --name cvchaincode \
    --version 1.0 \
    --package-id "$PKGID" \
    --sequence 1 \
    --waitForEvent

echo "7. Approving chaincode for Org2..."
setGlobals 2
peer lifecycle chaincode approveformyorg \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls \
    --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
    --channelID mychannel \
    --name cvchaincode \
    --version 1.0 \
    --package-id "$PKGID" \
    --sequence 1 \
    --waitForEvent

echo "8. Committing chaincode definition..."
setGlobals 1
peer lifecycle chaincode commit \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls \
    --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
    --channelID mychannel \
    --name cvchaincode \
    --version 1.0 \
    --sequence 1 \
    --peerAddresses localhost:7051 \
    --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
    --peerAddresses localhost:9051 \
    --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \
    --waitForEvent

echo "9. Checking committed chaincode..."
peer lifecycle chaincode querycommitted --channelID mychannel --name cvchaincode

echo "10. Testing chaincode initialization..."
setGlobals 1
peer chaincode invoke \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls \
    --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
    -C mychannel \
    -n cvchaincode \
    --peerAddresses localhost:7051 \
    --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
    --peerAddresses localhost:9051 \
    --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \
    -c '{"function":"initLedger","Args":[]}'

echo "11. Testing chaincode query..."
setGlobals 1
peer chaincode query \
    -C mychannel \
    -n cvchaincode \
    -c '{"function":"GetAllJobs","Args":[]}'

echo "✅ Chaincode deployment completed successfully!"

cd ../..