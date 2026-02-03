const express = require("express");
const authRouter = express.Router();
const { registerRoute, loginRoute, logoutRoute} = require("../controller/auth");
const { authMiddleware } = require("../middleware/auth");




authRouter.post("/register", registerRoute);
authRouter.post("/login", loginRoute);
authRouter.post("/logout", authMiddleware, logoutRoute);

module.exports = authRouter;