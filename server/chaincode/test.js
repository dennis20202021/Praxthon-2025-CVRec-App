// server/chaincode/test.js
const CVChaincode = require('./cv-chaincode.js');

// Simple test to verify the chaincode can be instantiated
async function testChaincode() {
    try {
        const chaincode = new CVChaincode();
        console.log('✅ Chaincode instantiated successfully');
        
        // Test that all methods exist
        const methods = [
            'initLedger', 'CreateUser', 'UserExists', 'GetUser', 
            'GetUserByEmail', 'AuthenticateUser', 'CreateJob', 
            'JobExists', 'GetJob', 'GetAllJobs', 'ApplyForJob'
        ];
        
        for (const method of methods) {
            if (typeof chaincode[method] === 'function') {
                console.log(`✅ Method ${method} exists`);
            } else {
                console.log(`❌ Method ${method} missing`);
            }
        }
        
    } catch (error) {
        console.error('❌ Chaincode test failed:', error);
    }
}

testChaincode();