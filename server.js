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
app.use("/study", require("./routes/studyRouter"));
app.use("/study", require("./routes/postRouter"));
app.use("/test", require("./routes/testRouter"));
const createError = require('http-errors');

app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
    const { status, message } = err;
    res.status(status || 500).json({ status, message });
});

app.listen(3000, ()=>{
    console.log("mbti start");
})
