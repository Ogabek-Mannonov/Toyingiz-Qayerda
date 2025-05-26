import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Home() {

  const navigate = useNavigate(); 

  const goToSignup = () =>  {
    navigate('/signup')
  }

  return (
    <div className='home-container'>
      <div className="main">
        <div className="text-btn">
          <div className="text-home">
            <h2>Biz Bilan Baxtli Kuningizni O'tkazing !</h2>
          </div>
          <button className='second-btn' onClick={goToSignup}>Ro'yxatdan o'tish</button>
        </div>
      </div>
    </div>
  )
}
