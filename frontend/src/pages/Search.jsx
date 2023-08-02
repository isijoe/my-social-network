import React, { useState, useEffect, useCallback } from "react";
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { useAuth } from '../useAuth';

const Search = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [search, setSearch] = useState(null);

  const getData = useCallback(async () => {
    let searchResponse;

    if (!isLoggedIn) {
      searchResponse = await fetch('http://localhost:8000/accounts/api/')
    } else {
      searchResponse = await fetch('http://localhost:8000/accounts/api/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
    }
    const searchData = await searchResponse.json()
    setSearch(searchData)
    // console.log(searchData)
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoading) {
    getData();
    }
  }, [isLoading, getData]);

  if (!search) {
    return <div>Loading...</div>
  }
  return (
    <Container className="mt-3">
      {search && search.map((profile) =>
        <Link key={profile.id} to={`/profile/${profile.id}/`}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img className="rounded-circle" style={{ width: "70px", height: "70px", marginRight: '10px' }}
              src={profile.profile_picture ? profile.profile_picture : 'images/def_prof_pic.jpg'}
              alt={`${profile.username}'s profile picture`}
            />
            <h2>{profile.username}</h2>
          </div>
        </Link>
      )}
    </Container>
  );
};

export default Search;
