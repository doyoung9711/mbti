const express = require("express");
const router = express.Router();
const createError = require('http-errors');
const asyncHandler = require('express-async-handler');
const User = require("../schemas/user")
const Post = require("../schemas/post");
const Group = require("../schemas/group")
const {createResponse} = require("../util/response")
const {requiredLogin} = require("../middlewares/auth");
//스터디그룹 생성
router.post("/", requiredLogin, asyncHandler(async (req, res)=> {
    const { body :{test}, user } = req;
    let count1 = 0, count2 = 0;
    let mbti = "";
    test.splice(0, 9).forEach(num => count1 += num);
    test.splice(9, 9).forEach(num => count2 += num);
    count1 > count2 ? mbti += "E" : mbti += "I";
    count1 = 0, count2 = 0;
    test.splice(18, 9).forEach(num => count1 += num);
    test.splice(27, 9).forEach(num => count2 += num);
    count1 > count2 ? mbti += "S" : mbti += "N";
    count1 = 0, count2 = 0;
    test.splice(36, 9).forEach(num => count1 += num);
    test.splice(45, 9).forEach(num => count2 += num);
    count1 > count2 ? mbti += "T" : mbti += "F";
    count1 = 0, count2 = 0;
    test.splice(54, 9).forEach(num => count1 += num);
    test.splice(63, 9).forEach(num => count2 += num);
    count1 > count2 ? mbti += "J" : mbti += "P";
    await User.updateOne(user, {mbti});
    res.json(createResponse(res, mbti));
}))

module.exports = router;
