import React, { useState, useEffect, useCallback } from "react";
import { fetchWithToken } from '../apiUtils';
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router";

const Comment = (props) => {
  const API = process.env.REACT_APP_API || 'http://localhost/api/';
  const [post, setPost] = useState(null);
  const { selectedPost } = props;
  const navigate = useNavigate();

  let loadPost = null;
  let size = 99999;
  if (props.isHome) {
    size = 3;
  };

  useEffect(() => {
    if (selectedPost) {
      loadPost();
    }
  }, [selectedPost, loadPost]);

  loadPost = useCallback(async () => {
    if (!selectedPost) {
      return;
    }
    setPost(selectedPost);
  }, [selectedPost]);

  const handleKeyPress = async (e) => {
    if (e.charCode === 13) {
      const formData = new FormData();
      formData.append('text', e.target.value);

      const response = await fetchWithToken(`${API}posts/api/${post.id}/comment/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating comment:', errorData);
      } else {
        e.target.value = '';
        const response = await fetchWithToken(`${API}posts/api/${post.id}/`);
        const data = await response.json();
        setPost(data);
      }
    }
  };

  return (
    <div className="post-detail__creator">
      <div className="post-detail__comment-top">
        <img src={post?.user.profile_picture} alt="" />
        <span className="post-detail__post-creator"><b>{post?.user.username}</b> {post?.caption}</span>
        {post?.comment_set && post?.comment_set.slice(0, size).map((comment) => (
          <div onClick={() => { navigate(`/profile/${comment?.user.id}/`, { replace: true }); }}>
            <img src={comment?.user.profile_picture} alt="" />
            <span className="post-detail__post-creator"><b>{comment?.user.username}</b> {comment?.text}</span>
          </div>))}
      </div>
      {props.isHome &&
        <span onClick={props.isHome} className="post-detail__post-creator">Show all <b>{post?.comment_set.length}</b> comments</span>
      }
      <Form.Control className="post-detail__comment-top" type="text" placeholder="Add a comment..." onKeyPress={handleKeyPress} />
    </div>
  );
}

export default Comment;
