import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import '../styles/global.css';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="page-container">
            <Header />
            <div className="main-wrapper">
                <div className="main-content">
                    <div className="content-header">
                        <h3>Welcome Back, {user ? user.name : 'User'}!</h3>
                    </div>

                    <div className="update-feed">
                        <li>
                            <p>There are no new updates at this time.</p>
                            <span className="timestamp"></span>
                        </li>
                        {/* Placeholder for feed items */}
                    </div>
                </div>

                <div className="right-sidebar">
                    <div className="sidebar-box">
                        <div className="sidebar-box-header">Requests</div>
                        <div className="sidebar-box-content">
                            <p><a href="#">1 Friend Request</a></p>
                            <p><a href="#">2 Group Invites</a></p>
                        </div>
                    </div>

                    <div className="sidebar-box">
                        <div className="sidebar-box-header">Sponsored</div>
                        <div className="sidebar-box-content">
                            <p className="sponsored-link"><a href="#">Need a summer internship?</a></p>
                            <p className="sponsored-text">Check out the listings from top tech companies.</p>
                        </div>
                    </div>

                    <div className="sidebar-box">
                        <div className="sidebar-box-header">Today's Birthdays</div>
                        <div className="sidebar-box-content">
                            <p><a href="#">Adam D'Angelo</a></p>
                            <p><a href="#">Reid Hoffman</a></p>
                            <p><a href="#">(Send a gift)</a></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer">
                <p>
                    <Link to="/about">about</Link> |
                    <Link to="/contact">contact</Link> |
                    <Link to="/jobs">jobs</Link> |
                    <Link to="/terms">terms</Link> |
                    <Link to="/privacy">privacy</Link>
                </p>
                <p>a Mark Zuckerberg production</p>
                <p>TheFacebook &copy; 2005</p>
            </div>
        </div>
    );
};

export default Home;
