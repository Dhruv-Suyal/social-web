
import './nav.css';
import { useState } from 'react';

export function Navbar(){
    const [activeTab, setActiveTab] = useState('posts');

    return(
        <nav className="navbar">
            <div className="nav-container">
                <button 
                    className={`nav-btn ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    <span className="nav-icon">📝</span>
                    <span className="nav-text">All Posts</span>
                </button>
                
                <button 
                    className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <span className="nav-icon">👤</span>
                    <span className="nav-text">Profile</span>
                </button>
            </div>
        </nav>
    )
}