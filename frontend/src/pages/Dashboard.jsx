import React from "react";
import { useState, useContext, useEffect } from "react";
import {Link, useNavigate, useParams} from 'react-router-dom'
import {UserContext} from '../context/userContext'
import axios from 'axios'
import Loader from '../components/Loader'
import DeletePost from '../pages/DeletePost'

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const {id} = useParams()

  const navigate = useNavigate()
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  },[])

  useEffect(()=>{
    const fetchPosts = async()=>{
      setIsLoading(true)
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/users/${id}`,{withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
        setPosts(response.data)

      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
    fetchPosts();
  },[id])

  if(isLoading){
    return <Loader/>
  }

  return (
    <section className="dashboard">
      {posts.length > 0 ? (
        <div className="container dashboard-container">
          {
            posts.map(post=>{
              return <article key={post.id} className='dashboard-post'>
                <div className="dashboard-post-info">
                  <div className="dashboard-post-thumbnail">
                    <img src={`http://localhost:5000/uploads/${post.thumbnail}`} alt="Post Thumbnail" />
                  </div>
                  <h5>{post.title}</h5>
                </div>
                <div className="dashboard-post-actions">
                  <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
                  <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
                  <DeletePost postID={post._id}/>
                </div>
              </article>
            })
          }
        </div>
      ) : (
        <h2 className="center">You have no posts yet.</h2>
      )}
    </section>
  );
};

export default Dashboard;
