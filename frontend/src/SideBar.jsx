import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col, Button } from 'react-bootstrap';
import './SideBar.css';
import logo from './logo_darkmode.png';
import { useAuth } from './authProvider';
import { Create, Search } from './pages';
import withModal from './pages/Modal';

const SideBar = (props) => {
  const { loggedInUserId, logoutUser, profilePicture, setToken } = useAuth();
  const { show } = props;
  const profileUrl = `/profile/${loggedInUserId}`;
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setToken();
    navigate("/", { replace: true });
  };

  const handleShowSearch = () => setShowSearch((s) => !s);

  const handleCloseSearch = () => setShowSearch(false);

  return (
    <Container fluid>
      <Row style={{ height: '100vh' }}>
        <Col md="auto" className="border-right">
          <Navbar expand="lg" className="bg-body-teritary">
            <Nav defaultActiveKey="/home"
              className="flex-column"
            >
              <Link to={"/"}><img src={logo} className="App-logo" alt="logo" /></Link>
              <Button className="btn-nav"><Link to={"/"}>Home</Link></Button>
              <Button className="btn-nav" onClick={handleShowSearch}>Search</Button>
              <Button className="btn-nav"><Link to={"/explore"}>Explore</Link></Button>
              <Button className="btn-nav"><Link to={"/messages"}>Messages</Link></Button>
              <Button className="btn-nav" onClick={show}>Create</Button>
              <Button className="btn-nav"><Link to={profileUrl}>
                <img className="rounded-circle" style={{ width: "30px", height: "30px" }}
                  src={profilePicture ? profilePicture : 'images/def_prof_pic.jpg'}
                  alt=""
                />
                Profile</Link></Button>
            </Nav>
          </Navbar>
          <div>
            <Button className="btn-nav" onClick={handleLogout}>Logout</Button>
          </div>
          {/* <Button className="btn-nav justify-content-end">More</Button> */}
        </Col>
        {showSearch &&
          <Col md="auto">
            <Search show={showSearch} onHide={handleCloseSearch} />
          </Col>}
        <Col md={9} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'top' }}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default withModal(Create)(SideBar);
