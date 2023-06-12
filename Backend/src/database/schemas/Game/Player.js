const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    teamId: String, 
    name: String,
    isLeader: {
        type: Boolean,
        required: true,
        default: false,
    },
    isInGame: {
        type: Boolean,
        required: true,
        default: false,
    },
    keepAlive: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

module.exports = mongoose.model('Player', UserSchema)