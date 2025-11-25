const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Connect to the SAME database as the server
// Since we are using MongoMemoryServer in server.js, we can't easily connect to it from a separate script 
// unless we export the URI or run this logic inside the server startup.
// HOWEVER, for a persistent local dev environment, we usually use a local mongodb.
// But since we switched to MemoryServer for the user, we need a way to seed it.
// The best way for the user right now is to add a "seed" endpoint or run seeding on server start if empty.

// Let's create a seed function that we can call from server.js

const seedUsers = async () => {
    try {
        const mark = await User.findOne({ email: 'mark@thefacebook.com' });
        if (mark) {
            console.log('Database already seeded with dummy users');
            return;
        }

        console.log('Seeding database...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = [
            {
                name: 'Mark Zuckerberg',
                email: 'mark@thefacebook.com',
                password: hashedPassword,
                status: 'Student',
                profile: {
                    school: 'Harvard',
                    concentration: 'Psychology',
                    joined_at: new Date('2004-02-04')
                }
            },
            {
                name: 'Eduardo Saverin',
                email: 'eduardo@thefacebook.com',
                password: hashedPassword,
                status: 'Student',
                profile: {
                    school: 'Harvard',
                    concentration: 'Economics',
                    joined_at: new Date('2004-02-05')
                }
            },
            {
                name: 'Dustin Moskovitz',
                email: 'dustin@thefacebook.com',
                password: hashedPassword,
                status: 'Student',
                profile: {
                    school: 'Harvard',
                    concentration: 'Computer Science',
                    joined_at: new Date('2004-02-06')
                }
            },
            {
                name: 'Chris Hughes',
                email: 'chris@thefacebook.com',
                password: hashedPassword,
                status: 'Student',
                profile: {
                    school: 'Harvard',
                    concentration: 'History and Literature',
                    joined_at: new Date('2004-02-07')
                }
            }
        ];

        await User.insertMany(users);
        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Seeding error:', err);
    }
};

module.exports = seedUsers;
