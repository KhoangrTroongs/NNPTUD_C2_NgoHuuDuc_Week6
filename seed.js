const mongoose = require('mongoose');
const roleModel = require('./schemas/roles');
const userModel = require('./schemas/users');
const bcrypt = require('bcrypt');

const mongoURI = 'mongodb://admin:password123@localhost:27017/ngohuuduc?authSource=admin';

async function seed() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Create Roles
        const roleNames = ['admin', 'mod', 'user'];
        const roles = {};

        for (const name of roleNames) {
            let role = await roleModel.findOne({ name });
            if (!role) {
                role = new roleModel({ name, description: `System ${name} role` });
                await role.save();
                console.log(`Created role: ${name}`);
            }
            roles[name] = role;
        }

        // 2. Create Admin User
        const adminUsername = 'admin_test';
        let adminUser = await userModel.findOne({ username: adminUsername });

        if (!adminUser) {
            adminUser = new userModel({
                username: adminUsername,
                password: 'admin123', // Will be hashed by pre-save hook
                email: 'admin_test@example.com',
                role: roles['admin']._id,
                status: true
            });
            await adminUser.save();
            console.log('Created Admin User: admin_test / admin123');
        } else {
            console.log('Admin user already exists.');
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
