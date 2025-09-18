// server/chaincode/cv-chaincode.js
const { Contract, Context } = require('fabric-contract-api');

class CVContext extends Context {
    constructor() {
        super();
        // You can add custom context properties here if needed
    }
}

class CVChaincode extends Contract {
    
    constructor() {
        super('CVChaincode');
    }

    createContext() {
        return new CVContext();
    }

    async beforeTransaction(ctx) {
        console.log(`Transaction: ${ctx.stub.getFunctionAndParameters().fcn}`);
    }

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        try {
            // Add some initial data to ensure the chaincode works
            const initialUsers = [
                {
                    userId: 'admin_user',
                    email: 'admin@example.com',
                    name: 'Admin User',
                    role: 'candidate',
                    createdAt: new Date().toISOString()
                }
            ];

            for (const user of initialUsers) {
                await ctx.stub.putState(user.userId, Buffer.from(JSON.stringify(user)));
                const emailIndexKey = ctx.stub.createCompositeKey('email', [user.email]);
                await ctx.stub.putState(emailIndexKey, Buffer.from(user.userId));
            }

            console.info('============= END : Initialize Ledger ===========');
            return 'SUCCESS';
        } catch (error) {
            console.error('Error in initLedger:', error);
            throw error;
        }
    }

    // User Management
    async CreateUser(ctx, userId, userData) {
        try {
            console.log('Creating user:', userId);
            const exists = await this.UserExists(ctx, userId);
            if (exists) {
                throw new Error(`The user ${userId} already exists`);
            }

            const user = JSON.parse(userData);
            const userObj = {
                docType: 'user',
                userId: userId,
                email: user.email,
                password: user.password,
                name: user.name,
                role: user.role,
                createdAt: new Date().toISOString()
            };

            await ctx.stub.putState(userId, Buffer.from(JSON.stringify(userObj)));

            // Also create an index by email for easy lookup
            const emailIndexKey = ctx.stub.createCompositeKey('email', [user.email]);
            await ctx.stub.putState(emailIndexKey, Buffer.from(userId));

            console.log('User created successfully:', userId);
            return JSON.stringify(userObj);
        } catch (error) {
            console.error('Error in CreateUser:', error);
            throw error;
        }
    }

    async UserExists(ctx, userId) {
        try {
            const userJSON = await ctx.stub.getState(userId);
            return userJSON && userJSON.length > 0;
        } catch (error) {
            console.error('Error in UserExists:', error);
            throw error;
        }
    }

    async GetUser(ctx, userId) {
        try {
            const userJSON = await ctx.stub.getState(userId);
            if (!userJSON || userJSON.length === 0) {
                throw new Error(`The user ${userId} does not exist`);
            }
            return userJSON.toString();
        } catch (error) {
            console.error('Error in GetUser:', error);
            throw error;
        }
    }

    async GetUserByEmail(ctx, email) {
        try {
            const emailIndexKey = ctx.stub.createCompositeKey('email', [email]);
            const userIdBytes = await ctx.stub.getState(emailIndexKey);

            if (!userIdBytes || userIdBytes.length === 0) {
                throw new Error(`User with email ${email} does not exist`);
            }

            const userId = userIdBytes.toString();
            return await this.GetUser(ctx, userId);
        } catch (error) {
            console.error('Error in GetUserByEmail:', error);
            throw error;
        }
    }

    async AuthenticateUser(ctx, email, password) {
        try {
            const userJSON = await this.GetUserByEmail(ctx, email);
            const user = JSON.parse(userJSON);

            if (user.password !== password) {
                throw new Error('Invalid password');
            }

            // Don't return the password in the response
            const { password: _, ...userWithoutPassword } = user;
            return JSON.stringify(userWithoutPassword);
        } catch (error) {
            console.error('Error in AuthenticateUser:', error);
            throw new Error('Invalid credentials');
        }
    }

    // Job Management
    async CreateJob(ctx, jobId, jobData) {
        try {
            const exists = await this.JobExists(ctx, jobId);
            if (exists) {
                throw new Error(`The job ${jobId} already exists`);
            }

            const job = {
                docType: 'job',
                jobId: jobId,
                ...JSON.parse(jobData),
                createdAt: new Date().toISOString(),
                applicants: []
            };

            await ctx.stub.putState(jobId, Buffer.from(JSON.stringify(job)));
            return JSON.stringify(job);
        } catch (error) {
            console.error('Error in CreateJob:', error);
            throw error;
        }
    }

    async JobExists(ctx, jobId) {
        try {
            const jobJSON = await ctx.stub.getState(jobId);
            return jobJSON && jobJSON.length > 0;
        } catch (error) {
            console.error('Error in JobExists:', error);
            throw error;
        }
    }

    async GetJob(ctx, jobId) {
        try {
            const jobJSON = await ctx.stub.getState(jobId);
            if (!jobJSON || jobJSON.length === 0) {
                throw new Error(`The job ${jobId} does not exist`);
            }
            return jobJSON.toString();
        } catch (error) {
            console.error('Error in GetJob:', error);
            throw error;
        }
    }

    async GetAllJobs(ctx) {
        try {
            const query = {
                selector: {
                    docType: 'job'
                }
            };

            const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
            return await this._getAllResults(iterator);
        } catch (error) {
            console.error('Error in GetAllJobs:', error);
            throw error;
        }
    }

    async ApplyForJob(ctx, jobId, applicantData) {
        try {
            const jobJSON = await ctx.stub.getState(jobId);
            if (!jobJSON || jobJSON.length === 0) {
                throw new Error(`The job ${jobId} does not exist`);
            }

            const job = JSON.parse(jobJSON.toString());
            const applicant = JSON.parse(applicantData);

            job.applicants.push({
                ...applicant,
                appliedAt: new Date().toISOString()
            });

            await ctx.stub.putState(jobId, Buffer.from(JSON.stringify(job)));
            return JSON.stringify(job);
        } catch (error) {
            console.error('Error in ApplyForJob:', error);
            throw error;
        }
    }

    // Helper function
    async _getAllResults(iterator) {
        try {
            const allResults = [];
            let result = await iterator.next();

            while (!result.done) {
                const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
                let record;
                try {
                    record = JSON.parse(strValue);
                } catch (err) {
                    record = strValue;
                }
                allResults.push(record);
                result = await iterator.next();
            }

            return allResults;
        } catch (error) {
            console.error('Error in _getAllResults:', error);
            throw error;
        }
    }
}

module.exports = CVChaincode;