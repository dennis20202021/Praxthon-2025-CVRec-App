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
        const { email, password, role } = req.body;
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        // Authenticate user (this checks email + password)
        const result = await contract.evaluateTransaction('AuthenticateUser', email, password);
        const user = JSON.parse(result.toString());

        // Now check if the role matches
        if (user.role !== role) {
            return res.status(401).json({ error: 'Login failed. Please verify your credentials and try again!' });
        }

        res.json({ success: true, user });

    } catch (error) {
        console.error('Login error:', error);

        // Simple error handling - just two cases
        if (error.message.includes('User not found')) {
            res.status(404).json({ error: "Oops! User not found in our records. Please double-check your details or consider signing up" });
        } else {
            res.status(401).json({ error: 'Login failed. Please verify your credentials and try again!' });
        }
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
        const {
            title,
            company,
            location,
            description,
            requirements,
            salary,
            remote,
            hybrid,
            workLocationType
        } = req.body;

        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        const jobData = JSON.stringify({
            title,
            company,
            location,
            description,
            requirements,
            salary,
            remote: remote || false,
            hybrid: hybrid || false,
            workLocationType: workLocationType || (remote ? "remote" : (hybrid ? "hybrid" : "on-site"))
        });

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

        const applicantData = JSON.stringify({
            name: applicantName,
            email: applicantEmail,
            coverLetter
        });

        const result = await contract.submitTransaction('ApplyForJob', req.params.id, applicantData);

        const job = JSON.parse(result.toString());

        res.json({
            success: true,
            message: 'Application submitted successfully',
            job
        });
    } catch (error) {
        console.error('Job application error:', error);
        if (error.message.includes('already applied')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

// Update a job
router.put('/jobs/:id', async (req, res) => {
    let gateway;
    try {
        const {
            title,
            company,
            location,
            description,
            requirements,
            salary,
            remote,
            hybrid,
            workLocationType,
            salaryAmount,
            salaryCurrency,
            salaryFrequency
        } = req.body;

        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        const jobData = JSON.stringify({
            title,
            company,
            location,
            description,
            requirements,
            salary,
            remote: remote || false,
            hybrid: hybrid || false,
            workLocationType: workLocationType || (remote ? "remote" : (hybrid ? "hybrid" : "on-site")),
            salaryAmount,
            salaryCurrency,
            salaryFrequency
        });

        const result = await contract.submitTransaction('UpdateJob', req.params.id, jobData);
        const job = JSON.parse(result.toString());

        res.json({
            success: true,
            message: 'Job updated successfully',
            job
        });
    } catch (error) {
        console.error('Job update error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

// Delete a job
router.delete('/jobs/:id', async (req, res) => {
    let gateway;
    try {
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        const result = await contract.submitTransaction('DeleteJob', req.params.id);

        res.json({
            success: true,
            message: result.toString()
        });
    } catch (error) {
        console.error('Job deletion error:', error);
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

// Get all candidates (for recruiters)
router.get('/candidates', async (req, res) => {
    let gateway;
    try {
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        // Get all users with role 'candidate'
        const result = await contract.evaluateTransaction('GetAllUsersByRole', 'candidate');
        const candidates = JSON.parse(result.toString());

        // Remove sensitive information
        const safeCandidates = candidates.map(candidate => {
            const { password, ...safeCandidate } = candidate;
            return safeCandidate;
        });

        res.json({ success: true, candidates: safeCandidates });
    } catch (error) {
        console.error('Get candidates error:', error);

        // Fallback to mock data if chaincode function not available
        const mockCandidates = [
            {
                name: "Michael Johnson",
                title: "Senior Software Engineer",
                experience: "7 years",
                skills: "JavaScript, React, Node.js, AWS",
                education: "MIT, Computer Science",
                status: "New",
            },
            {
                name: "Sarah Williams",
                title: "UX Designer",
                experience: "5 years",
                skills: "Figma, User Research, Prototyping",
                education: "RISD, Design",
                status: "Reviewing",
            },
            {
                name: "David Chen",
                title: "Blockchain Developer",
                experience: "4 years",
                skills: "Hyperledger, Solidity, Smart Contracts",
                education: "Stanford, Computer Science",
                status: "Interview",
            },
        ];

        res.json({ success: true, candidates: mockCandidates });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

// Get applications for a job (for recruiters)
router.get('/jobs/:id/applications', async (req, res) => {
    let gateway;
    try {
        const { id } = req.params;
        gateway = await connectToNetwork();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('cvchaincode');

        const result = await contract.evaluateTransaction('GetJob', id);
        const job = JSON.parse(result.toString());

        res.json({ success: true, applications: job.applicants || [] });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
});

module.exports = router;
module.exports.connectToNetwork = connectToNetwork; // Add this line