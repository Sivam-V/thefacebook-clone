import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/login.css'; // Reusing login styles for consistency

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        status: 'Student'
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(formData.name, formData.email, formData.password, formData.status);
        if (success) {
            navigate('/');
        } else {
            alert('Registration Failed');
        }
    };

    return (
        <div className="page-container">
            <div className="login-header">
                <div className="login-header-content">
                    <div className="header-right" style={{ width: '100%' }}>
                        <h1 className="login-logo-text">[ thefacebook ]</h1>
                    </div>
                </div>
            </div>

            <div className="login-main-wrapper">
                <div className="login-main-content" style={{ borderLeft: 'none', paddingLeft: 0 }}>
                    <h2>Registration</h2>
                    <p>To register for TheFacebook, please fill out the form below.</p>

                    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block' }}>Full Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', border: '1px solid #000' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block' }}>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', border: '1px solid #000' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block' }}>Password:</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', border: '1px solid #000' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block' }}>Status:</label>
                            <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', border: '1px solid #000' }}>
                                <option value="Student">Student</option>
                                <option value="Alum">Alum</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Staff">Staff</option>
                            </select>
                        </div>

                        <button type="submit" className="btn" style={{ marginTop: '10px' }}>Register Now!</button>
                    </form>
                </div>
            </div>

            <div className="login-footer">
                <p>TheFacebook &copy; 2005</p>
            </div>
        </div>
    );
};

export default Register;
