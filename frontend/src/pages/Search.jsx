import React, { useState, useEffect, useCallback } from "react";
import { Container, Offcanvas, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../useAuth';
import './Search.css';

const Search = (props) => {
  const { isLoggedIn, isLoading } = useAuth();
  const [search, setSearch] = useState(null);
  const [searchText, setSearchText] = useState("");

  const url = `http://localhost:8000/accounts/api/?search=${searchText}`;

  const getData = useCallback(async () => {
    let searchResponse;

    if (!isLoggedIn) {
      searchResponse = await fetch(url)
    } else {
      searchResponse = await fetch(url, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
    }
    const searchData = await searchResponse.json()
    setSearch(searchData)
    // console.log(searchData)
  }, [isLoggedIn, searchText]);

  useEffect(() => {
    if (!isLoading) {
      getData();
    }
  }, [isLoading, getData]);

  if (!search) {
    return <div>Loading...</div>
  }


  return (
    <Offcanvas {...props} scroll='true'>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Search</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Container className="mt-3">
          <Form className="d-flex">
            <Form.Control type="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search" className="me-2" aria-label="Search" />
          </Form>
          {search && search.map((profile) =>
            <Button className="btn-nav" key={profile.id}><Link to={`/profile/${profile.id}/`} onClick={props.onHide}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img className="rounded-circle" style={{ width: "70px", height: "70px", marginRight: '10px' }}
                  src={profile.profile_picture ? profile.profile_picture : 'images/def_prof_pic.jpg'}
                  alt={`${profile.username}'s profile picture`}
                />
                <h2>{profile.username}</h2>
              </div>
            </Link></Button>
          )}
        </Container>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Search;
