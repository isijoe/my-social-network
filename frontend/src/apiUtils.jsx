const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Token ${token}`
    }
  });
}

export { fetchWithToken };
