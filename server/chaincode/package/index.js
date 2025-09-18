// server/chaincode/index.js
const { CVChaincode } = require('./cv-chaincode.js');

// Fabric Node.js chaincode requires this specific export structure
module.exports = CVChaincode;
module.exports.contracts = [CVChaincode];