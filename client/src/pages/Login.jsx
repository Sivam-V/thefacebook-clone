import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            alert('Login Failed');
        }
    };

    return (
        <div className="page-container">
            <div className="login-header">
                <div className="login-header-content">
                    <div className="header-graphic">
                        {/* Placeholder for logo */}
                    </div>
                    <div className="header-right">
                        <h1 className="login-logo-text">[ thefacebook ]</h1>
                        <div className="login-header-nav">
                            <Link to="/register">Register</Link>
                            <Link to="/about">About</Link>
                            <Link to="/contact">Contact</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-main-wrapper">
                <div className="login-sidebar">
                    <form onSubmit={handleSubmit}>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <div className="sidebar-buttons">
                            <button type="submit" className="btn">Login</button>
                            <Link to="/register" className="btn">Register</Link>
                        </div>
                    </form>
                </div>

                <div className="login-main-content">
                    <h2>Welcome to TheFacebook</h2>
                    <p>TheFacebook is an online directory that connects people through social networks at colleges.</p>
                    <p>We have opened up TheFacebook for popular consumption at <b>Harvard University</b>.</p>
                    <p>You can use TheFacebook to:</p>
                    <ul>
                        <li>Search for people at your school</li>
                        <li>Find out who is in your classes</li>
                        <li>Look up your friends' friends</li>
                        <li>See a visualization of your social network</li>
                    </ul>

                    <div className="content-buttons">
                        <Link to="/register" className="btn">Register</Link>
                        <Link to="/login" className="btn">Login</Link>
                    </div>
                </div>
            </div>

            <div className="login-footer">
                <p>
                    <Link to="/about">about</Link> |
                    <Link to="/contact">contact</Link> |
                    <Link to="/faq">faq</Link> |
                    <Link to="/terms">terms</Link> |
                    <Link to="/privacy">privacy</Link>
                </p>
                <p>a Mark Zuckerberg production</p>
                <p>TheFacebook &copy; 2005</p>
            </div>
        </div>
    );
};

export default Login;
