import React from 'react'
import SidebarMenu from './SidebarMenu'
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate(); 

  const goToSignup = () =>  {
    navigate('/signup')
  }

  return (
    <div className='header'>
      <div className="left-box">
        <SidebarMenu /> 
      </div>
      <div className="name-box">
        <h3>To'yingiz Qayerda ?</h3>
      </div>
      <div className="right-box">
        <button className='signin-btn' onClick={goToSignup}>Ro'yxatdan o'tish</button>
      </div>
    </div>
  )
}
