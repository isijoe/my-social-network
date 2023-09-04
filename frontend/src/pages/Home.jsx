import React, { useCallback, useEffect, useState } from 'react';
import { getPostsByFollowers } from '../apiUtils';
import Posts from './Posts';

const Home = () => {
  const [posts, setPosts] = useState([]);

  let loadPosts = null;

  useEffect(() => {
    loadPosts();
    return () => {
      setPosts([]);
    }
  }, [loadPosts]);

  loadPosts = useCallback(async () => {
    try {
      const data = await getPostsByFollowers();
      setPosts(() => data);
    } catch (error) {
      console.error("Error loading posts.");
    }
  }, [loadPosts]);

  return (
    <div>
      <Posts posts={posts} isHome={loadPosts} />
    </div>
  );
};

export default Home;
