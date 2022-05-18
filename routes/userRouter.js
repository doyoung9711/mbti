const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const createError = require('http-errors');
const asyncHandler = require('express-async-handler');
const Post = require("../schemas/post");
const Group = require("../schemas/group")
const {requiredLogin} = require("../middlewares/auth");
const {createResponse} = require("../util/response");

//회원가입
router.post("/join", asyncHandler(async (req, res) => {

        let obj = {email: req.body.email};
        let user = await User.findOne(obj);
        console.log(user);

        if (user) {
            throw createError(400, "해당 이메일 정보가 이미 존재합니다.");
        } else {
            obj = {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password
            }
            user = new User(obj);
            await user.save();
            res.json({
                success: true,
                status: 200,
                message: "회원가입 되었습니다.",
            })
        }
    })
)

//로그인
router.post("/login", asyncHandler(async (req, res) => {

    const user = await User.findOne({email: req.body.email, password: req.body.password});
    if (!user) {
        throw createError(400, '아이디 또는 비밀번호가 일치하지 않습니다.')
    } else {
        req.session.save(()=>{
            req.session.userId = user._id;
            res.json({
                success: true,
                status: 200,
                data: user,
                message: 'login success'})
        })
    }
}))

router.get("/logout", asyncHandler(async (req, res) => {
    req.session.destroy(() => {
        res.json({ data: null, success: true, status: 200})
    })

}))

//사용자정보 get
router.get("/me", requiredLogin, asyncHandler(async(req, res)=>{
    const {user} = req;
    res.json(createResponse(res, user));
}))

module.exports = router;
