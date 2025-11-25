import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import '../styles/profile.css'; // Reuse profile styles for layout

const Photos = () => {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = id || (currentUser && currentUser._id);
                if (!userId) {
                    setLoading(false);
                    return;
                }
                const res = await axios.get(`/api/users/${userId}`);
                setProfileUser(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, currentUser]);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await axios.post(`/api/users/${profileUser._id}/photos`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfileUser(res.data);
            alert('Photo uploaded successfully!');
        } catch (err) {
            console.error(err);
            alert('Error uploading photo');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!profileUser) return <div>User not found</div>;

    const isOwnProfile = currentUser && currentUser._id === profileUser._id;

    return (
        <div className="page-container">
            <Header />
            <div className="main-wrapper">
                <div className="left-column">
                    <div className="profile-pic-container">
                        <div className="profile-pic">
                            {profileUser.profilePic ? (
                                <img src={`http://localhost:5001${profileUser.profilePic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                '?'
                            )}
                        </div>
                        <div className="profile-actions">
                            <p>View My:</p>
                            <ul>
                                <li><Link to={`/profile/${profileUser._id}`}>&raquo; Profile</Link></li>
                                {isOwnProfile && (
                                    <li><Link to="/profile/edit">&raquo; Edit Profile</Link></li>
                                )}
                                <li><Link to={`/profile/${profileUser._id}/photos`}>&raquo; Photos</Link></li>
                                <li><Link to="/friends">&raquo; Friends</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="right-column">
                    <div className="profile-header">
                        <h2>{profileUser.name}'s Photos</h2>
                    </div>

                    <div className="info-box">
                        <div className="info-box-header">Albums</div>
                        <div className="info-box-content">
                            <div style={{ padding: '10px' }}>
                                {isOwnProfile && (
                                    <div style={{ marginBottom: '20px', padding: '10px', background: '#f7f7f7', border: '1px solid #ccc' }}>
                                        <strong>Upload New Photo:</strong><br />
                                        <input type="file" onChange={handlePhotoUpload} />
                                    </div>
                                )}

                                <div className="photos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                    {profileUser.photos && profileUser.photos.length > 0 ? (
                                        profileUser.photos.map((photo, index) => (
                                            <div key={index} className="photo-item" style={{ border: '1px solid #ddd', padding: '5px' }}>
                                                <img
                                                    src={`http://localhost:5001${photo}`}
                                                    alt={`User photo ${index}`}
                                                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center', color: '#666' }}>
                                            No photos uploaded yet.
                                        </div>
                                    )}
                                </div>
                            </div>
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

export default Photos;
