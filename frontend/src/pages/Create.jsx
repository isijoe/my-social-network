import React, { useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import './Create.css';


const Create = (props) => {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const API = 'http://localhost:8000/posts/api/';

  const createPost = async () => {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('caption', caption);
    images.forEach((image, index) => {
      formData.append(`post_imgs[${index}]image`, image);
    });

    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json(); // Get additional information from the server's response
      console.error('Problem beim Erstellen des Beitrags', errorData);
      throw new Error('Problem beim Erstellen des Beitrags');
    }

    // Clear the caption and images after post is created
    setCaption("");
    setImages([]);
  };

  const handleImageChange = (e) => {
    setImages([...images, ...e.target.files]);
  };

  return (
    <Modal
      {...props}
      dialogClassName="modal-90h"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
      <Modal.Header closeButton>
        <Modal.Title id="cotained-modal-title-vcenter">
          Create New Post
          </Modal.Title>
          </Modal.Header>
          <Modal.Body>
    <div>
      <input type="text" value={caption} onChange={e => setCaption(e.target.value)} />
          <br/>
      <input type="file" multiple onChange={handleImageChange} />
          <br/>
      <button onClick={createPost}>Create Post</button>
    </div>
    </Modal.Body>
    <Modal.Footer>
    <Button onClick={props.onHide}>Close</Button>
    </Modal.Footer>
    </Modal>
  );
};

export default Create;
