const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
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

// Create Post
router.post('/', auth, async (req, res) => {
    try {
        const { targetProfileId, text } = req.body;

        const newPost = new Post({
            author: req.user.id,
            targetProfile: targetProfileId,
            text
        });

        const post = await newPost.save();

        // Populate author details for immediate display
        await post.populate('author', 'name profilePic');

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Profile Posts
router.get('/user/:id', auth, async (req, res) => {
    try {
        const posts = await Post.find({ targetProfile: req.params.id })
            .sort({ createdAt: -1 })
            .populate('author', 'name profilePic')
            .populate('comments.author', 'name profilePic');
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add Comment
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const newComment = {
            author: req.user.id,
            text: req.body.text
        };

        post.comments.unshift(newComment);
        await post.save();

        // Re-fetch to populate
        const updatedPost = await Post.findById(req.params.id)
            .populate('author', 'name profilePic')
            .populate('comments.author', 'name profilePic');

        res.json(updatedPost);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Feed (My posts + Friends' posts)
router.get('/feed', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const friendIds = currentUser.friends;

        // Include own posts and friends' posts
        // Logic: Posts where author is me OR author is a friend
        // OR Posts where targetProfile is me OR targetProfile is a friend (Wall posts)

        const posts = await Post.find({
            $or: [
                { author: { $in: [...friendIds, req.user.id] } },
                { targetProfile: { $in: [...friendIds, req.user.id] } }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('author', 'name profilePic')
            .populate('targetProfile', 'name')
            .populate('comments.author', 'name profilePic');

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
