const bcrypt = require('bcrypt');
const user = require('../model/user');
const jwt = require("jsonwebtoken");
const { tokenBlacklist } = require('../middleware/auth');

/**
 * Register a new user
 * Validates input, checks for existing email, hashes password, and creates user account
 */
exports.registerRoute = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Validate input
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" , success:false });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered", success:false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", success:true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", success:false });
  }
};


exports.loginRoute = async (req, res)=>{
    try{
        const {email, password} = req.body;
        const loggedUser = await user.findOne({email});
        if(loggedUser){
            const isMatch = await bcrypt.compare(password, loggedUser.password);
            if(!isMatch){
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                {id: loggedUser._id},
                process.env.JWT_SECRET,
                {
                    expiresIn:"7d"
                }
            );

            return res.json(
                {  
                    message:"Login successfully",
                    token
                });
        }
        else{
            return res.status(400).json({ message: "User not found" });
        }

    }catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.logoutRoute = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Add token to blacklist
    tokenBlacklist.add(token);

    res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






