import { useState } from "react";
import axios from "axios";

const PostCreate = () => {
  const [title, setTitle] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://posts.dev.com/posts",
      JSON.stringify({
        title,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setTitle("");
  };

  const inputHandler = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={inputHandler}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary my-1">Submit</button>
      </form>
    </div>
  );
};

export default PostCreate;
