const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mbti: {
      type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("User", userSchema);
