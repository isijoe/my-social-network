import React, { useState, useEffect, useCallback } from "react";
import Posts from "./Posts";
import { getPosts } from "../apiUtils";

const Explore = () => {
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
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.log("Error loading posts.");
    }
  }, [posts]);

  return (
    <div>
      <Posts posts={posts} />
    </div>
  );
};

export default Explore;
