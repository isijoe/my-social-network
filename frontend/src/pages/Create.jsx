import React, { useState, useRef } from "react";
import { Form, Carousel } from 'react-bootstrap';
import { fetchWithToken } from "../apiUtils";

const Create = (props) => {
  const API = process.env.REACT_APP_API || 'http://localhost/api/';
  const { onHide } = props;
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const filepickerRef = useRef(null);

  const createPost = async () => {
    if (images.length < 1) {
      alert("Please upload at least one post image!");
      return false;
    }
    const formData = new FormData();
    formData.append('caption', caption);
    images.forEach((image, index) => {
      formData.append(`post_imgs[${index}]image`, image);
    });

    const response = await fetchWithToken(`${API}posts/api/`, {
      credentials: 'include',
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.log(localStorage.getItem('token'));
      const errorData = await response.json();
      console.error("Error creating post.", errorData);
    }

    alert("Post uploaded successfully.");
    // Clear the caption and images after post is created
    setCaption("");
    setImages([]);
    setPreviewUrls([]);
    onHide();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...files]);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prevUrls => [...prevUrls, ...urls]);
  };

  return (
    <div className="create-post">
      <div className="create-post__content">
        <div className="create-post__container">
          <div className="create-post__title">Create New Post</div>
          <div className="post-detail__close">
            <svg onClick={onHide} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="create-post__subtitle"></div>
        <div className="create-post__form">
          {images.length > 0 && <div className="create-post__image" >
            {previewUrls.length > 0 && (
              <Carousel controls={previewUrls.length > 1} indicators={previewUrls.length > 1}>
                {previewUrls.map((url, index) => (
                  <Carousel.Item key={index}>
                    <img onClick={() => filepickerRef.current.click()} className="d-block w-100" src={url} alt="First slide" />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
            <Form.Control style={{ flex: '10%' }} type="text" placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} />
          </div>}
          {images.length < 1 && <div onClick={() => filepickerRef.current.click()} className="create-post__image-picker">
            <svg aria-label="Icon to represent media such as images or videos" color="#262626" fill="#262626" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path></svg>
            <p>Upload photos and videos here...</p>
          </div>}
          <input type="file" accept="images/*" multiple onChange={handleImageChange} style={{ display: 'none' }}
            ref={filepickerRef}
            hidden
          />
        </div>
        <div className="create-post__footer">
          <div className="create-post__upload" onClick={createPost}>
            <span>Upload</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
