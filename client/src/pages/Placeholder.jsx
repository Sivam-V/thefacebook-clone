import React from 'react';
import Header from '../components/Header';
import '../styles/global.css';

const Placeholder = ({ title }) => {
    return (
        <div className="page-container">
            <Header />
            <div className="main-wrapper" style={{ padding: '20px', textAlign: 'center' }}>
                <h2>{title}</h2>
                <p>This feature is coming soon to TheFacebook.</p>
                <button onClick={() => window.history.back()}>Go Back</button>
            </div>
            <div className="footer">
                <p>TheFacebook &copy; 2005</p>
            </div>
        </div>
    );
};

export default Placeholder;
