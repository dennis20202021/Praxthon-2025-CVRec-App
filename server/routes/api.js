const express = require('express');
const router = express.Router();
const { Gateway, Wallets, DefaultEventHandlerStrategies } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const { loadCertificates } = require('../utils/certLoader');

// Connect to Fabric Network
async function connectToNetwork(userId = 'admin') {
    let gateway;
    try {
        const ccpPath = path.resolve(__dirname, '../network', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Load certificates from files
        ccp = loadCertificates(ccp);

        // Load file system wallet
        const walletPath = path.join(process.cwd(), 'server', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if the user exists in the wallet
        const identity = await wallet.get(userId);
        if (!identity) {
            throw new Error(`User ${userId} not found in wallet`);
        }

        gateway = new Gateway();

        // Connect with proper configuration
        await gateway.connect(ccp, {
            wallet,
            identity: userId,
            discovery: {
                enabled: true,
                asLocalhost: true
            },
            eventHandlerOptions: {
                strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX,
                commitTimeout: 300,
                endorseTimeout: 30
            }
        });

        return gateway;
    } catch (error) {
        console.error('Failed to connect to network:', error);
        if (gateway) {
            await gateway.disconnect();
        }
        throw error;
    }
}

// User Routes
router.post('/register', async (req, res) => {
    let gateway;
    try {
        const { email, password, name, role } = req.body;
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        const userData = JSON.stringify({ email, password, name, role });
        const userId = `USER_${Date.now()}`;

        const result = await contract.submitTransaction('CreateUser', userId, userData);

        const user = JSON.parse(result.toString());
        res.json({
            success: true,
            message: 'User registered successfully',
            userId: user.userId,
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        // Check if it's a network connection error
        if (error.message.includes('Network connection failed')) {
            res.status(503).json({ error: 'Blockchain network unavailable. Please try again later.' });
        } else {
            res.status(500).json({ error: error.message });
        }
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

router.post('/login', async (req, res) => {
    let gateway;
    try {
        const { email, password } = req.body;
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        const result = await contract.evaluateTransaction('AuthenticateUser', email, password);

        const user = JSON.parse(result.toString());
        res.json({ success: true, user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: 'Invalid credentials' });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

// Job Routes
router.post('/jobs', async (req, res) => {
    let gateway;
    try {
        const { title, company, location, description, requirements, salary } = req.body;
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        const jobData = JSON.stringify({ title, company, location, description, requirements, salary });
        const jobId = `JOB_${Date.now()}`;

        const result = await contract.submitTransaction('CreateJob', jobId, jobData);

        const job = JSON.parse(result.toString());

        res.json({
            success: true,
            message: 'Job created successfully',
            jobId: job.jobId,
            job
        });
    } catch (error) {
        console.error('Job creation error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

router.get('/jobs', async (req, res) => {
    let gateway;
    try {
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        const result = await contract.evaluateTransaction('GetAllJobs');

        const jobs = JSON.parse(result.toString());
        res.json({ success: true, jobs });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

router.post('/jobs/:id/apply', async (req, res) => {
    let gateway;
    try {
        const { applicantName, applicantEmail, coverLetter } = req.body;
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        const applicantData = JSON.stringify({ name: applicantName, email: applicantEmail, coverLetter });

        const result = await contract.submitTransaction('ApplyForJob', req.params.id, applicantData);

        const job = JSON.parse(result.toString());

        res.json({
            success: true,
            message: 'Application submitted successfully',
            job
        });
    } catch (error) {
        console.error('Job application error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

// Add a new endpoint to get user profile
router.get('/user/:email', async (req, res) => {
    let gateway;
    try {
        const { email } = req.params;
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        const result = await contract.evaluateTransaction('GetUserByEmail', email);

        const user = JSON.parse(result.toString());
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(404).json({ error: 'User not found' });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

// server/routes/api.js - Add this endpoint
router.post('/init', async (req, res) => {
    let gateway;
    try {
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        // Initialize the ledger
        const result = await contract.submitTransaction('initLedger');

        res.json({
            success: true,
            message: 'Ledger initialized successfully',
            result: result.toString()
        });
    } catch (error) {
        console.error('Initialization error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

// server/routes/api.js - Add this endpoint
router.get('/health', async (req, res) => {
    let gateway;
    try {
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        // Simple query to test if chaincode is working
        const result = await contract.evaluateTransaction('GetAllJobs');

        res.json({
            success: true,
            status: 'Chaincode is operational',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({
            success: false,
            status: 'Chaincode unavailable',
            error: error.message
        });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

module.exports = router;
module.exports.connectToNetwork = connectToNetwork; // Add this line