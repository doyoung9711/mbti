const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const User = require("../schemas/user")

exports.requiredLogin = asyncHandler(async(req,res,next) => {
    const userId = req.session.userId;
    if(!userId) throw createError(403, "로그인되어 있지 않습니다.");
    req.user = await User.findById(userId);
    if(!req.user) throw createError(400, "해당 유저가 존재하지 않습니다.");
    return next();
})
