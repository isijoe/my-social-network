import React, { useState, useEffect, useCallback } from "react";
import Comment from "./Comment";
import Post from "./Post";
import { getPost, checkIfFollowing, followOrUnfollowUser } from '../apiUtils';
import { useAuth } from '../authProvider';
import { useNavigate } from "react-router-dom";

const PostDetail = (props) => {
  const { loggedInUserId } = useAuth();
  const [post, setPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { onHide } = props;
  const navigate = useNavigate();

  let loadPost = null;

  useEffect(() => {
    if (props.selectedPost) {
      loadPost();
    }
  }, [props.selectedPost, loadPost]);

  loadPost = useCallback(async () => {
    if (!props.selectedPost) {
      return;
    }
    try {
      const data = await getPost(props.selectedPost.id);
      setPost(data);
      const followData = await checkIfFollowing(props.selectedPost.user.id);
      setIsFollowing(followData.isFollowing);
    } catch (error) {
      console.error("Error loading post.");
    }
  }, [props.selectedPost]);

  const onItemClicked = () => console.log("Item Clicked...");

  const followUser = async (profileId) => {
    try {
      const response = await followOrUnfollowUser(profileId);
      if (!response.ok) {
        console.error("Error following user.");
      } else {
        isFollowing ? setIsFollowing(false) : setIsFollowing(true);
        loadPost();
      }
    } catch (error) {
      console.error("Follow error:", error);
    }
  }

  return (
    <div className="post-detail">
      <div className="post-detail__content">
        <div className="post-detail__container">
          <div className="post-detail__close">
            <svg onClick={onHide} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="post-detail__main">
          <div className="post-detail__main-left">
            {post &&
              <Post post={post} onItemClicked={onItemClicked} style={{ width: "470px", height: "470px" }} />
            }
          </div>
          <div className="post-detail__main-right">
            <div className="post-detail__creator">
              <img src={post?.user.profile_picture} alt="" />
              <span className="post-detail__post-creator" onClick={() => { navigate(`/profile/${post?.user.id}/`, { replace: true }); onHide(); }}>{post?.user.username}</span>
              {post?.user.id !== loggedInUserId && <div className="post-detail__dot"></div>}
              {post?.user.id !== loggedInUserId && <span className="post-detail__follow"
                onClick={() => followUser(post?.user.id)}>{isFollowing ? 'unfollow' : 'follow'}</span>}
            </div>
            <Comment selectedPost={post} />
            <div className="post-detail__reactions-head">
              <div className="post-detail__reactions">
                <svg onClick={() => { props.handleLike(post?.id); loadPost(); }} aria-label="Like" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                <span className="post-detail__reactions-count">{post?.like_set.length}</span>
              </div>
              <div className="post-detail__reactions">
                <svg onClick={onHide} aria-label="Share Post" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
