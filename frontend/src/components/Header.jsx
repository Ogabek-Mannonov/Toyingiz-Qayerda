import React from 'react'
import SidebarMenu from './SidebarMenu'

export default function Header() {
  return (
    <div className='header'>
      <div className="left-box">
        <SidebarMenu /> 
      </div>
      <div className="name-box">
        <h3>To'yingiz Qayerda ?</h3>
      </div>
      <div className="right-box">
        <button className='signin-btn'>Ro'yxatdan o'tish</button>
      </div>
    </div>
  )
}
