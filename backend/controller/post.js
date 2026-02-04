const { cloudinary_js_config } = require("../config/cloudinary");
const Post = require("../model/post");
const streamifier = require("streamifier");

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;

    let imageUrls = [];
    console.log("Cloudinary:", process.env.CLOUD_NAME);
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary_js_config.uploader.upload_stream(
            { folder: "posts" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });

        imageUrls.push(result.secure_url);
      }
    }

    if (!text && imageUrls.length === 0) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const newPost = await Post.create({
      user: userId,
      text,
      images: imageUrls
    });

    // Populate user info before sending response
    const populatedPost = await newPost.populate('user', 'userName email');

    res.status(201).json(populatedPost);

  } catch (err) {
    try {
   // cloudinary upload
} catch (err) {
   console.log("UPLOAD ERROR:", err);
   return res.status(500).json({ error: err.message });
}

    res.status(500).json({ message: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    // Fetch all posts with populated user and comment information
    const posts = await Post.find()
      .populate("user", "userName email")
      .populate("comments.commentUser", "userName email")
      .populate("likes", "userName email")
      .sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Toggle like on a post - add or remove user's like
 * Checks if user already liked the post and toggles accordingly
 */
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked the post (convert to string for comparison)
    const alreadyLiked = post.likes.some(id => id.toString() === userId.toString());

    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();
    // Refetch the document to properly chain populate calls
    const updatedPost = await Post.findById(postId)
      .populate("user", "userName email")
      .populate("comments.commentUser", "userName email")
      .populate("likes", "userName email");

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Add a comment to a post
 * Validates comment text, adds comment with user reference, and returns updated post
 */
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const { commentText } = req.body;

    if (!commentText || commentText.trim() === '') {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      commentUser: userId,
      commentText: commentText.trim()
    });

    await post.save();
    // Refetch the document to properly chain populate calls
    const updatedPost = await Post.findById(postId)
      .populate("user", "userName email")
      .populate("comments.commentUser", "userName email")
      .populate("likes", "userName email");

    res.status(201).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Delete a post (only by post creator)
 * Verifies user authorization and deletes post from database
 */
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the post creator
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
