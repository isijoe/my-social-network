import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../useAuth';
import { Carousel } from 'react-bootstrap';

const Home = () => {
  const { isLoggedIn, isLoading, loggedInUserId } = useAuth();
  const [posts, setPosts] = useState([]);
  const API = 'http://localhost:8000/posts/api/followed/';

  const getData = useCallback(async () => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      const followingsResponse = await fetch(API, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      const followingData = await followingsResponse.json();
      setPosts(followingData);
      // console.log(followingData);
    }
  }, [loggedInUserId, posts]);

  useEffect(() => {
    if (!isLoading) {
      getData();
    }
  }, [isLoading, getData]);

  return (
    <div>
      <h1>Show recent posts uploaded by followings</h1>
      {(posts) && posts.map((post) =>
        <div style={{ width: '470px', margin: '0 auto'}} key={post.id}>
          <Carousel>
            {post.post_imgs.map((image, index) =>
              <Carousel.Item key={index}>
                <img
                  className="thumbnail"
                  style={{ width: "470px", height: "470px" }}
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
            <h4 style={{ display: 'inline-block', float: 'right' }}><strong> new </strong></h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
