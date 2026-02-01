import './home.css';
import { Navbar } from './nav';
export function Home(){
    return (
        <>
        <Navbar></Navbar>
        <div className="container">

  {/* <!-- Create Post Section --> */}
  <div className="create-post">
    <input type="text" placeholder="What's on your mind?" />

    <div className="post-actions">
      <div className="icons">
        <span>📷</span>
      </div>
      <div className="right-actions">
        <button className="post-btn">➤ Post</button>
      </div>
    </div>
  </div>

  {/* <!-- Post Card --> */}
  <div className="post-card">
    <div className="post-header">
      <div className="user-info">
        <div className="avatar">👑</div>
        <div>
          <h3>Ranjeet Singh</h3>
          <p>@ranjeetsin • Fri Jan 30 2026 • 12:42 PM</p>
        </div>
      </div>
      <button className="follow-btn">Follow</button>
    </div>

    <h2 className="title">Earning History</h2>
    <p className="subtitle">You can do better this 💪</p>

    {/* <!-- Earnings List --> */}
    <div className="earnings">

      <div className="earning-item">
        <div className="left">
          <div className="icon">💰</div>
          <div>
            <p className="name">ranjeetsin</p>
            <span className="tag">daily-leaderboard</span>
          </div>
        </div>
        <div className="points green">+5000.00 Points</div>
      </div>

      <div className="earning-item">
        <div className="left">
          <div className="icon">💰</div>
          <div>
            <p className="name">ranjeetsin</p>
            <span className="tag">ad_reward_points</span>
          </div>
        </div>
        <div className="points green">+15.00 Points</div>
      </div>

      <div className="earning-item">
        <div className="left">
          <div className="icon">💰</div>
          <div>
            <p className="name">ranjeetsin</p>
            <span className="tag">daily_streak</span>
          </div>
        </div>
        <div className="points green">+100.00 Points</div>
      </div>

    </div>
  </div>

  {/* <!-- Floating Button --> */}
  <button className="float-btn">⬆</button>

</div>
        </>
    )
}