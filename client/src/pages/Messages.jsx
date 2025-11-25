import React, { useState, useContext } from 'react';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import '../styles/messages.css';

const Messages = () => {
    const { user } = useContext(AuthContext);
    // Mock messages data
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Dustin Moskovitz', date: 'Yesterday', subject: 'hey did you finish the mockups?', read: false },
        { id: 2, sender: 'Eduardo Saverin', date: '2 days ago', subject: 'We need to discuss the advertising strategy...', read: false },
        { id: 3, sender: 'Chris Hughes', date: 'July 29', subject: 'Check out this article I found...', read: true },
        { id: 4, sender: 'Andrew McCollum', date: 'July 28', subject: 'Looks like the site is getting some traction!', read: true }
    ]);

    return (
        <div className="page-container">
            <Header />
            <div className="main-wrapper">
                <div className="messages-container">
                    <h2>{user ? user.name : 'User'}'s Messages</h2>

                    <div className="content-box">
                        <div className="content-box-header">Inbox</div>
                        <div className="content-box-content">
                            <table className="messages-table">
                                <tbody>
                                    {messages.map(msg => (
                                        <tr key={msg.id} className={msg.read ? 'msg-read' : 'msg-unread'}>
                                            <td className="msg-sender">
                                                <a href="#">{msg.sender}</a>
                                                <span className="msg-date"> ({msg.date})</span>
                                            </td>
                                            <td className="msg-subject">
                                                <a href="#">{msg.subject}</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="messages-footer">
                                <a href="#">Compose New Message</a>
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

export default Messages;
