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
    },
    questionIDs: [String],

})

module.exports = mongoose.model('ScavengerHunt', UserSchema)