const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get Current User Profile (Protected route middleware to be added)
router.get('/me', async (req, res) => {
    // Placeholder: assumes req.user.id is set by middleware
    // For now, we'll need to implement the middleware or pass ID
    res.status(501).json({ msg: 'Not implemented yet' });
});

// Get User by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('friends', 'name status profile.school profilePic')
            .populate('incomingRequests', 'name status profile.school profilePic')
            .populate('pokes.from', 'name profilePic');

        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

// Update Profile
router.put('/:id', async (req, res) => {
    try {
        const { profile, status } = req.body;
        // In a real app, check if req.user.id === req.params.id

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (profile) user.profile = { ...user.profile, ...profile };
        if (status) user.status = status;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Search Users
router.get('/search/:query', async (req, res) => {
    try {
        const users = await User.find({
            name: { $regex: req.params.query, $options: 'i' }
        }).select('name status profile.school');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const multer = require('multer');
const path = require('path');

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

// Upload Profile Picture
router.post('/:id/profile-pic', upload.single('profilePic'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // In a real app, delete old profile pic if exists

        user.profilePic = `/uploads/${req.file.filename}`;
        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Upload User Photo (Album)
router.post('/:id/photos', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Add to photos array
        if (!user.photos) user.photos = [];
        user.photos.unshift(`/uploads/${req.file.filename}`);

        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Poke User
router.post('/:id/poke', async (req, res) => {
    try {
        const { fromUserId } = req.body; // In real app, get from req.user.id
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Add poke
        if (!user.pokes) user.pokes = [];

        // Check if already poked recently? (Optional, skipping for now)

        user.pokes.unshift({ from: fromUserId });
        await user.save();

        res.json({ msg: 'Poke sent!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
