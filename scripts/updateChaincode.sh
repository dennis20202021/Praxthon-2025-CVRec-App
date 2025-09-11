#!/bin/bash

# Set path to Fabric binaries
export PATH=${PWD}/fabric-samples/bin:$PATH

cd fabric-samples/test-network

# Set environment variables
export FABRIC_CFG_PATH=${PWD}/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# Update --label each time updated is required!
echo "Packaging updated chaincode..."
peer lifecycle chaincode package cvchaincode.tar.gz --path ../../server/chaincode --lang node --label cvchaincode_1.3

echo "Installing chaincode on Org1..."
peer lifecycle chaincode install cvchaincode.tar.gz

# Get package ID
CC_PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep -oP "Package ID: \K[^,]*" | tail -1)
echo "Package ID: $CC_PACKAGE_ID"

# Update --sequence each time updated is required along with --label sync!
echo "Approving chaincode for Org1 (using sequence 6)..."
peer lifecycle chaincode approveformyorg -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --channelID mychannel \
  --name cvchaincode \
  --version 1.1 \
  --package-id $CC_PACKAGE_ID \
  --sequence 6 \
  --tls \
  --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

echo "Setting up Org2 environment..."
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

echo "Installing chaincode on Org2..."
peer lifecycle chaincode install cvchaincode.tar.gz

echo "Approving chaincode for Org2 (using sequence 6)..."
peer lifecycle chaincode approveformyorg -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --channelID mychannel \
  --name cvchaincode \
  --version 1.1 \
  --package-id $CC_PACKAGE_ID \
  --sequence 6 \
  --tls \
  --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

echo "Committing chaincode (using sequence 6)..."
peer lifecycle chaincode commit -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --channelID mychannel \
  --name cvchaincode \
  --version 1.1 \
  --sequence 6 \
  --tls \
  --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
  --peerAddresses localhost:9051 \
  --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

echo "Chaincode updated successfully!"
cd ../..