const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    questionID: {
        type: String,
        required: true,
    },
    longitude: String,
    latitude: String,
    isCompleted: {
        type: Boolean,
        required: true,
        default: false,
    },

})

module.exports = mongoose.model('Marker', UserSchema)