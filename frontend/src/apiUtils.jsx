const API = process.env.REACT_APP_API || 'http://localhost/api/';

export const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Token ${token}`
    }
  });
};

export const getUserProfile = async (profileId) => {
  const url = `${API}accounts/api/${profileId}/`;
  const response = await fetch(url);
  return response.json();
};

export const checkIfFollowing = async (profileId) => {
  const url = `${API}accounts/api/${profileId}/is_following/`;
  const response = await fetchWithToken(url);
  return response.json();
};

export const followOrUnfollowUser = async (profileId) => {
  const response = await fetchWithToken(`${API}accounts/api/${profileId}/follow/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response;
};

export const getPosts = async () => {
  const url = `${API}posts/api/`;
  const response = await fetch(url);
  return response.json();
}

export const getPostsByFollowers = async () => {
  const url = `${API}posts/api/followed/`;
  const response = await fetchWithToken(url);
  return response.json();
}

export const getPost = async (postId) => {
  const url = `${API}posts/api/${postId}/`;
  const response = await fetchWithToken(url);
  return response.json();
}

export const deletePostAPI = async (postId) => {
  const response = await fetchWithToken(`${API}posts/api/${postId}/`, {
    method: 'DELETE'
  });
  return response;
}

export const like = async (postId) => {
  const response = await fetchWithToken(`${API}posts/api/${postId}/like/`, {
    method: 'POST',
  });

  if (response.ok) {
    return response;
  }
};
