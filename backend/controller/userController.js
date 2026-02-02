const user = require("../model/user");


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