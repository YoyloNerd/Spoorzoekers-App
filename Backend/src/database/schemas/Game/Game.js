const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        unique: true,
    },
    scavengerhunt: {
        type: String,
        required: true,
    },
    teams: [String],
    teamSize: Number,
    playerWaitingRoom: [String],
    keepAlive: {
        type: Date,
        required: true,
        default: Date.now,
    },
    started: {
        type: Boolean,
        required: true,
        default: false,
    },
})

module.exports = mongoose.model('Game', UserSchema)