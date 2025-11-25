const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Database Connection
const { MongoMemoryServer } = require('mongodb-memory-server');

const fs = require('fs');
const path = require('path');

const startServer = async () => {
    try {
        // Ensure data directory exists
        const dbPath = path.join(__dirname, 'data', 'db');
        if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath, { recursive: true });
        }

        const mongod = await MongoMemoryServer.create({
            instance: {
                dbPath: dbPath,
                storageEngine: 'wiredTiger'
            }
        });
        const uri = mongod.getUri();

        await mongoose.connect(uri);
        console.log('MongoDB Connected (Persistent Local)');

        // Seed Database
        const seedUsers = require('./seed');
        await seedUsers();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
    }
};

startServer();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/posts', require('./routes/posts'));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('TheFacebook API is running');
});
