import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Carousel, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../useAuth';
import Create from './Create';


const Profile = () => {
  const { isLoggedIn, isLoading, loggedInUserId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  let { profileId } = useParams();
  const API = process.env.REACT_APP_API || 'http://localhost/api/'
  const [modalShow, setModalShow] = useState(false);


  const getData = useCallback(async () => {
    const profileResponse = await fetch(`${API}accounts/api/${profileId}/`);
    const profileData = await profileResponse.json();
    setProfile(profileData);
    if (isLoggedIn && profileId !== loggedInUserId) {
      const token = localStorage.getItem('token');
      const isFollowingResponse = await fetch(`${API}accounts/api/${profileId}/is_following/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      const isFollowingData = await isFollowingResponse.json();
      setIsFollowing(isFollowingData.isFollowing);
    }
  }, [loggedInUserId, profileId, API, isLoggedIn]);

  useEffect(() => {
    if (!isLoading) {
      getData();
    }
  }, [isLoading, getData]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const followUser = async (profileId) => {

    const token = localStorage.getItem('token');
    const response = await fetch(`${API}accounts/api/${profileId}/follow/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Problem beim Folgen des Benutzers');
    } else {
      isFollowing ? setIsFollowing(false) : setIsFollowing(true);
    }
  }

  const deletePost = async (postId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}posts/api/${postId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`
      },
    });
    if (!response.ok) {
      throw new Error('Problem beim Entfernen des Beitrags.');
    }
  }

  return (
    <Container className='mt-3'>
      {profile &&
        <>
          <Row md={3}>
            <Col>
              <img className="rounded-circle" style={{ width: "150px", height: "150px" }}
                src={profile.profile_picture ? profile.profile_picture : 'images/def_prof_pic.jpg'}
                alt=""
              />
            </Col>
            <Col>
              <h2>{profile.username}</h2>
              <p>Bio: <br />{profile.bio}</p>

              <h3>Follower: </h3>
              <p>{profile.followers}</p>
              {(isLoggedIn) && (loggedInUserId !== profileId) &&
                <Button onClick={() => followUser(profileId)}>{isFollowing ? 'Unfollow' : 'Follow'}</Button>
              }
              {(isLoggedIn) && (loggedInUserId === profileId) &&
                <div>
                  <h5><a href={`/profile_edit/${profile.id}`}>+ Edit Profile Information</a></h5>
                  <Button variant="primary" onClick={() => setModalShow(true)}>+ New Post</Button>
                  <Create show={modalShow} onHide={() => setModalShow(false)} />
                </div>
              }
              <br />
            </Col>
          </Row>
          <Row xs={9}>
            {profile.post_set.map((post) =>
              <Col lg={4} key={post.id}>
                <Card>
                  <Carousel>
                    {post.post_imgs.map((image, index) =>
                      <Carousel.Item key={image.id || image.image}>
                        <img
                          className="thumbnail"
                          style={{ width: "200px", height: "200px" }}
                          src={image.image}
                          alt={image.alt}
                        />
                      </Carousel.Item>
                    )}
                  </Carousel>
                  <Card.Body>
                    <Card.Text><strong>{post.caption.slice(0, 5)} from {new Date(post.created_at).toLocaleDateString()}</strong></Card.Text>
                    {(isLoggedIn) && (loggedInUserId === profileId) &&
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="danger" onClick={() => deletePost(post.id)}>Delete</Button>
                        {/* <Button variant="warning" href={`/post_edit/${post.id}`}>Edit</Button> */}
                        <Link to={`/post_edit/${post.id}`} className="btn btn-warning">Edit</Link>
                      </div>
                    }
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </>
      }
    </Container>
  );
};

export default Profile;
