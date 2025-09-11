#!/bin/bash

# Download Fabric samples and binaries if not already present
if [ ! -d "fabric-samples" ]; then
    echo "Downloading Fabric samples..."
    curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.4.7 1.5.5
fi

# Set path to binaries
export PATH=${PWD}/fabric-samples/bin:$PATH

# Start the test network with Certificate Authorities
echo "Starting Fabric network with CAs..."
cd fabric-samples/test-network

# Bring down any existing network first
./network.sh down

# Remove any existing chaincode containers and images
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -q)

# Start the network with CAs and create channel
./network.sh up createChannel -c mychannel -s couchdb -ca

# Wait for all services to be fully up
echo "Waiting for services to start..."
sleep 30

# Check if all containers are running (including CAs)
echo "Checking container status..."
docker ps

echo "Deploying chaincode..."
./network.sh deployCC -ccn cvchaincode -ccp ../../server/chaincode -ccl javascript -c mychannel

cd ../..
echo "Fabric network with CAs is running!"