import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './SideBar';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home, Profile, Search, Explore, Messages } from './pages'
import { useAuth } from './useAuth';


function App() {
  const { isLoggedIn, loginUser, logoutUser, profilePicture } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/profile/:profileId",
      element: <Profile />
    },
    {
      path: "/search",
      element: <Search />,
    },
    {
      path: "/explore",
      element: <Explore />,
    },
    {
      path: "/messages",
      element: <Messages />,
    },
  ]);

  return (
    <Container fluid>
      <Row style={{ height: '100vh' }}>
        <Col md={3}>
          <SideBar />
          {isLoggedIn ? (
            <div>
              <img className="rounded-circle" style={{ width: "30px", height: "30px" }}
                src={profilePicture ? profilePicture : 'images/def_prof_pic.jpg'}
                alt={`'s profile picture`}
              />
              <button onClick={logoutUser}>Logout</button>
            </div>
          ) : (
            <div>
              <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <button onClick={handleLogin}>Login</button>
            </div>
          )}
        </Col>
        <Col md={9} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <RouterProvider router={router} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
