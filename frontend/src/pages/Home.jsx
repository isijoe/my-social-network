import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../useAuth';
import { Carousel, Card, Button, Container, Row, Col, Form } from 'react-bootstrap';
import Comment from './Comment';
import './Home.css';

const Home = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalCommentShow, setModalCommentShow] = useState(null);
  const API = process.env.REACT_APP_API || 'http://localhost/api/'

  const getData = useCallback(async () => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      const followingsResponse = await fetch(`${API}posts/api/followed/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      const followingData = await followingsResponse.json();
      setPosts(followingData);
    }
  }, [API, isLoggedIn]);

  useEffect(() => {
    if (!isLoading) {
      getData();
    }
  }, [isLoading, getData]);

  const handleLike = async (postId) => {
    const likeResponse = await fetch(`${API}posts/api/${postId}/like/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    });
    const likeData = await likeResponse.json()
    console.log(likeData)
  }

  const handleComment = async (post) => {
    setModalCommentShow(true);
    setSelectedPost(post);
  }

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      alert(e.target.value);
    }
  }

  function getTimeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  return (
    <div>
      <h1>Show recent posts uploaded by followings</h1>
      {(posts) && posts.map((post) =>
        <div style={{ width: '470px', margin: '0 auto' }} key={post.id}>
          <Card border="info" style={{ width: '470px', margin: '0 auto' }}>
            <Card.Header as="h3" className="header-card">
              <div>
                <img src={post.user} alt="" className="rounded-circle" style={{ width: '30px', height: '30px' }} />
                @{post.user}
              </div>
              {getTimeSince(new Date(post.created_at))}
            </Card.Header>
            <Card.Body>
              <Carousel>
                {post.post_imgs.map((image, index) =>
                  <Carousel.Item key={image.id || image.image}>
                    <img
                      className="thumbnail"
                      style={{ width: "470px", height: "470px" }}
                      src={image.image}
                      alt={image.alt}
                    />
                  </Carousel.Item>
                )}
              </Carousel>
              <Card.Title>{post.caption}</Card.Title>
            </Card.Body>
            <Card.Footer>
              <Container>
                <Row>
                  <Col>
                    <Button onClick={() => handleLike(post.id)} disabled={!isLoggedIn}>Like + {post.like_set.length}</Button>
                  </Col>
                  <Col>
                    <Button onClick={() => handleComment(post)} disabled={!isLoggedIn}>Comment + {post.comment_set.length}</Button>
                  </Col>
                </Row>
                <Row>
                  <Form.Control type="text" placeholder="Add a comment..." onKeyPress={handleKeyPress} />
                </Row>
              </Container>
            </Card.Footer>
          </Card>
        </div>
      )}
      {modalCommentShow && selectedPost && <Comment show={true} onHide={() => { setModalCommentShow(null); setSelectedPost(null); }} post={selectedPost} />}
    </div>
  );
};

export default Home;
