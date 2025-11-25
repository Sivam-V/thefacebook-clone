import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import '../styles/global.css';

const EditProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        school: '',
        concentration: '',
        hometown: '',
        sex: '',
        birthday: '',
        about_me: '',
        interests: '',
        favorite_music: '',
        favorite_books: '',
        website: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.profile) {
            setFormData({
                school: user.profile.school || '',
                concentration: user.profile.concentration || '',
                hometown: user.profile.hometown || '',
                sex: user.profile.sex || '',
                birthday: user.profile.birthday ? new Date(user.profile.birthday).toISOString().split('T')[0] : '',
                about_me: user.profile.about_me || '',
                interests: user.profile.interests || '',
                favorite_music: user.profile.favorite_music || '',
                favorite_books: user.profile.favorite_books || '',
                website: user.profile.website || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`/api/users/${user._id}`, {
                profile: formData
            });
            setUser(res.data);
            navigate('/profile');
        } catch (err) {
            console.error(err);
            alert('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="main-wrapper">
                <div className="content-box">
                    <div className="content-box-header">Edit Profile</div>
                    <div className="content-box-content">
                        <form onSubmit={handleSubmit}>
                            <table className="edit-profile-table">
                                <tbody>
                                    <tr>
                                        <td className="label">School:</td>
                                        <td><input type="text" name="school" value={formData.school} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td className="label">Concentration:</td>
                                        <td><input type="text" name="concentration" value={formData.concentration} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td className="label">Hometown:</td>
                                        <td><input type="text" name="hometown" value={formData.hometown} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td className="label">Sex:</td>
                                        <td>
                                            <select name="sex" value={formData.sex} onChange={handleChange}>
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="label">Birthday:</td>
                                        <td><input type="date" name="birthday" value={formData.birthday} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td className="label">Website:</td>
                                        <td><input type="text" name="website" value={formData.website} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td className="label" colSpan="2">About Me:</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2"><textarea name="about_me" value={formData.about_me} onChange={handleChange} rows="4" style={{ width: '100%' }}></textarea></td>
                                    </tr>
                                    <tr>
                                        <td className="label" colSpan="2">Interests:</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2"><textarea name="interests" value={formData.interests} onChange={handleChange} rows="2" style={{ width: '100%' }}></textarea></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                            <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                                            <button type="button" className="btn" onClick={() => navigate('/profile')} style={{ marginLeft: '10px' }}>Cancel</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
            <div className="footer">
                <p>TheFacebook &copy; 2005</p>
            </div>
        </div>
    );
};

export default EditProfile;
