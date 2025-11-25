import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import '../styles/friends.css';

const Friends = () => {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewedUser, setViewedUser] = useState(null);

    const fetchData = async () => {
        if (!currentUser) return;
        try {
            const targetId = id || currentUser._id;
            const res = await axios.get(`/api/users/${targetId}`);
            setFriends(res.data.friends || []);
            // Only show requests if viewing own profile
            if (!id || id === currentUser._id) {
                setRequests(res.data.incomingRequests || []);
            } else {
                setRequests([]);
            }
            setViewedUser(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentUser, id]);

    const handleAccept = async (id) => {
        try {
            await axios.post('/api/friends/accept', { fromUserId: id });
            fetchData(); // Refresh data
        } catch (err) {
            console.error(err);
            alert('Error accepting request');
        }
    };

    const handleDecline = async (id) => {
        try {
            await axios.post('/api/friends/decline', { fromUserId: id });
            fetchData(); // Refresh data
        } catch (err) {
            console.error(err);
            alert('Error declining request');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <Header />
            <div className="main-wrapper">
                <div className="friends-container">
                    <h2>{viewedUser ? (id && id !== currentUser._id ? `${viewedUser.name}'s Friends` : 'My Friends') : 'Friends'}</h2>

                    <div className="filter-bar">
                        <div className="alpha-filter">
                            <a href="#">A</a> | <a href="#">B</a> | <a href="#">C</a> | <a href="#">D</a> | <a href="#">E</a> | <a href="#">F</a> | <a href="#">G</a> | <a href="#">H</a> | <a href="#">I</a> | <a href="#">J</a> | <a href="#">K</a> | <a href="#">L</a> | <a href="#">M</a> | <a href="#">N</a> | <a href="#">O</a> | <a href="#">P</a> | <a href="#">Q</a> | <a href="#">R</a> | <a href="#">S</a> | <a href="#">T</a> | <a href="#">U</a> | <a href="#">V</a> | <a href="#">W</a> | <a href="#">X</a> | <a href="#">Y</a> | <a href="#">Z</a>
                        </div>
                        <div className="friend-search">
                            <label>Filter Friends:</label>
                            <input type="text" />
                        </div>
                    </div>

                    {requests.length > 0 && (
                        <div className="content-box" style={{ marginBottom: '20px', borderColor: '#3b5998' }}>
                            <div className="content-box-header" style={{ background: '#d8dfea', color: '#3b5998' }}>Friend Requests ({requests.length})</div>
                            <div className="content-box-content">
                                <ul className="friends-list">
                                    {requests.map(req => (
                                        <li key={req._id} className="friend-item" style={{ background: '#fff9d7' }}>
                                            <div className="friend-pic">
                                                {req.profilePic ? <img src={`http://localhost:5001${req.profilePic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '?'}
                                            </div>
                                            <div className="friend-info">
                                                <h4><Link to={`/profile/${req._id}`}>{req.name}</Link></h4>
                                                <p>{req.status} at {req.profile?.school || 'Harvard'}</p>
                                            </div>
                                            <div className="friend-actions">
                                                <button className="btn-action" onClick={() => handleAccept(req._id)}>Confirm</button>
                                                <button className="btn-action" onClick={() => handleDecline(req._id)} style={{ marginLeft: '5px', background: '#f0f0f0', color: '#333', border: '1px solid #ccc' }}>Reject</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="content-box">
                        <div className="content-box-header">All Friends ({friends.length})</div>
                        <div className="content-box-content">
                            {friends.length === 0 ? (
                                <div style={{ padding: '10px' }}>You have no friends yet.</div>
                            ) : (
                                <ul className="friends-list">
                                    {friends.map(friend => (
                                        <li key={friend._id} className="friend-item">
                                            <div className="friend-pic">
                                                {friend.profilePic ? <img src={`http://localhost:5001${friend.profilePic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '?'}
                                            </div>
                                            <div className="friend-info">
                                                <h4><Link to={`/profile/${friend._id}`}>{friend.name}</Link></h4>
                                                <p>{friend.status} at {friend.profile?.school || 'Harvard'}</p>
                                            </div>
                                            <div className="friend-actions">
                                                <a href="#">Send Message</a> | <a href="#">Poke</a>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <p>TheFacebook &copy; 2005</p>
            </div>
        </div>
    );
};

export default Friends;
