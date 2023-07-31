import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router';


const Profile = ({ }) => {
    const [profile, setProfile] = useState(null);
    let { profileId } = useParams();

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const API = 'http://localhost:8000/accounts/api/'
        const profileResponse = await fetch(API + profileId)
        const profileData = await profileResponse.json()
        setProfile(profileData)
        // console.log(profileData)
    }
    if (!profile) {
        return <div>Loading...</div>;
    } 

    return (
        <Container className='mt-3'>
            {profile &&
                <div>
                    <img className="rounded-circle" style={{ width: "70px", height: "70px" }}
                        src={profile.profile_picture ? profile.profile_picture : 'images/def_prof_pic.jpg'}
                        alt={`${profile.username}'s profile picture`}
                    />
                    <h2>{profile.username}</h2>
                    <p>Bio: <br />{profile.bio}</p>

                    <h3>Follower: </h3>
                    <p>{profile.followers}</p>
                    <form method="post" action={`/profile_follow/${profile.id}`}>
                        <Button type="submit">Follow</Button>
                    </form>

                    {/* {profile.email === user.email && */}
                    <h5><a href={`/profile_edit/${profile.id}`}>+ Edit Profile Information</a></h5>
                    {/* } */}

                    <br />

                    <div className="row">
                        {profile.post_set.map((post) =>
                            <div className="col-lg-4" key={post.id}>
                                <Carousel>
                                    {post.post_imgs.map((image, index) =>
                                        <Carousel.Item key={index}>
                                            <img
                                                className="thumbnail"
                                                style={{ width: "200px", height: "200px" }}
                                                src={image.image}
                                                alt={image.alt}
                                            // onClick={() => setSelectedImage(image.image)}
                                            />
                                        </Carousel.Item>
                                    )}
                                </Carousel>
                                <div className="box-element">
                                    <h6><strong>{post.caption.slice(0, 5)} from {new Date(post.created_at).toLocaleDateString()}</strong></h6>
                                    <hr />
                                    {/* {user.email === post.user.email && */}
                                    <div>
                                        <Button variant="danger" href={`/post_delete/${post.id}`}>Delete</Button>
                                        <Button variant="warning" href={`/post_edit/${post.id}`}>Edit</Button>
                                    </div>
                                    {/* } */}
                                    <h4 style={{ display: 'inline-block', float: 'right' }}><strong> new </strong></h4>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
        </Container>
    );
};

export default Profile;
