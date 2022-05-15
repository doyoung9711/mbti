const mongoose = require("mongoose");

const { Schema } = mongoose;
const postSchema = new Schema({
    writer: { // 글쓴이
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: { // 제먹
        type: String,
        required: true,
    },
    content: { // 내용
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
})

module.exports = mongoose.model("Post", postSchema);
