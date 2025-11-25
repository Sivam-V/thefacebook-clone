const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Student',
    },
    profile: {
        political_views: String,
        interests: String,
        favorite_music: String,
        favorite_books: String,
        about_me: String, // bio
        school: String,
        concentration: String, // Major
        hometown: String,
        sex: String,
        birthday: Date,
        website: String,
    },
    profilePic: {
        type: String,
        default: ''
    },
    photos: [{
        type: String
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    incomingRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    outgoingRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    profileViews: [{
        viewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        at: {
            type: Date,
            default: Date.now
        }
    }],
    pokes: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        at: {
            type: Date,
            default: Date.now
        }
    }],
    metadata: {
        joined_at: {
            type: Date,
            default: Date.now,
        },
        last_login: Date,
    }
});

module.exports = mongoose.model('User', UserSchema);
