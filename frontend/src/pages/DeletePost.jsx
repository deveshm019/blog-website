import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import axios from 'axios'
import Loader from '../components/Loader'

const DeletePost = ({postID: id}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading,setIsLoading] = useState(false)

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const removePost = async()=>{
    setIsLoading(true)
    try {
      const response = await axios.delete(`http://localhost:5000/api/posts/${id}`,{withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      if(response.status == 200){
        if(location.pathname == `/myposts/${currentUser.id}`){
          navigate(0)
        } else{
          navigate('/')
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.log("Failed to delete the post!")
    }
  }

  if(isLoading){
    return <Loader/>
  }

  return <Link className="btn sm danger" onClick={()=>removePost(id)}>Delete</Link>;
};

export default DeletePost;
