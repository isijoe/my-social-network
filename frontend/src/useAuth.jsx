import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const API = process.env.REACT_APP_API || 'http://localhost/api/'

  const getUserDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API}api/dj-rest-auth/user/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 401) {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      } else {
        const data = await response.json();
        setIsLoggedIn(true);
        setLoggedInUserId(data.pk);
        return data.pk;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, [API]);

  const getUserProfilePicture = useCallback(async (userId) => {
    try {
      const response = await fetch(`${API}accounts/api/${userId}/`);
      const data = await response.json();
      setProfilePicture(data.profile_picture);
    } catch (error) {
      console.error("Error fetching use profile picture:", error);
    }
  }, [API]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getUserDetails().then(userId => {
        if (userId) {
          getUserProfilePicture(userId).then(() => {
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }
  }, [getUserDetails, getUserProfilePicture]);

  const loginUser = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API}api/dj-rest-auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.key;
        localStorage.setItem('token', token);
        const userId = await getUserDetails();
        await getUserProfilePicture(userId);
      } else {
        console.error("Error logging in.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }, [API, getUserDetails, getUserProfilePicture]);

  const logoutUser = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setLoggedInUserId(null)
    setProfilePicture(null); // clear the profile picture on logout
  };

  return { isLoading, isLoggedIn, loggedInUserId, profilePicture, loginUser, logoutUser };
};
