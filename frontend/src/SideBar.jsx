import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import './SideBar.css';
import { useAuth } from './useAuth';
import logo from './logo_darkmode.png';


const SideBar = () => {
  const { isLoggedIn, loggedInUserId, loginUser, logoutUser, profilePicture } = useAuth();
  const profileUrl = `/profile/${loggedInUserId}`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    loginUser(email, password)
      .then(() => {
        console.log('Erfolgreich eingeloggt!');
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.error('Fehler beim Einloggen:', error);
        setPassword("");
      });
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  }

  return (

    <Container fluid>
      <Row style={{ height: '100vh' }}>
        <Col md={3}>

          <Nav defaultActiveKey="/home"
            className="flex-column"
          >
            <Link to={"/"}><img src={logo} className="App-logo" alt="logo" /></Link>
            <Link to={"/"}>Home</Link>
            <Link to={"/search"}>Search</Link>
            <Link to={"/explore"}>Explore</Link>
            <Link to={"/messages"}>Messages</Link>
            {isLoggedIn &&
              <Link to={profileUrl}>Profile</Link>
            }
          </Nav>
          {isLoggedIn ? (
            <div>
              <img className="rounded-circle" style={{ width: "30px", height: "30px" }}
                src={profilePicture ? profilePicture : 'images/def_prof_pic.jpg'}
                alt={`'s profile picture`}
              />
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <br></br>
              <button onClick={handleLogin}>Login</button>
            </div>
          )}
        </Col>
        <Col md={9} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'top' }}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default SideBar;
