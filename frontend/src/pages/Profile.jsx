import React, { useState, useEffect, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router';
import { useAuth } from '../useAuth';
import Create from './Create';


const Profile = ({ }) => {
  const { isLoggedIn, isLoading, loggedInUserId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  let { profileId } = useParams();
  const API = 'http://localhost:8000/accounts/api/';
  const [modalShow, setModalShow] = useState(false);


  const getData = useCallback(async () => {
    const profileResponse = await fetch(API + profileId);
    const profileData = await profileResponse.json();
    setProfile(profileData);
    if (isLoggedIn && profileId != loggedInUserId) {
      const token = localStorage.getItem('token');
      const isFollowingResponse = await fetch(API + `${profileId}/is_following/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      const isFollowingData = await isFollowingResponse.json();
      setIsFollowing(isFollowingData.isFollowing);
    }
    // console.log(profileData)
  }, [loggedInUserId, profile]);

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
    const response = await fetch(API + `${profileId}/follow/`, {
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
    const response = await fetch(`http://localhost:8000/posts/api/${postId}/`, {
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
                alt={`${profile.username}'s profile picture`}
              />
            </Col>
            <Col>
              <h2>{profile.username}</h2>
              <p>Bio: <br />{profile.bio}</p>

              <h3>Follower: </h3>
              <p>{profile.followers}</p>
              {(isLoggedIn) && (loggedInUserId != profileId) &&
                <Button onClick={() => followUser(profileId)}>{isFollowing ? 'Unfollow' : 'Follow'}</Button>
              }
              {(isLoggedIn) && (loggedInUserId == profileId) &&
                <div>
                  <h5><a href={`/profile_edit/${profile.id}`}>+ Edit Profile Information</a></h5>
                  <h5><a href={`/create`}>+ New Post</a></h5>
                  <Button variant="primary" onClick={() => setModalShow(true)}>+ New Post</Button>
                  <Create show={modalShow} onHide={() => setModalShow(false)} />
                </div>
              }
              <br />
            </Col>
          </Row>
          <Row xs={9}>
            <div className="row">
              {profile.post_set.map((post) =>
                <div className="col-lg-4" key={post.id}>
                  <Carousel>
                    {post.post_imgs.map((image, index) =>
                      <Carousel.Item key={index}>
                        <img
                          className="thumbnail"
                          style={{ width: "200px", height: "200px" }}
                          src={image.image}
                          alt={image.alt}
                        // onClick={() => setSelectedImage(image.image)}
                        />
                      </Carousel.Item>
                    )}
                  </Carousel>
                  <div className="box-element">
                    <h6><strong>{post.caption.slice(0, 5)} from {new Date(post.created_at).toLocaleDateString()}</strong></h6>
                    <hr />
                    {(isLoggedIn) && (loggedInUserId == profileId) &&
                      <div>
                        <Button variant="danger" onClick={() => deletePost(post.id)}>Delete</Button>
                        <Button variant="warning" href={`/post_edit/${post.id}`}>Edit</Button>
                      </div>
                    }
                    <h4 style={{ display: 'inline-block', float: 'right' }}><strong> new </strong></h4>
                  </div>
                </div>
              )}
            </div>
          </Row>
        </>
      }
    </Container>
  );
};

export default Profile;
