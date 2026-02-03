import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './profile.css';

/**
 * Profile Page Component
 * Displays user information and their posts with management options
 */
export function Profile() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, postsRes] = await Promise.all([
                    API.get('/user'),
                    API.get('/user/posts/my')
                ]);
                setUser(userRes.data);
                setPosts(postsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await API.post('/logout');
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handleDeleteClick = (postId) => {
        setDeleteConfirmId(postId);
    };

    const handleConfirmDelete = async () => {
        try {
            await API.delete(`/posts/${deleteConfirmId}`);
            setPosts(posts.filter(post => post._id !== deleteConfirmId));
            setDeleteError('');
            setDeleteConfirmId(null);
        } catch (error) {
            console.error('Error deleting post:', error);
            setDeleteError(error.response?.data?.message || 'Failed to delete post');
            setDeleteConfirmId(null);
            setTimeout(() => setDeleteError(''), 4000);
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmId(null);
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-container">
                    <div className="loading-bar-wrapper">
                        <div className="loading-bar"></div>
                    </div>
                    <p className="loading-text">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {deleteError && (
                <div className="delete-error-alert">
                    <span className="error-icon">✕</span>
                    {deleteError}
                </div>
            )}
            <div className="profile-header">
                <div className="profile-avatar">👤</div>
                <h2 className="profile-username">{user?.userName}</h2>
                <p className="profile-email">{user?.email}</p>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="profile-posts">
                <h3>Your Posts</h3>
                {posts.length === 0 ? (
                    <p>No posts yet.</p>
                ) : (
                    posts.map(post => (
                        <div key={post._id} className="post-card">
                            <div className="post-header">
                                <div className="user-info">
                                    <div className="avatar">👤</div>
                                    <div>
                                        <h3>{post.user.userName}</h3>
                                        <p>{new Date(post.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="post-text">{post.text}</p>
                            {post.images && post.images.length > 0 && (
                                <div className="post-images">
                                    {post.images.map((img, idx) => (
                                        <img key={idx} src={img} alt="Post image" />
                                    ))}
                                </div>
                            )}
                            <div className="post-stats">
                                <span 
                                    className="stat-item likes-stat"
                                    onClick={() => {
                                        setShowModal(post);
                                        setModalType('likes');
                                    }}
                                >
                                    👍 {post.likes.length}
                                </span>
                                <span 
                                    className="stat-item comments-stat"
                                    onClick={() => {
                                        setShowModal(post);
                                        setModalType('comments');
                                    }}
                                >
                                    💬 {post.comments.length}
                                </span>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDeleteClick(post._id)}
                                    title="Delete this post"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))
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
                                                    <p className="modal-comment-name">{comment.commentUser.userName}</p>
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

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="confirm-overlay" onClick={handleCancelDelete}>
                    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="confirm-title">Delete Post?</h3>
                        <p className="confirm-message">Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="confirm-buttons">
                            <button className="confirm-cancel-btn" onClick={handleCancelDelete}>Cancel</button>
                            <button className="confirm-delete-btn" onClick={handleConfirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}