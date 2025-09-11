#!/bin/bash

# Set path to binaries
export PATH=${PWD}/fabric-samples/bin:$PATH

# Deploy chaincode with correct path
cd fabric-samples/test-network
./network.sh deployCC -ccn cvchaincode -ccp ../../server/chaincode -ccl javascript -c mychannel

cd ../..
echo "Chaincode deployed!"