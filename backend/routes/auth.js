const express = require("express");
const { registerRoute } = require("../controller/auth");

const authRouter = express.Router();


authRouter.post("/register", registerRoute);

module.exports = authRouter;