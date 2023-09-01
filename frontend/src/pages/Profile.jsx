import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../authProvider';
import { getUserProfile, checkIfFollowing, followOrUnfollowUser, deletePostAPI } from '../apiUtils';
import EditProfile from './EditProfile';
import Posts from './Posts';
import './Profile.css';

const Profile = () => {
  const { isLoggedIn, isLoading, loggedInUserId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  let { profileId } = useParams();
  const [modalShowEditProfile, setModalShowEditProfile] = useState(false);

  let loadUser = null;

  useEffect(() => {
    if (!isLoading) {
      loadUser();
    }
  }, [isLoading, loadUser, isFollowing]);

  loadUser = useCallback(async () => {
    const data = await getUserProfile(profileId);
    setProfile(data);
    if (isLoggedIn && profileId !== loggedInUserId) {
      const followData = await checkIfFollowing(profileId);
      setIsFollowing(followData.isFollowing);
    }
  }, [loggedInUserId, profileId, isLoggedIn]);

  const followUser = async (profileId) => {
    try {
      const response = await followOrUnfollowUser(profileId);
      if (!response.ok) {
        console.error("Error following user.");
      } else {
        isFollowing ? setIsFollowing(false) : setIsFollowing(true);
        loadUser();
      }
    } catch (error) {
      console.error("Follow error:", error);
    }
  }

  const deletePost = async (postId) => {
    try {
      const response = await deletePostAPI(postId);
      if (!response.ok) {
        console.error("Error deleting post.");
      }
    } catch (error) {
      console.error("Post delete error:", error);
    }
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <div className="user-profile" >
        <div className="user-profile__left">
          <img
            src={profile.profile_picture ? profile.profile_picture : 'images/def_prof_pic.jpg'}
            alt=""
          />
        </div>
        <div className="user-profile__right">
          <div className="user-profile__name" >
            <span>{profile.username}</span>
            {(isLoggedIn) && (loggedInUserId !== profileId) &&
              <div className="user-profile__follow">
                <span onClick={() => followUser(profileId)}>{isFollowing ? 'unfollow' : 'follow'}</span>
              </div>}
            {(isLoggedIn) && (loggedInUserId === profileId) &&
              <div className="user-profile__famous">
                <div className="user-profile__follow">
                  <span onClick={() => setModalShowEditProfile(true)}>Edit Profile</span>
                  {modalShowEditProfile &&
                    <EditProfile show={modalShowEditProfile} onHide={() => { setModalShowEditProfile(false); loadUser(); }} profile={profile} />
                  }
                </div>
              </div>}
          </div>
          <div className="user-profile__famous">
            <div className="user-profile__famous-item">
              <span className="user-profile__famous-item-content">{profile.post_set.length}</span>
              <span>posts</span>
            </div>
            <div className="user-profile__famous-item">
              <span className="user-profile__famous-item-content">{profile.followers.length}</span>
              <span>followers</span>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="posts">
        <Posts posts={profile.post_set} style={{ width: "200px", height: "200px" }} />
      </div>
    </div>
  );
};

export default Profile;
