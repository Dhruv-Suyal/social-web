const bcrypt = require('bcrypt');
const user = require('../model/user');

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

exports.loginRoute = async (req, res)=>{
    try{
        const {email, password} = req.body;
        const loggedUser = await user.findOne({email});
        if(loggedUser){
            const isMatch = await bcrypt.compare(password, loggedUser.password);
            if(!isMatch){
                return res.status(400).json({ message: "Invalid credentials" });
            }
            return res.json({loggedUser});
        }
        else{
            return res.status(400).json({ message: "User not found" });
        }

    }catch(err){
        res.status(500).json({message:err.message});
    }
}



