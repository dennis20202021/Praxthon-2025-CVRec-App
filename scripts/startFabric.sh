#!/bin/bash

# Download Fabric samples and binaries if not already present
if [ ! -d "fabric-samples" ]; then
    echo "Downloading Fabric samples..."
    curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.4.7 1.5.5
fi

# Set path to binaries
export PATH=${PWD}/fabric-samples/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/fabric-samples/config/

# Start the test network with Certificate Authorities
echo "Starting Fabric network with CAs..."
cd fabric-samples/test-network

# Bring down any existing network first
./network.sh down

# Remove any existing chaincode containers and images
docker rm -f $(docker ps -aq) 2>/dev/null || true
docker rmi -f $(docker images -q "dev-peer*") 2>/dev/null || true
docker volume prune -f

# Start the network with CAs and create channel
echo "Starting network with CAs..."
./network.sh up createChannel -c mychannel -s couchdb -ca

# Wait for all services to be fully up
echo "Waiting for services to start..."
sleep 15

# Check if all containers are running (including CAs)
echo "Checking container status..."
docker ps

# Deploy chaincode using our custom script
cd ../..
echo "Deploying chaincode..."
chmod +x scripts/deployChaincode.sh
./scripts/deployChaincode.sh

echo "Fabric network with CAs is running and chaincode is deployed!"