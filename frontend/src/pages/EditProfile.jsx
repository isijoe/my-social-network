import React from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import { fetchWithToken } from "../apiUtils";

const EditProfile = (props) => {
  const formRef = React.useRef(null);
  const API = process.env.REACT_APP_API || 'http://localhost/api/'

  const handleSaveClick = async () => {
    const fileInput = formRef.current.querySelector("#formFile");
    if (fileInput) {
      const files = Array.from(fileInput.files);
      // setProfilePicture(files);
      console.log(files);

      const formData = new FormData();
      formData.append('profile_picture', files[0]);

      const response = await fetchWithToken(`${API}accounts/api/${props.profile.id}/`, {
        credentials: 'include',
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating profile picture.", errorData);
      } else {
        props.onHide();
      }
    }
  };

  return (
    <Modal
      {...props}
      dialogClassName="modal-90h"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">
          Edit Profile Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <img className="rounded-circle" style={{ width: "50px", height: "50px" }}
          src={props.profile.profile_picture ? props.profile.profile_picture : 'images/def_prof_pic.jpg'}
          alt=""
        />
        <Form ref={formRef}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Change profile picture</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSaveClick} className="btn">Save changes</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfile;
