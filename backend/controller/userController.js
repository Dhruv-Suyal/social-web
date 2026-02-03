const user = require("../model/user");
const Post = require("../model/post");

exports.getUser = async (req, res)=>{
    try{
        const userId = req.params.id;
        const thatUser = await user.findById(userId).select("-password");
        if(!thatUser){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(thatUser);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }

}

exports.getCurrentUser = async (req, res)=>{
    try{
        const userId = req.user.id;
        const thatUser = await user.findById(userId).select("-password");
        if(!thatUser){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(thatUser);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }

}

exports.getUserPosts = async (req, res)=>{
    try{
        const userId = req.user.id;
        const posts = await Post.find({user: userId}).populate('user').populate('likes', 'userName email').populate('comments.commentUser', 'userName email').sort({createdAt: -1});
        res.status(200).json(posts);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }

}