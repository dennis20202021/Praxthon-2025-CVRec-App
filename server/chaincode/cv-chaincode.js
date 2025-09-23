const { Contract, Context } = require('fabric-contract-api');

class CVContext extends Context {
    constructor() {
        super();
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
            // USE TRANSACTION TIMESTAMP INSTEAD OF new Date()
            const txTimestamp = ctx.stub.getTxTimestamp();
            const createdAt = new Date(txTimestamp.seconds * 1000 + txTimestamp.nanos / 1000000).toISOString();

            const initialUsers = [
                {
                    userId: 'admin_user',
                    email: 'admin@example.com',
                    name: 'Admin User',
                    role: 'candidate',
                    createdAt: createdAt // Now deterministic!
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

            // USE TRANSACTION TIMESTAMP INSTEAD OF new Date()
            const txTimestamp = ctx.stub.getTxTimestamp();
            const createdAt = new Date(txTimestamp.seconds * 1000 + txTimestamp.nanos / 1000000).toISOString();

            const userObj = {
                docType: 'user',
                userId: userId,
                email: user.email,
                password: user.password,
                name: user.name,
                role: user.role,
                createdAt: createdAt  // Now deterministic!
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

            // Check if it's a "user not found" error from GetUserByEmail
            if (error.message.includes('User with email') && error.message.includes('does not exist')) {
                throw new Error('User not found');
            }
            // Re-throw the "Invalid password" error as is
            else if (error.message.includes('Invalid password')) {
                throw error;
            }
            // For any other error, throw generic credentials error
            else {
                throw new Error('Invalid credentials');
            }
        }
    }

    // Job Management
    async CreateJob(ctx, jobId, jobData) {
        try {
            const exists = await this.JobExists(ctx, jobId);
            if (exists) {
                throw new Error(`The job ${jobId} already exists`);
            }

            // USE TRANSACTION TIMESTAMP INSTEAD OF new Date()
            const txTimestamp = ctx.stub.getTxTimestamp();
            const createdAt = new Date(txTimestamp.seconds * 1000 + txTimestamp.nanos / 1000000).toISOString();

            // Parse the job data
            const parsedData = JSON.parse(jobData);

            // Extract salary fields if they exist, otherwise use the salary string
            const salary = parsedData.salaryAmount && parsedData.salaryCurrency && parsedData.salaryFrequency
                ? `${parsedData.salaryCurrency} ${parsedData.salaryAmount}/${parsedData.salaryFrequency}`
                : parsedData.salary;

            // Handle work location type - this is the key fix!
            const workLocationType = parsedData.workLocationType ||
                (parsedData.remote ? "remote" :
                    (parsedData.hybrid ? "hybrid" : "on-site"));

            const job = {
                docType: 'job',
                jobId: jobId,
                title: parsedData.title,
                company: parsedData.company,
                location: parsedData.location,
                description: parsedData.description,
                requirements: parsedData.requirements,
                salary: salary, // Use the formatted salary
                createdAt: createdAt, // Now deterministic!
                applicants: [],
                remote: parsedData.remote || false,
                hybrid: parsedData.hybrid || false,
                workLocationType: workLocationType // Add the work location type
            };

            await ctx.stub.putState(jobId, Buffer.from(JSON.stringify(job)));
            return JSON.stringify(job);
        } catch (error) {
            console.error('Error in CreateJob:', error);
            throw error;
        }
    }

    async UpdateJob(ctx, jobId, jobData) {
        try {
            const exists = await this.JobExists(ctx, jobId);
            if (!exists) {
                throw new Error(`The job ${jobId} does not exist`);
            }

            const jobJSON = await ctx.stub.getState(jobId);
            const existingJob = JSON.parse(jobJSON.toString());
            const updatedData = JSON.parse(jobData);

            // Merge existing job data with new data
            const updatedJob = {
                ...existingJob,
                ...updatedData,
                jobId: existingJob.jobId, // Ensure jobId doesn't change
                applicants: existingJob.applicants || [], // Preserve applicants
                createdAt: existingJob.createdAt // Preserve creation date
            };

            // Handle salary formatting if new salary fields are provided
            if (updatedData.salaryAmount && updatedData.salaryCurrency && updatedData.salaryFrequency) {
                updatedJob.salary = `${updatedData.salaryCurrency} ${updatedData.salaryAmount}/${updatedData.salaryFrequency}`;
            }

            await ctx.stub.putState(jobId, Buffer.from(JSON.stringify(updatedJob)));
            return JSON.stringify(updatedJob);
        } catch (error) {
            console.error('Error in UpdateJob:', error);
            throw error;
        }
    }

    async DeleteJob(ctx, jobId) {
        try {
            const exists = await this.JobExists(ctx, jobId);
            if (!exists) {
                throw new Error(`The job ${jobId} does not exist`);
            }

            await ctx.stub.deleteState(jobId);
            return `Job ${jobId} was deleted successfully`;
        } catch (error) {
            console.error('Error in DeleteJob:', error);
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

            // Check if applicant has already applied
            if (job.applicants && job.applicants.some(app => app.email === applicant.email)) {
                throw new Error(`Applicant ${applicant.email} has already applied to this job`);
            }

            // USE TRANSACTION TIMESTAMP INSTEAD OF new Date()
            const txTimestamp = ctx.stub.getTxTimestamp();
            const appliedAt = new Date(txTimestamp.seconds * 1000 + txTimestamp.nanos / 1000000).toISOString();

            if (!job.applicants) {
                job.applicants = [];
            }

            job.applicants.push({
                ...applicant,
                appliedAt: appliedAt, // Now deterministic!
                status: "Pending" // Add status field for tracking
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

    // Get all users with a specific role
    async GetAllUsersByRole(ctx, role) {
        try {
            const query = {
                selector: {
                    docType: 'user',
                    role: role
                }
            };

            const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
            return await this._getAllResults(iterator);
        } catch (error) {
            console.error('Error in GetAllUsersByRole:', error);
            throw error;
        }
    }

    // Update user profile (for CV upload)
    async UpdateUser(ctx, userId, userData) {
        try {
            const exists = await this.UserExists(ctx, userId);
            if (!exists) {
                throw new Error(`The user ${userId} does not exist`);
            }

            const user = JSON.parse(userData);
            const existingUserJSON = await ctx.stub.getState(userId);
            const existingUser = JSON.parse(existingUserJSON.toString());

            // Merge existing user data with new data
            const updatedUser = {
                ...existingUser,
                ...user,
                userId: existingUser.userId, // Ensure userId doesn't change
                email: existingUser.email, // Ensure email doesn't change
            };

            await ctx.stub.putState(userId, Buffer.from(JSON.stringify(updatedUser)));
            return JSON.stringify(updatedUser);
        } catch (error) {
            console.error('Error in UpdateUser:', error);
            throw error;
        }
    }
}

module.exports = CVChaincode;