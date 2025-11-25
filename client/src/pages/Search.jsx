import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import '../styles/search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`/api/users/search/${query}`);
            setResults(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="main-wrapper">
                <div className="search-container">
                    <div className="content-box">
                        <div className="content-box-header">Search</div>
                        <div className="content-box-content">
                            <form onSubmit={handleSearch}>
                                <table className="search-form-table">
                                    <tbody>
                                        <tr>
                                            <td>Name:</td>
                                            <td><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} /></td>
                                        </tr>
                                        <tr>
                                            <td>School:</td>
                                            <td><input type="text" defaultValue="Harvard University" /></td>
                                        </tr>
                                        <tr>
                                            <td>Year:</td>
                                            <td><input type="text" placeholder="e.g. 2006" /></td>
                                        </tr>
                                        <tr>
                                            <td>Course:</td>
                                            <td><input type="text" placeholder="e.g. CS50" /></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td><button type="submit" className="btn">Search</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                    </div>

                    {results.length > 0 && (
                        <div className="content-box">
                            <div className="content-box-header">Results</div>
                            <div className="content-box-content">
                                <ul className="results-list">
                                    {results.map(user => (
                                        <li key={user._id} className="result-item">
                                            <div className="result-pic">?</div>
                                            <div className="result-info">
                                                <h4><a href={`/profile/${user._id}`}>{user.name}</a></h4>
                                                <p>{user.status} at {user.profile?.school || 'Harvard'}</p>
                                            </div>
                                            <div className="result-action">
                                                <button
                                                    className="btn-addfriend"
                                                    onClick={async () => {
                                                        try {
                                                            await axios.post('/api/friends/request', { toUserId: user._id });
                                                            alert('Friend request sent!');
                                                        } catch (err) {
                                                            console.error(err);
                                                            alert(err.response?.data?.msg || 'Error sending request');
                                                        }
                                                    }}
                                                >
                                                    Add to Friends
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="footer">
                <p>TheFacebook &copy; 2005</p>
            </div>
        </div>
    );
};

export default Search;
