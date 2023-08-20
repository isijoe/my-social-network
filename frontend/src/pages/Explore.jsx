import React, { useState, useEffect } from "react";
import { Carousel, Card, Container, Row, Col } from "react-bootstrap";

const Explore = () => {
  const API = process.env.REACT_APP_API || 'http://localhost/api/';
  const [posts, setPosts] = useState([]);


  const getData = async () => {
    const postsResponse = await fetch(`${API}posts/api/`);
    const postsData = await postsResponse.json();
    setPosts(postsData);
  }

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Container>
      {Array.from({ length: Math.ceil(posts.length / 3) }).map((_, rowIndex) => (
        <Row key={rowIndex}>
          {posts.slice(rowIndex * 3, rowIndex * 3 + 3).map(post => (
            <Col lg={4} key={post.id}>
              <Card>
                <Carousel>
                  {post.post_imgs.map((image, index) => (
                    <Carousel.Item key={image.id || image.image}>
                      <img
                        className="thumbnail"
                        style={{ width: "200px", height: "200px" }}
                        src={image.image}
                        alt={image.alt}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
                <Card.Body>
                  <Card.Text><strong>{post.caption.slice(0, 5)} from {new Date(post.created_at).toLocaleDateString()}</strong></Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};

export default Explore;
