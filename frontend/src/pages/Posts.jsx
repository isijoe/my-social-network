import { useState } from 'react';
import Comment from './Comment';
import PostDetail from './PostDetail';
import Post from './Post';
import withModal from './Modal';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { getTimeSince } from '../utils';
import { like } from '../apiUtils';
import { useNavigate } from 'react-router';

const Posts = (props) => {
  const { show, posts, customStyle } = props;
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const handleLike = async (postId) => {
    const response = await like(postId);
    if (response.ok && props?.isHome) {
      // loadPosts();
      props?.isHome();
    }
  }

  const onItemClicked = (post) => {
    if (!post) {
      return;
    }
    setSelectedPost(post);
    show(true, { selectedPost: post, handleLike: handleLike, loadPosts: props?.isHome });
  };

  if (!posts || !posts.length) {
    return <></>
  }

  if (props.isHome) {
    return (
      <div className="feed-container">
        {posts.map((post) => (
          <div className="feed-container" key={post.id}>
            <Card border="info" className="feed-container">
              <Card.Header as="h3" className="header-card">
                <div className="post-detail__main-right">
                  <div className="post-detail__creator">
                    <div className="post-detail__post-creator" onClick={() => { navigate(`/profile/${post?.user.id}/`, { replace: true }); }}>
                      <img src={post?.user.profile_picture} alt={post?.user.username} className="rounded-circle" style={{ width: '30px', height: '30px' }} />
                      @{post?.user.username}
                    </div>
                    <div className="post-detail__dot-home"></div>
                    <span className="post-detail__time-since" onClick={() => onItemClicked(post)}>{getTimeSince(new Date(post?.created_at))}</span>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Post post={post} onItemClicked={onItemClicked} style={{ width: "470px", height: "470px" }} />
              </Card.Body>
              <Card.Footer>
                <Container>
                  <Row xs="auto">
                    <Col>
                      <div className="post-detail__reactions">
                        <svg onClick={() => handleLike(post?.id)} aria-label="Like" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                        <span className="post-detail__reactions-count">{post?.like_set.length}</span>
                      </div>
                    </Col>
                    <Col>
                      <div className="post-detail__reactions">
                        <svg onClick={() => onItemClicked(post)} aria-label="Comment" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" stroke="currentColor" sroke-linejoin="round" stroke-width="2"></path></svg>
                        <span className="post-detail__reactions-count">{post?.comment_set.length}</span>
                      </div>
                    </Col>
                    <Col>
                      <div className="post-detail__reactions">
                        <svg aria-label="Share Post" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path></svg>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Comment selectedPost={post} isHome={() => onItemClicked(post)} loadPosts={props?.isHome} />
                  </Row>
                </Container>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="posts" style={{ ...customStyle }}>
      {posts.map(post => <Post key={post.id} post={post} onItemClicked={onItemClicked} />)}
    </div>
  );
};

export default withModal(PostDetail)(Posts);
