import React from 'react';
import { Nav } from 'react-bootstrap';
import './SideBar.css';
import { useAuth } from './useAuth';


const SideBar = () => {
  const { isLoggedIn, loggedInUserId } = useAuth();
  const profileUrl = `/profile/${loggedInUserId}`;
    return (
        <Nav defaultActiveKey="/home"
            className="flex-column"
        >
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/explore">Explore</Nav.Link>
            <Nav.Link href="/messages">Messages</Nav.Link>
            {isLoggedIn &&
            <Nav.Link href={profileUrl}>Profile</Nav.Link>
            }
        </Nav>
    );
};

export default SideBar;
