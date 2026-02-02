const express = require('express');
const { getUser } = require('../controller/userController');

const userRouter = express.Router();

userRouter.get('/user/:id', getUser);

module.exports = userRouter;