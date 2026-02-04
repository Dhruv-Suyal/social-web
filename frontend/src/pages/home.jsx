import './home.css';
import { Navbar } from '../components/nav';
import { Profile } from './profile';
import { useState, useEffect } from 'react';
import API from '../api';

/**
 * Home Page Component
 * Displays social media feed with posts, likes, comments, and post creation
 */
export function Home(){
    // UI state management
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Post data state
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState('');
    const [postImages, setPostImages] = useState([]);

    // Interaction state
    const [showComments, setShowComments] = useState({});
    const [commentTexts, setCommentTexts] = useState({});
    const [commentingPostId, setCommentingPostId] = useState(null);
    const [likedPosts, setLikedPosts] = useState(new Set());

    // Modal state
    const [showModal, setShowModal] = useState(null);
    const [modalType, setModalType] = useState(null);

    // Fetch posts on component mount
    useEffect(() => {
        fetchPosts();
    }, []);

    /**
     * Fetch all posts from the server
     */
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await API.get('/posts');
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle image selection for post creation
     */
    const handleImageSelect = (e) => {
        // Convert FileList to array and store selected images
        const files = Array.from(e.target.files);
        setPostImages(files);
    };

    /**
     * Create and submit a new post with text and/or images
     */
    const handleCreatePost = async () => {
        // Validate that post has text or images
        if (!postText.trim() && postImages.length === 0) return;
        try {
            setIsCreating(true);
            const formData = new FormData();
            formData.append('text', postText);
            
            // Add all selected images to FormData
            postImages.forEach(image => {
                formData.append('images', image);
            });

            const res = await API.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Add new post to the top of feed
            setPosts([res.data, ...posts]);
            setPostText('');
            setPostImages([]);
            
            // Reset file input
            const fileInput = document.getElementById('imageInput');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const res = await API.post(`/posts/${postId}/like`);
            // Update the specific post with the new data from server
            setPosts(posts.map(post => 
                post._id === postId ? res.data : post
            ));
            // Track liked posts for UI state
            const newLiked = new Set(likedPosts);
            if (newLiked.has(postId)) {
                newLiked.delete(postId);
            } else {
                newLiked.add(postId);
            }
            setLikedPosts(newLiked);
        } catch (error) {
            console.error('Error liking post:', error.response?.data || error.message);
            alert('Failed to like post');
        }
    };

    const handleAddComment = async (postId) => {
        // Get the comment text for this specific post
        const commentText = commentTexts[postId];
        // Validate comment is not empty
        if (!commentText || commentText.trim() === '') {
            alert('Please enter a comment');
            return;
        }

        try {
            setCommentingPostId(postId);
            const res = await API.post(`/posts/${postId}/comment`, { commentText });
            // Update the specific post with the new data from server
            setPosts(posts.map(post => 
                post._id === postId ? res.data : post
            ));
            // Clear the comment input after successful submission
            setCommentTexts({ ...commentTexts, [postId]: '' });
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        } finally {
            setCommentingPostId(null);
        }
    };

    return (
        <>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="container">
            {activeTab === 'posts' ? (
                <>
                    {/* Create Post Section */}
                    <div className="create-post">
                        <input 
                            type="text" 
                            placeholder="What's on your mind?" 
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                        />
                        
                        {/* Image Preview */}
                        {postImages.length > 0 && (
                            <div className="image-preview">
                                {postImages.map((image, idx) => (
                                    <div key={idx} className="preview-item">
                                        <img src={URL.createObjectURL(image)} alt="Preview" />
                                        <button 
                                            className="remove-image"
                                            onClick={() => setPostImages(postImages.filter((_, i) => i !== idx))}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="post-actions">
                            <div className="icons">
                                <label htmlFor="imageInput" className="image-upload-label">
                                    📷
                                </label>
                                <input 
                                    id="imageInput"
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <div className="right-actions">
                                <button 
                                    className="post-btn" 
                                    onClick={handleCreatePost}
                                    disabled={isCreating}
                                >
                                    {isCreating ? '⏳ Posting...' : '➤ Post'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Posts List */}
                    {loading ? (
                        <div className="posts-loading">Loading posts...</div>
                    ) : posts.length === 0 ? (
                        <div className="no-posts">No posts available. Be the first to post!</div>
                    ) : (
                        posts.map(post => (
                            <div key={post._id} className="post-card">
                                <div className="post-header">
                                    <div className="user-info">
                                        <div className="avatar">👤</div>
                                        <div>
                                            <h3>{post.user?.userName || 'User'}</h3>
                                            <p>{new Date(post.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="post-text">{post.text}</p>

                                {post.images && post.images.length > 0 && (
                                    <div className="post-images">
                                        {post.images.map((img, idx) => (
                                            <img key={idx} src={img} alt="Post" />
                                        ))}
                                    </div>
                                )}

                                <div className="post-stats">
                                    <span 
                                        onClick={() => {
                                            setShowModal({ likes: post.likes || [] });
                                            setModalType('likes');
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        👍 {post.likes?.length || 0} Likes
                                    </span>
                                    <span 
                                        onClick={() => {
                                            setShowModal({ comments: post.comments || [] });
                                            setModalType('comments');
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        💬 {post.comments?.length || 0} Comments
                                    </span>
                                </div>

                                <div className="post-actions-bar">
                                    <button 
                                        className={`action-btn like-btn ${likedPosts.has(post._id) ? 'liked' : ''}`}
                                        onClick={() => handleLike(post._id)}
                                    >
                                        👍 {likedPosts.has(post._id) ? 'Liked' : 'Like'}
                                    </button>
                                    <button 
                                        className="action-btn comment-btn"
                                        onClick={() => setShowComments({
                                            ...showComments, 
                                            [post._id]: !showComments[post._id]
                                        })}
                                    >
                                        💬 {showComments[post._id] ? 'Hide' : 'Comment'}
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {showComments[post._id] && (
                                    <div className="comments-section">
                                        <div className="comments-list">
                                            {post.comments && post.comments.length > 0 ? (
                                                post.comments.map((comment, idx) => (
                                                    <div key={idx} className="comment-item">
                                                        <div className="comment-avatar">👤</div>
                                                        <div className="comment-content">
                                                            <p className="comment-text">{comment.commentText}</p>
                                                            <span className="comment-time">
                                                                {new Date(comment.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="no-comments">No comments yet</p>
                                            )}
                                        </div>
                                        <div className="comment-input-wrapper">
                                            <input 
                                                type="text" 
                                                placeholder="Add a comment..." 
                                                className="comment-input"
                                                value={commentTexts[post._id] || ''}
                                                onChange={(e) => setCommentTexts({
                                                    ...commentTexts,
                                                    [post._id]: e.target.value
                                                })}
                                            />
                                            <button 
                                                className="comment-submit"
                                                onClick={() => handleAddComment(post._id)}
                                                disabled={commentingPostId === post._id}
                                            >
                                                {commentingPostId === post._id ? '⏳' : 'Post'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {/* Floating Button */}
                    <button className="float-btn">⬆</button>
                </>
            ) : (
                <Profile />
            )}
        </div>

        {/* Modal for showing likers/commenters */}
        {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
                    
                    {modalType === 'likes' ? (
                        <div className="modal-body">
                            <h3>👍 People who liked this</h3>
                            {showModal.likes.length === 0 ? (
                                <p className="modal-empty">No likes yet</p>
                            ) : (
                                <div className="modal-list">
                                    {showModal.likes.map((like, idx) => (
                                        <div key={idx} className="modal-item">
                                            <span className="modal-avatar">👤</span>
                                            <span className="modal-name">{like.userName || 'Unknown'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="modal-body">
                            <h3>💬 Comments</h3>
                            {showModal.comments.length === 0 ? (
                                <p className="modal-empty">No comments yet</p>
                            ) : (
                                <div className="modal-list">
                                    {showModal.comments.map((comment, idx) => (
                                        <div key={idx} className="modal-comment-item">
                                            <span className="modal-avatar">👤</span>
                                            <div className="modal-comment-content">
                                                <p className="modal-comment-name">{comment.user?.userName || comment.commentUser?.userName || 'Unknown'}</p>
                                                <p className="modal-comment-text">{comment.commentText}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )}
        </>
    )
}