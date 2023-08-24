import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../authProvider';
import { Button, Form } from 'react-bootstrap';
import './Login.css';

const Login = () => {
  const { loginUser, registerUser } = useAuth();
  const navigate = useNavigate();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistrationToggle = (e) => {
    if (registrationToggle) {
      setRegistrationToggle(false);
      e.target.innerText = "Register";
    } else {
      setRegistrationToggle(true);
      e.target.innerText = "Login";
    }
  }

  const submitLogin = (e) => {
    e.preventDefault();
    loginUser(email, password)
      .then(() => {
        console.log('Successfully logged in!');
        setEmail("");
        setPassword("");
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        setPassword("");
      });
  };

  const submitRegistration = (e) => {
    e.preventDefault();
    registerUser(username, email, password)
      .then(() => {
        console.log('Successfully registered!');
        setEmail("");
        setPassword("");
        setUsername("");
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error('Error registering:', error);
        setPassword("");
      });
  };

  return (
    <div className="center">
      {
        registrationToggle ? (
          <div className="center" >
            <Form onSubmit={e => submitRegistration(e)}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              <Button className="btn-nav" type="submit">
                Register
              </Button>
            </Form>
          </div>
        ) : (
          <div className="center">
            <Form onSubmit={e => submitLogin(e)}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              <Button className="btn-nav" type="submit">Login</Button>
            </Form>
          </div>
        )}
      <Button className="btn-nav" onClick={e => handleRegistrationToggle(e)}>Register</Button>
      <div className="center">
          <p style={{color: 'red', fontSize: '24px'}}>Test account:</p>
          <p>Email: public@email.com</p>
          <p>Password: dummy123</p>
      </div>
    </div>
  );
};

export default Login;
