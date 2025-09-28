import React from 'react';
import './index.less';

const Profile: React.FC = () => {
  return (
    <div className='profile-page'>
      <h2>用户资料</h2>
      <div className='profile-content'>
        <p>这是用户资料页面，作为Home页面的子路由。</p>
        <div className='profile-info'>
          <div className='info-item'>
            <label>用户名:</label>
            <span>示例用户</span>
          </div>
          <div className='info-item'>
            <label>邮箱:</label>
            <span>user@example.com</span>
          </div>
          <div className='info-item'>
            <label>注册时间:</label>
            <span>2024-01-01</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
