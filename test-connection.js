// test-connection.js
const { connectToNetwork } = require('./server/routes/api');

async function testConnection() {
    try {
        const gateway = await connectToNetwork();
        console.log('Successfully connected to Fabric network');
        await gateway.disconnect();
        console.log('Disconnected from network');
    } catch (error) {
        console.error('Connection test failed:', error);
    }
}

testConnection();