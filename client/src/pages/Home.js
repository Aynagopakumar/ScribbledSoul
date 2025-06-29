import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="w-screen h-screen flex flex-col justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: `url('/scribbly.jpg')`,
        height:'100vh',
         backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
        
      }}
    >
      <div className="home-card">
       <p> A cozy space to express your thoughts, share your stories, and connect through writing.</p>
        <button onClick={() => navigate('/login')}>Get Started</button>
        <footer className="bg-white bg-opacity-70 text-center text-sm text-gray-700 py-8">
        © 2025 Scribbly. All rights reserved.
      </footer>
      </div>
    </div>
  );
};

export default Home;
