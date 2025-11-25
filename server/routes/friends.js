const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token (Duplicate from auth.js, ideally should be shared)
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Send Friend Request
router.post('/request', auth, async (req, res) => {
    try {
        const { toUserId } = req.body;

        if (req.user.id === toUserId) {
            return res.status(400).json({ msg: 'Cannot add yourself' });
        }

        const targetUser = await User.findById(toUserId);
        const currentUser = await User.findById(req.user.id);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if already friends
        if (currentUser.friends.includes(toUserId)) {
            return res.status(400).json({ msg: 'Already friends' });
        }

        // Check if request already sent
        if (currentUser.outgoingRequests.includes(toUserId)) {
            return res.status(400).json({ msg: 'Request already sent' });
        }

        // Check if request already received (then just accept it)
        if (currentUser.incomingRequests.includes(toUserId)) {
            // Logic to accept could be here, but for now let's tell them to accept
            return res.status(400).json({ msg: 'User has already sent you a request. Please accept it.' });
        }

        // Update arrays
        currentUser.outgoingRequests.push(toUserId);
        targetUser.incomingRequests.push(req.user.id);

        await currentUser.save();
        await targetUser.save();

        res.json({ ok: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Accept Friend Request
router.post('/accept', auth, async (req, res) => {
    try {
        const { fromUserId } = req.body;

        const currentUser = await User.findById(req.user.id);
        const requestUser = await User.findById(fromUserId);

        if (!currentUser || !requestUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Verify request exists
        if (!currentUser.incomingRequests.includes(fromUserId)) {
            return res.status(400).json({ msg: 'No request from this user' });
        }

        // Add to friends list
        currentUser.friends.push(fromUserId);
        requestUser.friends.push(req.user.id);

        // Remove from requests
        currentUser.incomingRequests = currentUser.incomingRequests.filter(id => id.toString() !== fromUserId);
        requestUser.outgoingRequests = requestUser.outgoingRequests.filter(id => id.toString() !== req.user.id);

        await currentUser.save();
        await requestUser.save();

        res.json({ ok: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Decline Friend Request
router.post('/decline', auth, async (req, res) => {
    try {
        const { fromUserId } = req.body;

        const currentUser = await User.findById(req.user.id);
        const requestUser = await User.findById(fromUserId);

        if (!currentUser || !requestUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Remove from requests
        currentUser.incomingRequests = currentUser.incomingRequests.filter(id => id.toString() !== fromUserId);
        requestUser.outgoingRequests = requestUser.outgoingRequests.filter(id => id.toString() !== req.user.id);

        await currentUser.save();
        await requestUser.save();

        res.json({ ok: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Cancel Friend Request
router.post('/cancel', auth, async (req, res) => {
    try {
        const { toUserId } = req.body;

        const currentUser = await User.findById(req.user.id);
        const targetUser = await User.findById(toUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Remove from requests
        currentUser.outgoingRequests = currentUser.outgoingRequests.filter(id => id.toString() !== toUserId);
        targetUser.incomingRequests = targetUser.incomingRequests.filter(id => id.toString() !== req.user.id);

        await currentUser.save();
        await targetUser.save();

        res.json({ ok: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Remove Friend
router.post('/remove', auth, async (req, res) => {
    try {
        const { userId } = req.body;

        const currentUser = await User.findById(req.user.id);
        const targetUser = await User.findById(userId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Remove from friends list
        currentUser.friends = currentUser.friends.filter(id => id.toString() !== userId);
        targetUser.friends = targetUser.friends.filter(id => id.toString() !== req.user.id);

        await currentUser.save();
        await targetUser.save();

        res.json({ ok: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
