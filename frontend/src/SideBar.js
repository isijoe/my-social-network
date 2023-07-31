import React from 'react';
import { Nav } from 'react-bootstrap';
import './SideBar.css';


const SideBar = () => {
    return (
        <Nav defaultActiveKey="/home"
            className="flex-column"
        >
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/explore">Explore</Nav.Link>
            <Nav.Link href="/messages">Messages</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
        </Nav>
    );
};

export default SideBar;
