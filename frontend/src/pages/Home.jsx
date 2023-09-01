import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../authProvider';
import { getPostsByFollowers } from '../apiUtils';
import Posts from './Posts';

const Home = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [posts, setPosts] = useState([]);

  let loadPosts = null;

  useEffect(() => {
    if (!isLoading) {
      loadPosts();
      return () => {
        setPosts([]);
      }
    }
  }, [isLoading, loadPosts]);

  loadPosts = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const data = await getPostsByFollowers();
        setPosts(() => data);
      } catch (error) {
        console.error("Error loading posts.");
      }
    }
  }, [isLoggedIn]);

  return (
    <div>
      <Posts posts={posts} isHome={true} />
    </div>
  );
};

export default Home;
