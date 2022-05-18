const express = require("express");
const router = express.Router();
const createError = require('http-errors');
const asyncHandler = require('express-async-handler');
const User = require("../schemas/user")
const Post = require("../schemas/post");
const Group = require("../schemas/group")
const {createResponse} = require("../util/response")
const {requiredLogin} = require("../middlewares/auth");


router.post("/:groupId/post", requiredLogin, asyncHandler(async (req, res)=> {
    const {params: {groupId}, user, body} = req;
    const group = await Group.findOne({_id : groupId});
    if(!group) {
        new createError(404, "해당 스터디그룹이 존재하지 않습니다.");
    }
    body.group = group;
    body.writer = user;
    const post = await Post.create(body);
    res.json(createResponse(res, post));
}))

router.put("/:groupId/post/:postId", requiredLogin, asyncHandler(async (req, res)=> {
    const {params: {groupId, postId}, user, body} = req;
    const group = await Group.findOne({_id : groupId});
    if(!group) {
        new createError(404, "해당 스터디그룹이 존재하지 않습니다.");
    }
    const post = await Post.findOne({_id : postId});
    if(String(user._id) !== String(post.writer)) {
        throw createError(400, "해당 권한이 없습니다.")
    }
    await Post.updateOne({_id: postId}, body);
    res.json(createResponse(res));
}))

router.delete("/:groupId/post/:postId", requiredLogin, asyncHandler(async (req, res)=> {
    const {params: {groupId, postId}, user} = req;
    const group = await Group.findOne({_id : groupId});
    if(!group) {
        new createError(404, "해당 스터디그룹이 존재하지 않습니다.");
    }
    const post = await Post.findOne({_id : postId});
    if(String(user._id) !== String(post.writer)) {
        throw createError(400, "해당 권한이 없습니다.")
    }
    await Post.deleteOne({_id : postId});
    res.json(createResponse(res));
}))

router.get("/:groupId/posts", requiredLogin, asyncHandler(async (req, res)=> {
    const {params: {groupId}} = req;
    const group = await Group.findOne({_id : groupId});
    if(!group) {
        new createError(404, "해당 스터디그룹이 존재하지 않습니다.");
    }
    const posts = await Post.find({group});
    res.json(createResponse(res, posts));
}))

router.get("/:groupId/post/:postId", requiredLogin, asyncHandler(async (req, res)=> {
    const {params: {groupId, postId}} = req;
    const group = await Group.findOne({_id : groupId});
    if(!group) {
        new createError(404, "해당 스터디그룹이 존재하지 않습니다.");
    }
    const post = await Post.find({_id : postId});
    res.json(createResponse(res, post));
}))


module.exports = router;
