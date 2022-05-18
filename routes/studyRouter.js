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
    const {user} = req;
    let obj = {title: req.body.title}
    let group = await Group.findOne(obj);
    if(group){
        throw createError(400, "해당 그룹이름이 이미 존재합니다.")
    } else {
        obj = {
            writer: user,
            title: req.body.title,
            userCount: req.body.userCount,
            mbti: req.body.mbti, //원하는 mbti
            location: req.body.location
        }
        group = new Group(obj);
        group.participants.push(user);
        await group.save();
        res.json(createResponse(res, group));
    }
}))

router.put("/:groupId",requiredLogin, asyncHandler(async (req, res)=> {
    const {params: {groupId}, body, user} = req;
    const group = await Group.findOne({_id: groupId})
    if(String(user._id) !== String(group.writer)) {
        throw createError(400, "해당 권한이 없습니다.")
    }
    await Group.updateOne({_id : groupId}, body);
    res.json(createResponse(res));
}))

router.delete("/:groupId", requiredLogin, asyncHandler(async (req, res)=> {
    const {params: {groupId}, user} = req;
    const group = await Group.findOne({_id : groupId});
    if(String(user._id) !== String(group.writer)) {
        throw createError(400, "해당 권한이 없습니다.")
    }
    await Group.deleteOne({_id : groupId});
    res.json(createResponse(res));
}))

router.post("/:groupId/enroll", requiredLogin, asyncHandler(async (req, res)=> {
    const {params: {groupId}, user} = req;
    const group = await Group.findOne({_id : groupId}).populate("writer");
    if(group.participants.length >= group.userCount) {
        throw createError(400, "이미 스터디그룹의 정원이 꽉찼습니다.");
    }
    if (group.participants.includes(user._id)) {
        throw createError(400, "이미 스터디그룹에 포함되어 있습니다.");
    }
    if(!group.mbti.includes(user.mbti)) {
        throw createError(400, "해당 mbti는 접근할 수 없습니다.");
    }
    group.participants.push(user);
    await group.save();
    res.json(createResponse(res));
}))

router.post("/:groupId/unenroll", requiredLogin, asyncHandler(async (req, res)=> {
    const {params: {groupId}, user} = req;
    const group = await Group.findOne({_id : groupId});
    const idx = group.participants.indexOf(user._id);
    if (idx !== -1) {
        group.participants.splice(idx, 1);
    }
    await group.save();
    const groupA = await Group.findOne({_id : groupId});
    res.json(createResponse(res, groupA));
}))

router.get("/", asyncHandler(async (req, res)=> {
    const {query: {location}} = req;
    const groups = location ? await Group.find({location}) : await Group.find();
    res.json(createResponse(res, groups));
}))

router.get("/:groupId", asyncHandler(async (req, res)=> {
    const { params: {groupId} } = req;
    const group = await Group.find({_id : groupId});
    res.json(createResponse(res, group));
}))

router.get("/user/me", requiredLogin, asyncHandler(async (req, res)=> {
    const { user } = req;
    const group = await Group.find({writer: user});
    res.json(createResponse(res, group));
}))



module.exports = router;
