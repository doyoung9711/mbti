const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const connect = require('./schemas');

connect();

const corsOptions = {
    origin: true,
    credentials: true
}

app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: "doyoung",
        cookie: {
            httpOnly: true,
            secure: false
        }
    })
)

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/user", require("./routes/userRouter"));

app.listen(3000, ()=>{
    console.log("mbti start");
})