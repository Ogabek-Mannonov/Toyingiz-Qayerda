import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';

export default function Header() {
  const navigate = useNavigate();

  // Boshlang‘ich qiymat localStorage dan olinadi
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    // localStorage o‘zgarganda chaqiriladigan funksiya
    const onStorageChange = () => {
      setUsername(localStorage.getItem('username') || '');
    };

    // window.storage eventini tinglash (boshqa tablarda localStorage o‘zgarganda)
    window.addEventListener('storage', onStorageChange);

    // maxsus event orqali shu tabda username o‘zgarganda ham yangilash
    window.addEventListener('usernameChange', onStorageChange);

    // cleanup - eventlarni olib tashlash
    return () => {
      window.removeEventListener('storage', onStorageChange);
      window.removeEventListener('usernameChange', onStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');

    // Shu tabda ham username yangilansin - maxsus event yuboriladi
    window.dispatchEvent(new Event('usernameChange'));

    navigate('/login'); // Logoutdan keyin login sahifaga yo'naltirish
  };

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
          <>
            <span style={{ color: 'black', fontWeight: '600' }}>Salom, {username}!</span>
            
          </>
        ) : (
          <button className='signin-btn' onClick={goToSignup}>Ro'yxatdan o'tish</button>
        )}
      </div>
    </div>
  );
}
