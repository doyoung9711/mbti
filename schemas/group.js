const mongoose = require("mongoose");

const { Schema } = mongoose;
const groupSchema = new Schema({
    writer: { // 글쓴이
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: { // 제목
        type: String,
        required: true,
    },
    location: { // 위치
        type: String,
        required: true,
    },
    userCount: { // 원하는 그룹 멤버수
        type: Number,
        required: true,
    },
    participants : [{ // 참가자들
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    mbti: [{ //원하는 mbti
        type: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("Group", groupSchema);
