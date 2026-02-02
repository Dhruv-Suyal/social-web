require("dotenv").config({path:'contact.env'});
const express = require('express');
const { default: mongoose } = require("mongoose");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/userRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(authRouter);
app.use(userRouter);

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("MongoDB connected");
    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port: http://localhost:${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log(err);
    process.exit(1);
})

