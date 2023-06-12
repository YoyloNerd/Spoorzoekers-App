const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    microsoftID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    familyName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    scavengerHuntIds: [String],
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
    }
})

module.exports = mongoose.model('User', UserSchema)