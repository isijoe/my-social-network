import React, { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const getUserDetails = async (token) => {
    const response = await fetch('http://localhost:8000/api/dj-rest-auth/user/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data);
      throw new Error(data.detail);
    }

    return data;
  };

  const getUserProfilePicture = async (id) => {
    const response = await fetch(`http://localhost:8000/accounts/api/${id}/`, {
      method: 'GET',
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data);
      throw new Error(data.detail);
    }

    return data;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      setIsLoggedIn(true);
      // Add the logic to fetch user details here
      getUserDetails(token)
        .then((userDetails) => {
          setLoggedInUserId(userDetails.pk)
          return getUserProfilePicture(userDetails.pk);
        })
        .then((profilePictureUrl) => {
          setProfilePicture(profilePictureUrl.profile_picture);
        }).catch((error) => {
          console.error('Fehler beim Abrufen der Benutzerdetails:', error);
        }).finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);


  const loginUser = async (email, password) => {
    const response = await fetch('http://localhost:8000/api/dj-rest-auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      const token = data.key;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      try {
        const userDetails = await getUserDetails(token);
        const userPicture = await getUserProfilePicture(userDetails.pk)
        setProfilePicture(userPicture.profile_picture);
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdetails:', error);
      }
    } else {
      throw new Error(data.detail);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setProfilePicture(null); // clear the profile picture on logout
  };

  return { isLoggedIn, isLoading, loginUser, logoutUser, loggedInUserId, profilePicture };
};
