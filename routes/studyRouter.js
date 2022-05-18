const express = require("express");
const router = express.Router();
const createError = require('http-errors');
const asyncHandler = require('express-async-handler');
const User = require("../schemas/user")
const Post = require("../schemas/post");
const Group = require("../schemas/group")

//스터디그룹 생성
router.post("/",asyncHandler(async (req, res)=> {
    let obj = {title: req.body.title}
    let group = await Group.findOne(obj);

    if(group){
        throw createError(400, "해당 그룹이름이 이미 존재합니다.")
    } else {
        obj = {
            writer: await User.findOne({_id: req.session.userId}),
            title: req.body.title,
            userCount: req.body.userCount,
            mbti: req.body.mbti //원하는 mbti
        }
        group = new Group(obj);
        await group.save();
        res.json({
            success: true,
            status: 200,
            message: "그룹을 생성했습니다."
        })
    }
}))

router.put("/:userId",asyncHandler(async (req, res)=> {
    Group.findOneAndUpdate({_id: req.session.userId}, {
        $set:{
            title: req.body.title,
            userCount: req.body.userCount,
            mbti: req.body.mbti
        },function(err){
                if(err){
                    createError(400,"update err")
                }
            }
        }
    )
}))

//스터디그룹 삭제
router.delete('/:userId', asyncHandler(async(req, res)=>{
    Group.findOneAndRemove({_id:req.session.userId}, (err)=> {
        if(err){
            createError(400, "delete err")
        }
    })
}))

//스터디 그룹 가져오기


module.exports = router;