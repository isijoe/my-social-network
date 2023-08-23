import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Carousel, Button, Card, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../authProvider';
import { fetchWithToken } from '../apiUtils';
import Create from './Create';
import EditProfile from './EditProfile';
import './Profile.css';

const Profile = () => {
  const { isLoggedIn, isLoading, loggedInUserId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  let { profileId } = useParams();
  const API = process.env.REACT_APP_API || 'http://localhost/api/'
  const [modalShow, setModalShow] = useState(false);
  const [modalShowEditProfile, setModalShowEditProfile] = useState(false);


  const getData = useCallback(async () => {
    const profileResponse = await fetch(`${API}accounts/api/${profileId}/`);
    const profileData = await profileResponse.json();
    setProfile(profileData);
    if (isLoggedIn && profileId !== loggedInUserId) {
      const isFollowingResponse = await fetchWithToken(`${API}accounts/api/${profileId}/is_following/`);
      const isFollowingData = await isFollowingResponse.json();
      setIsFollowing(isFollowingData.isFollowing);
    }
  }, [loggedInUserId, profileId, API, isLoggedIn]);

  useEffect(() => {
    if (!isLoading) {
      getData();
    }
  }, [isLoading, getData, isFollowing]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const followUser = async (profileId) => {
    try {
      const response = await fetchWithToken(`${API}accounts/api/${profileId}/follow/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        console.error("Error following user.");
      } else {
        isFollowing ? setIsFollowing(false) : setIsFollowing(true);
        getData();
      }
    } catch (error) {
      console.error("Follow error:", error);
    }
  }

  const deletePost = async (postId) => {
    try {
      const response = await fetchWithToken(`${API}posts/api/${postId}/`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        console.error("Error deleting post.");
      }
    } catch (error) {
      console.error("Post delete error:", error);
    }
  }

  return (
    <Container className='mt-3'>
      <Row md={3}>
        <Col>
          <Image roundedCircle style={{ width: "150px", height: "150px" }}
            src={profile.profile_picture ? profile.profile_picture : 'images/def_prof_pic.jpg'}
            alt=""
          />
        </Col>
        <Col>
          <div className="profile-container" >
            <h2>{profile.username}</h2>
            {(isLoggedIn) && (loggedInUserId === profileId) &&
              <div>
                <Button variant="primary" onClick={() => setModalShowEditProfile(true)}>+ Edit Profile</Button>
                <EditProfile show={modalShowEditProfile} onHide={() => { setModalShowEditProfile(false); getData(); }} profile={profile} />
              </div>
            }
          </div>
          <p><br />{profile.bio}</p>

          <h3>Follower: </h3>
          <p>{profile.followers}</p>
          {(isLoggedIn) && (loggedInUserId !== profileId) &&
            <Button onClick={() => followUser(profileId)}>{isFollowing ? 'Unfollow' : 'Follow'}</Button>
          }
          {(isLoggedIn) && (loggedInUserId === profileId) &&
            <div>
              <Button variant="primary" onClick={() => setModalShow(true)}>+ New Post</Button>
              <Create show={modalShow} onHide={() => setModalShow(false)} />
            </div>
          }
          <br />
        </Col>
      </Row>
      <br />
      <Row xs={9}>
        {profile.post_set.map((post) =>
          <Col lg={4} key={post.id}>
            <Card className="posts-container">
              <Carousel controls={post.post_imgs.length > 1}>
                {post.post_imgs.map((image, index) =>
                  <Carousel.Item key={image.id || image.image}>
                    <Image
                      style={{ width: "200px", height: "200px" }}
                      src={image.image}
                      alt={image.alt}
                      thumbnail
                    />
                  </Carousel.Item>
                )}
              </Carousel>
              <Card.Body>
                <Card.Text><strong>{post.caption.slice(0, 5)} from {new Date(post.created_at).toLocaleDateString()}</strong></Card.Text>
                {(isLoggedIn) && (loggedInUserId === profileId) &&
                  <div className="profile-container">
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
    </Container>
  );
};

export default Profile;
