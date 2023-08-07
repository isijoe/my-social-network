import React, { useState } from "react";
import { Modal, Button, Form, Carousel } from 'react-bootstrap';
import './Create.css';


const Create = (props) => {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
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
    setPreviewUrls([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // setImages([...images, ...files]);
    setImages(prevImages => [...prevImages, ...files]);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prevUrls => [...prevUrls, ...urls]);
  };

  return (
    <Modal
      {...props}
      dialogClassName="modal-90h"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">
          Create New Post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <Form className="mb-3" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <label className="custom-file-upload" style={{ flex: '90%', display: 'block' }}>
            <input type="file" accept="images/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
            Upload photos and videos here...
          </label>
          {previewUrls.length > 0 && (
            <Carousel>
              {previewUrls.map((url, index) => (
                <Carousel.Item key={index}>
                  <img className="d-block w-100" src={url} alt="First slide" />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
          <Form.Control style={{ flex: '10%' }} type="text" placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn" onClick={createPost} disabled={images.length < 1}>Create Post</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Create;
