const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        default: 'Team',
    },
    playerIds: [String],
    markers: [String],
    completedQuestionCount: {
        type: Number,
        required: true,
        default: 0,
    },
    totalQuestionCount:{
        type: Number,
        required: true,
        default: 1,
    },
    points: {
        type: Number,
        required: true,
        default: 0,
    },
    keepAlive: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

module.exports = mongoose.model('Team', UserSchema)