// Load environment variables from configuration file
require("dotenv").config({path:'contact.env'});
const express = require('express');
const cors = require('cors');
const { default: mongoose } = require("mongoose");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/post");

// Initialize Express app
const app = express();

// Enable CORS for client-server communication
app.use(cors());

// Middleware for parsing JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// API Routes
app.use(authRouter);
app.use(userRouter);
app.use(postRouter);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(process.env.PORT, ()=>{
        // Server is running successfully
    })
}).catch((err)=>{
    process.exit(1);
})

