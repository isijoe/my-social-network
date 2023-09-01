import React, { useState, useRef } from "react";
import { Form } from 'react-bootstrap';
import { fetchWithToken } from "../apiUtils";

const EditProfile = (props) => {
  const API = process.env.REACT_APP_API || 'http://localhost/api/';
  const formRef = useRef(null);

  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState(null);
  const [bio, setBio] = useState("");

  const uploadProfilePicture = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      setUploadedProfilePicture(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setProfilePicture(readerEvent.target.result);
    };
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('profile_picture', uploadedProfilePicture);
    return formData;
  }

  const updateProfilePicture = async () => {
    if (!uploadedProfilePicture) {
      alert("Please upload a profile picture!");
      return false;
    }
    const url = `${API}accounts/api/${props.profile.id}/`;
    const formData = createFormData();
    const response = await fetchWithToken(url, {
      credentials: 'include',
      method: 'PATCH',
      body: formData,
    });

    if (!response.ok) {
      console.error("Error updating profile picture.");
    } else {
      setProfilePicture(null);
      setUploadedProfilePicture(null);
      props.onHide();
    }
  };

  return (
    <div className="create-post">
      <div className="create-post__content">
        <div className="create-post__container">
          <div className="create-post__title">Edit Profile</div>
          <div className="post-detail__close">
            <svg onClick={props.onHide} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="create-post__subtitle"></div>
        <div className="create-post__form">
          <div className="create-post__image">
            <div>
              <img className="rounded-circle" onClick={() => formRef.current.click()}
                src={profilePicture ? profilePicture : props.profile.profile_picture}
                alt=""
              />
            </div>
            <Form ref={formRef}>
              <Form.Group>
                <Form.Label>Change profile picture</Form.Label>
                <Form.Control ref={formRef} type="file" onChange={uploadProfilePicture} />
              </Form.Group>
            </Form>
            <Form.Control style={{ flex: '10%' }} type="text" placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} />
          </div>
        </div>
        <div className="create-post__footer">
          <div className="create-post__upload" onClick={updateProfilePicture}>
            <span>Save changes</span>
          </div>
          <div className="create-post__upload" onClick={props.onHide}>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
