import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">PrecisionTech</Link>
      
      <div className="nav-links">
        <NavLink to="/category/smartphones">Smartphones</NavLink>
        <NavLink to="/category/laptops">Laptops</NavLink>
        <NavLink to="/category/wearables">Wearables</NavLink>
        <NavLink to="/category/audio">Audio</NavLink>
        <NavLink to="/category/accessories">Accessories</NavLink>
        <NavLink to="/deals" style={{color: '#9a3412', fontWeight: 700}}>Deals</NavLink>
      </div>

      <div className="nav-icons" style={{display:'flex', alignItems:'center', gap:'1rem'}}>
        <Link to="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>🛒</Link>
        
        {user ? (
           <>
              <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none', marginLeft:'0.5rem' }}>👤 {user.name.split(' ')[0]}</Link>
              <button 
                 onClick={handleLogout} 
                 style={{background:'none', border:'none', color:'#dc2626', cursor:'pointer', fontWeight:700, marginLeft:'0.5rem'}}>
                 Log Out
              </button>
           </>
        ) : (
           <Link to="/auth" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600, marginLeft:'0.5rem' }}>Login / Register &rarr;</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
