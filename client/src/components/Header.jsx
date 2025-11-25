import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/global.css';

const Header = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="header">
            <div className="header-content">
                <div className="header-left">
                    <h1 className="logo-text">[ thefacebook ]</h1>
                </div>
                <div className="header-nav">
                    <Link to="/" style={{ textDecoration: isActive('/') ? 'underline' : 'none' }}>home</Link>
                    <Link to="/search" style={{ textDecoration: isActive('/search') ? 'underline' : 'none' }}>search</Link>
                    <Link to="/friends" style={{ textDecoration: isActive('/friends') ? 'underline' : 'none' }}>friends</Link>
                    <Link to="/messages" style={{ textDecoration: isActive('/messages') ? 'underline' : 'none' }}>messages</Link>
                    <Link to="/profile" style={{ textDecoration: isActive('/profile') ? 'underline' : 'none' }}>profile</Link>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginLeft: '10px', fontSize: '11px', fontFamily: 'Verdana, Geneva, sans-serif' }}>logout</button>
                </div>
            </div>
        </div>
    );
};

export default Header;
