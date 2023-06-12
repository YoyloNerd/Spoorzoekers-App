const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    question: {
        type: String,
    },
    answers: {
        type: [{
            answer: String,
            isCorrect: Boolean,
        }],
    },
    hint: String
})

module.exports = mongoose.model('Question', UserSchema)