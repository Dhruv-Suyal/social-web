const express = require('express');
const multer = require('multer');
const path = require('path');
const { createPost, getAllPosts, likePost, addComment, deletePost } = require('../controller/post');
const { authMiddleware } = require('../middleware/auth');
const postRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

postRouter.get('/posts', authMiddleware , getAllPosts);
postRouter.post('/posts', authMiddleware, upload.array('images'), createPost);
postRouter.post('/posts/:postId/like', authMiddleware, likePost);
postRouter.post('/posts/:postId/comment', authMiddleware, addComment);
postRouter.delete('/posts/:postId', authMiddleware, deletePost);

module.exports = postRouter;