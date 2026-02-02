const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        trim:true
    },
    images:[{
        type:String
    }],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:[
        {
            commentUser:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            commentText:{
                type:String,
                required:true
            },
            createdAt:{
                type:Date,
                default:Date.now
            }
        }
    ]
},
{timestamps: true});

module.exports = mongoose.model("Post", postSchema);