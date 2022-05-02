const express = require("express");
const router = express.Router();
const User = require("../schemas/user");


//회원가입
router.post("/join", async (req, res)=>{
    try{
        let obj = { email: req.body.email };
        let user = await User.findOne(obj);
        console.log(user);

        if(user){
            res.json({
                message: "이메일 중복됐습니다.",
                dupYn: "1"
            })
        }else{
            obj={
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                salt: req.body.salt
            }
            user = new User(obj);
            await user.save();
            res.json({
                message: "회원가입 되었습니다.",
                dupYn: "0"
            })
            res.json({success: true, status: 200})

        }
    }catch (err){
        console.log(err);
        res.json({ success: false, status: 400})
    }
})

//로그인
router.post("/login", async(req, res)=>{
    try{
        await User.findOne({email: req.body.email}, async(err, user)=>{
            if(err){
                console.log(err);
            }else{
                console.log(user);
                if(user){
                    const obj={
                        email: req.body.email,
                        password: req.body.password
                    }
                    const user2 = await User.findOne(obj);
                    console.log(user2);
                    if(user2){
                        await User.updateOne(
                       {
                                email: req.body.email
                            },
                            { $set: {loginCnt: 0} }
                        )
                        req.session.email = user.email;
                        res.json({
                            message: "로그인 됐습니다.",
                            _id: user2._id,
                            email: user2.email,

                        })
                    }else{
                        await User.updateOne(
                            {
                                email: req.body.email
                            },
                            { $set: {loginCnt: user.loginCnt + 1}}
                        )
                        res.json({
                            message: `아이디나 패스워드가 ${loginCnt}번 일치하지 않습니다.`
                        })
                        }
                    }else{
                    res.json({message: "아이디가 존재하지 않습니다."})
                }
            }
            }
        )
        res.json({success: true, status: 200})
    }catch(err){
        console.log(err);
        res.json({success: false, status: 400})

    }
})

router.get("/logout", (req, res)=>{
    req.session.destroy(()=>{
        res.json({success: true, status: 200 })
    })

})

module.exports = router;