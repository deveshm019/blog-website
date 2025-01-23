import React from 'react'
import { useState, useEffect } from 'react'
import PostItem from "../components/PostItem"
import Loader from '../components/Loader'
import {useParams} from 'react-router-dom'
import axios from 'axios'

const AuthorPosts = () => {

  const [posts,setPosts] = useState([]);
  const [isLoading,setIsloading] = useState(false)

  const {id} = useParams();

  useEffect(()=>{
    const fetchPosts = async()=>{
      setIsloading(true)
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/users/${id}`)
        setPosts(response?.data)
      } catch (error) {
        console.log(error)
      }
      setIsloading(false)
    }
    fetchPosts();
  },[id])

  if(isLoading){
    return <Loader/>
  }
return (
  <section className="posts">
      {posts.length > 0 ?<div className="container posts-container">
      {
          posts.map(({_id: id,thumbnail,category,title,desc,creator,createdAt})=><PostItem key={id} postID={id} thumbnail={thumbnail} category={category} title={title} desc={desc} authorID={creator} createdAt={createdAt}/>)
      }
      </div>:<h2 className='center'>No Posts Found!</h2>}
  </section>
)
}

export default AuthorPosts