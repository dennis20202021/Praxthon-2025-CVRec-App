// server/chaincode/cv-chaincode.js
const { Contract } = require('fabric-contract-api');

class CVChaincode extends Contract {
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
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
    }

    // User Management - keep the rest of your methods as they are
    async CreateUser(ctx, userId, userData) {
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

        const emailIndexKey = ctx.stub.createCompositeKey('email', [user.email]);
        await ctx.stub.putState(emailIndexKey, Buffer.from(userId));

        console.log('User created successfully:', userId);
        return JSON.stringify(userObj);
    }

    async UserExists(ctx, userId) {
        const userJSON = await ctx.stub.getState(userId);
        return userJSON && userJSON.length > 0;
    }

    async GetUser(ctx, userId) {
        const userJSON = await ctx.stub.getState(userId);
        if (!userJSON || userJSON.length === 0) {
            throw new Error(`The user ${userId} does not exist`);
        }
        return userJSON.toString();
    }

    async GetUserByEmail(ctx, email) {
        const emailIndexKey = ctx.stub.createCompositeKey('email', [email]);
        const userIdBytes = await ctx.stub.getState(emailIndexKey);

        if (!userIdBytes || userIdBytes.length === 0) {
            throw new Error(`User with email ${email} does not exist`);
        }

        const userId = userIdBytes.toString();
        return await this.GetUser(ctx, userId);
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
            throw new Error('Invalid credentials');
        }
    }

    // Job Management (keep your existing job functions)
    async CreateJob(ctx, jobId, jobData) {
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
    }

    async JobExists(ctx, jobId) {
        const jobJSON = await ctx.stub.getState(jobId);
        return jobJSON && jobJSON.length > 0;
    }

    async GetJob(ctx, jobId) {
        const jobJSON = await ctx.stub.getState(jobId);
        if (!jobJSON || jobJSON.length === 0) {
            throw new Error(`The job ${jobId} does not exist`);
        }
        return jobJSON.toString();
    }

    async GetAllJobs(ctx) {
        const query = {
            selector: {
                docType: 'job'
            }
        };

        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        return await this._getAllResults(iterator);
    }

    async ApplyForJob(ctx, jobId, applicantData) {
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
    }

    // Helper function
    async _getAllResults(iterator) {
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
    }
}

module.exports = CVChaincode;