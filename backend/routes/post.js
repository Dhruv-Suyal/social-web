const express = require('express');
const { createPost, getAllPosts, likePost, addComment, deletePost } = require('../controller/post');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');
const postRouter = express.Router();

postRouter.get('/posts', authMiddleware , getAllPosts);
postRouter.post('/posts', authMiddleware, upload.array('images'), createPost);
postRouter.post('/posts/:postId/like', authMiddleware, likePost);
postRouter.post('/posts/:postId/comment', authMiddleware, addComment);
postRouter.delete('/posts/:postId', authMiddleware, deletePost);

module.exports = postRouter;