import React, {useContext, useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import PostAuthor from "../components/PostAuthor";
import Thumbnail from "../assets/logo.png";
import {UserContext} from '../context/userContext'
import Loader from '../components/Loader'
import DeletePost from '../pages/DeletePost'
import axios from "axios";

const PostDetail = () => {

  const {id} = useParams()
  const [post,setPosts] = useState(null)
  const [error,setError] = useState(null)
  const [isLoading,setIsLoading] = useState(false)

  const {currentUser} = useContext(UserContext)

  useEffect(()=>{
    const getPost = async()=>{
      setIsLoading(true)
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`)
        setPosts(response.data)
      } catch (error) {
        setError(error)
      }
      setIsLoading(false)
    }
    getPost()
  },[])

  if(isLoading){
    return <Loader/>
  }

  return (
    <section className="post-detail">
      {error && <p className="error">{error}</p>}
      {post && <div className="container post-detail-container">
        <div className="post-detail-header">
          <PostAuthor authorID={post.creator} createdAt={post.createdAt}/>
          {currentUser?.id == post?.creator && <div className="post-detail-buttons">
            <Link to={`/posts/${post?._id}/edit`} className="btn sm primary">
              Edit
            </Link>
            <DeletePost postID={id}/>
          </div>}
        </div>
        <h1>{post.title}</h1>
        <div className="post-detail-thumbnail">
          <img src={`http://localhost:5000/uploads/${post.thumbnail}`} alt="" />
        </div>
        <p dangerouslySetInnerHTML={{__html: post.desc}}></p>
      </div>}
    </section>
  );
};

export default PostDetail;
