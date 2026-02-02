const bcrypt = require('bcrypt');
const user = require("../model/user");

exports.registerRoute = async (req, res)=>{
    const {userName, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({userName, email, password:hashedPassword});

    try{
        await newUser.save();
        res.status(200).json(newUser);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}



