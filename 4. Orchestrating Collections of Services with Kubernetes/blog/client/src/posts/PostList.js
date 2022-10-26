import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommentCreate from "../comments/CommentCreate";
import CommentList from "../comments/CommentList";

const PostList = (props) => {
  const [posts, setPosts] = useState({});

  const fetchPosts = useCallback(async () => {
    const response = await axios.get("http://posts.dev.com/posts");

    console.log(response.data);
    setPosts(response.data);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        className="card"
        style={{
          width: "30%",
          marginBottom: "20px",
        }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};

export default PostList;
