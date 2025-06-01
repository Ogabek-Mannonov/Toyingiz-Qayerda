import React, { useEffect, useState } from 'react';
import SidebarMenu from './SidebarMenu';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);

    const onStorageChange = () => {
      const newUsername = localStorage.getItem('username');
      setUsername(newUsername || '');
    };

    window.addEventListener('storage', onStorageChange);

    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className='header'>
      <div className="left-box">
        <SidebarMenu />
      </div>
      <div className="name-box">
        <h3>To'yingiz Qayerda ?</h3>
      </div>
      <div className="right-box">
        {username ? (
          <span style={{ color: 'black', fontWeight: '600' }}>Salom, {username}!</span>
        ) : (
          <button className='signin-btn' onClick={goToSignup}>Ro'yxatdan o'tish</button>
        )}
      </div>
    </div>
  );
}
