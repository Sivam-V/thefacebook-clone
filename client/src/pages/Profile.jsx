import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import '../styles/profile.css';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = id || (currentUser && currentUser._id); // Fallback to current user if no ID

                if (!userId) {
                    setLoading(false);
                    return;
                }

                // In a real app, use the ID. For now, we might just show current user if ID matches or is missing
                const res = await axios.get(`/api/users/${userId}`);
                setProfileUser(res.data);

                // Fetch posts
                try {
                    const postsRes = await axios.get(`/api/posts/user/${userId}`);
                    setPosts(postsRes.data);
                } catch (err) {
                    console.error("Error fetching posts:", err);
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, currentUser]);

    const handlePostSubmit = async () => {
        if (!newPostText.trim()) return;
        try {
            const res = await axios.post('/api/posts', {
                targetProfileId: profileUser._id,
                text: newPostText
            });
            setPosts([res.data, ...posts]);
            setNewPostText('');
        } catch (err) {
            console.error(err);
            alert('Error creating post');
        }
    };

    const handleFriendAction = async (action, targetId) => {
        try {
            if (action === 'add') {
                await axios.post('/api/friends/request', { toUserId: targetId });
            } else if (action === 'cancel') {
                await axios.post('/api/friends/cancel', { toUserId: targetId });
            } else if (action === 'accept') {
                await axios.post('/api/friends/accept', { fromUserId: targetId });
            } else if (action === 'remove') {
                await axios.post('/api/friends/remove', { userId: targetId });
            }
            // Refresh profile data
            const res = await axios.get(`/api/users/${profileUser._id}`);
            setProfileUser(res.data);

            // Also refresh current user context to update own lists
            // This is a bit hacky, ideally we have a better way to refresh context
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('Error performing action');
        }
    };

    const renderFriendActions = () => {
        if (!currentUser || !profileUser || currentUser._id === profileUser._id) return null;

        const isFriend = currentUser.friends.includes(profileUser._id);
        const hasSentRequest = currentUser.outgoingRequests.includes(profileUser._id);
        const hasReceivedRequest = currentUser.incomingRequests.includes(profileUser._id);

        if (isFriend) {
            return (
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleFriendAction('remove', profileUser._id); }}>&raquo; Remove Friend</a></li>
            );
        } else if (hasSentRequest) {
            return (
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleFriendAction('cancel', profileUser._id); }}>&raquo; Cancel Request</a></li>
            );
        } else if (hasReceivedRequest) {
            return (
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleFriendAction('accept', profileUser._id); }}>&raquo; Accept Request</a></li>
            );
        } else {
            return (
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleFriendAction('add', profileUser._id); }}>&raquo; Add to Friends</a></li>
            );
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!profileUser) return <div>User not found</div>;

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
                        {currentUser && currentUser._id === profileUser._id && (
                            <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                <input
                                    type="file"
                                    id="profilePicInput"
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        const formData = new FormData();
                                        formData.append('profilePic', file);
                                        try {
                                            const res = await axios.post(`/api/users/${currentUser._id}/profile-pic`, formData, {
                                                headers: { 'Content-Type': 'multipart/form-data' }
                                            });
                                            setProfileUser(res.data);
                                            window.location.reload();
                                        } catch (err) {
                                            console.error(err);
                                            alert('Error uploading image');
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => document.getElementById('profilePicInput').click()}
                                    style={{ fontSize: '10px', cursor: 'pointer' }}
                                >
                                    Upload Picture
                                </button>
                            </div>
                        )}
                        <div className="profile-actions">
                            <p>View My:</p>
                            <ul>
                                <li><a href="#">&raquo; Profile</a></li>
                                {currentUser && currentUser._id === profileUser._id && (
                                    <li><a href="/profile/edit">&raquo; Edit Profile</a></li>
                                )}
                                <li><a href={`/profile/${profileUser._id}/photos`}>&raquo; Photos</a></li>
                                <li><a href={`/profile/${profileUser._id}/friends`}>&raquo; Friends</a></li>
                                <li><a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    const handlePoke = async () => {
                                        try {
                                            await axios.post(`/api/users/${profileUser._id}/poke`, { fromUserId: currentUser._id });
                                            alert(`You poked ${profileUser.name}!`);
                                        } catch (err) {
                                            console.error(err);
                                            alert('Error sending poke');
                                        }
                                    };
                                    handlePoke();
                                }}>&raquo; Poke Him!</a></li>
                                {renderFriendActions()}
                            </ul>
                        </div>
                    </div>

                    <div className="info-box">
                        <div className="info-box-header">Information</div>
                        <div className="info-box-content">
                            <div className="info-section">
                                <div className="info-label">Member Since:</div>
                                <div className="info-value">{new Date(profileUser.profile?.joined_at || Date.now()).toLocaleDateString()}</div>
                            </div>
                            <div className="info-section">
                                <div className="info-label">Last Update:</div>
                                <div className="info-value">{new Date().toLocaleDateString()}</div>
                            </div>
                            <div className="info-section">
                                <div className="info-label">Profile Views:</div>
                                <div className="info-value">68</div>
                            </div>

                            <hr />

                            <div className="info-subheader">Basic Information</div>
                            <div className="info-section">
                                <div className="info-label">Sex:</div>
                                <div className="info-value">{profileUser.profile?.sex || '-'}</div>
                            </div>
                            <div className="info-section">
                                <div className="info-label">Birthday:</div>
                                <div className="info-value">{profileUser.profile?.birthday ? new Date(profileUser.profile.birthday).toLocaleDateString() : '-'}</div>
                            </div>
                            <div className="info-section">
                                <div className="info-label">Hometown:</div>
                                <div className="info-value">{profileUser.profile?.hometown || '-'}</div>
                            </div>

                            <hr />

                            <div className="info-subheader">Contact Information</div>
                            <div className="info-section">
                                <div className="info-label">Email:</div>
                                <div className="info-value">{profileUser.email}</div>
                            </div>
                            <div className="info-section">
                                <div className="info-label">Website:</div>
                                <div className="info-value"><a href={profileUser.profile?.website} target="_blank" rel="noopener noreferrer">{profileUser.profile?.website}</a></div>
                            </div>
                            <div className="info-section">
                                <div className="info-label">Screenname:</div>
                                <div className="info-value">{profileUser.name.split(' ')[0].toLowerCase()}123</div>
                            </div>

                            <hr />

                            <div className="info-subheader">Personal Info</div>
                            <div className="info-section">
                                <div className="info-label">About Me:</div>
                                <div className="info-value">{profileUser.profile?.about_me || '-'}</div>
                            </div>
                            <div className="info-section">
                                <div className="info-label">Interests:</div>
                                <div className="info-value">{profileUser.profile?.interests || '-'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-column">
                    <div className="profile-header">
                        <h2>{profileUser.name}'s Profile</h2>
                    </div>

                    {currentUser && currentUser._id === profileUser._id && profileUser.pokes && profileUser.pokes.length > 0 && (
                        <div className="info-box">
                            <div className="info-box-header">[ Pokes ]</div>
                            <div className="info-box-content">
                                {profileUser.pokes.map((poke, index) => (
                                    <div key={index} style={{ marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                                        {poke.from ? (
                                            <>
                                                <a href={`/profile/${poke.from._id}`} style={{ fontWeight: 'bold' }}>{poke.from.name}</a> poked you!
                                                <div style={{ fontSize: '10px', color: '#999' }}>
                                                    {new Date(poke.at).toLocaleDateString()}
                                                </div>
                                                <div style={{ marginTop: '2px' }}>
                                                    <a href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        const handlePokeBack = async () => {
                                                            try {
                                                                await axios.post(`/api/users/${poke.from._id}/poke`, { fromUserId: currentUser._id });
                                                                alert(`You poked ${poke.from.name} back!`);
                                                            } catch (err) {
                                                                console.error(err);
                                                                alert('Error sending poke');
                                                            }
                                                        };
                                                        handlePokeBack();
                                                    }} style={{ fontSize: '11px' }}>&raquo; Poke Back</a>
                                                </div>
                                            </>
                                        ) : (
                                            <span>Someone poked you (User deleted)</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="info-box">
                        <div className="info-box-header">[ My Friends ]</div>
                        <div className="info-box-content">
                            <div className="friends-grid">
                                {profileUser.friends && profileUser.friends.length > 0 ? (
                                    profileUser.friends.slice(0, 8).map((friend) => (
                                        <div key={friend._id} className="friend-grid-item">
                                            <a href={`/profile/${friend._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {friend.profilePic ? (
                                                    <img
                                                        src={`http://localhost:5001${friend.profilePic}`}
                                                        alt={friend.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' }}>
                                                        ?
                                                    </div>
                                                )}
                                                <div style={{ fontSize: '9px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {friend.name}
                                                </div>
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    Array(8).fill(null).map((_, i) => (
                                        <div key={i} className="friend-grid-item">?</div>
                                    ))
                                )}
                            </div>
                            <div className="friends-footer">
                                Total Friends: {profileUser.friends ? profileUser.friends.length : 0}
                            </div>
                        </div>
                    </div>

                    <div className="info-box">
                        <div className="info-box-header">[ The Wall ]</div>
                        <div className="info-box-content wall-content">
                            <textarea
                                placeholder={`Write on ${profileUser.name.split(' ')[0]}'s wall...`}
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                            ></textarea>
                            <div style={{ marginTop: '5px' }}>
                                <button className="btn-post" onClick={handlePostSubmit}>Post</button>
                            </div>
                            {posts.map(post => (
                                <div key={post._id} className="wall-post">
                                    <div className="post-header">
                                        <strong><a href={`/profile/${post.author._id}`}>{post.author.name}</a></strong> wrote:
                                    </div>
                                    <div className="post-body">
                                        {post.text}
                                        <div className="post-meta">({new Date(post.createdAt).toLocaleDateString()})</div>
                                    </div>
                                </div>
                            ))}
                            {posts.length === 0 && <div style={{ padding: '10px', color: '#888' }}>No posts yet.</div>}
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

export default Profile;
