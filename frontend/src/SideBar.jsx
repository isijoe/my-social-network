import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col, Button } from 'react-bootstrap';
import Search from './pages/Search';
import './SideBar.css';
import { useAuth } from './useAuth';
import logo from './logo_darkmode.png';


const SideBar = () => {
  const { isLoggedIn, loggedInUserId, loginUser, logoutUser, profilePicture } = useAuth();
  const profileUrl = `/profile/${loggedInUserId}`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSearch, setShowSearch] = useState(false);
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

  const handleShowSearch = () => setShowSearch((s) => !s);


  const handleCloseSearch = () => setShowSearch(false);


  return (

    <Container fluid>
      <Row style={{ height: '100vh' }}>
        <Col md={3} className="border-right">

          <Navbar expand="lg" className="bg-body-teritary">
            <Nav defaultActiveKey="/home"
              className="flex-column"
            >
              <Link to={"/"}><img src={logo} className="App-logo" alt="logo" /></Link>
              <Button className="btn-nav"><Link to={"/"}>Home</Link></Button>
              <Button className="btn-nav" onClick={handleShowSearch}>Search</Button>
              <Button className="btn-nav"><Link to={"/explore"}>Explore</Link></Button>
              <Button className="btn-nav"><Link to={"/messages"}>Messages</Link></Button>
              {isLoggedIn &&
                <Button className="btn-nav"><Link to={profileUrl}>
                  <img className="rounded-circle" style={{ width: "30px", height: "30px" }}
                    src={profilePicture ? profilePicture : 'images/def_prof_pic.jpg'}
                    alt=""
                  />
                  Profile</Link></Button>
              }
            </Nav>
          </Navbar>
          {isLoggedIn ? (
            <div>
              <Button className="btn-nav" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <div>
              <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <br></br>
              <Button className="btn-nav" onClick={handleLogin}>Login</Button>
            </div>
          )}
          <Button className="btn-nav">More</Button>
        </Col>
        {showSearch &&
          <Col md={9}>
            <Search show={showSearch} onHide={handleCloseSearch} />
          </Col>}
        <Col md={9} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'top' }}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default SideBar;
