const express = require('express');
const { getUser, getCurrentUser, getUserPosts } = require('../controller/userController');
const { authMiddleware } = require('../middleware/auth');

const userRouter = express.Router();

userRouter.get('/user/:id', authMiddleware, getUser);
userRouter.get('/user', authMiddleware, getCurrentUser);
userRouter.get('/user/posts/my', authMiddleware, getUserPosts);

module.exports = userRouter;