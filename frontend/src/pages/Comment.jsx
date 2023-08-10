import React from "react";
import { Modal, Carousel, Form, Button, Col, Container, Row } from 'react-bootstrap';

const Comment = (props) => {
  const API = process.env.REACT_APP_API || 'http://localhost/api/'

  const handleKeyPress = async (e) => {
    if (e.charCode === 13) {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('text', e.target.value);

      const response = await fetch(`${API}posts/api/${props.post.id}/comment/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Problem beim Erstellen eines Kommentars', errorData);
      } else {
        e.target.value = '';
      }
    }
  };

  return (
    <Modal
      {...props}
      centered
      fullscreen
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">
          Comment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <Container>
          <Row>
            <Col>
              <Carousel>
                {props.post.post_imgs.map((url, index) => (
                  <Carousel.Item key={index}>
                    <img className="d-block w-100" src={url.image} alt="First slide" />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
            <Col>
              <Row>
                <h2>@{props.post.user}</h2>
              </Row>
              <Row style={{ overflowY: 'auto', maxHeight: '200px' }}>
                {props.post.comment_set.map((comment) => (

                  <h6 key={comment.id}><b>{comment.user}</b> {comment.text}</h6>
                ))}
              </Row>
              <Row>
                <Form.Control type="text" placeholder="Add a comment..." onKeyPress={handleKeyPress} />
              </Row>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn" >Comment</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Comment;
