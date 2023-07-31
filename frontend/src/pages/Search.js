import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

const Search = () => {
    const [search, setSearch] = useState(null);

    useEffect(() => {
        getData()
    }, []);

    const getData = async () => {
        const searchResponse = await fetch('http://localhost:8000/accounts/api/')
        const searchData = await searchResponse.json()
        setSearch(searchData)
        // console.log(searchData)
    };

    if (!search) {
        return <div>Loading...</div>
    }

    return (
        <Container className="mt-3">
            {search && search.map((profile) =>
                <Link key={profile.id} to={`/profile/${profile.id}/`}>
                <div style={{display: 'flex', alignItems: 'center'}}>
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
