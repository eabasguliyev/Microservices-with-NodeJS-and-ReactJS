import axios from "axios";
import React, { useState } from "react";

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState("");

  const inputHandler = (e) => {
    setContent(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await axios.post(
      `http://localhost:4001/posts/${postId}/comments`,
      JSON.stringify({
        content,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setContent("");
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            value={content}
            onChange={inputHandler}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary my-1">Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;
