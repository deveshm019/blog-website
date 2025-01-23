import React from 'react'
import { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import axios from 'axios'

const Register = () => {

  const [userData,setUserData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
  })

  const [error,setError] = useState('')
  const navigate = useNavigate()

  const changeInputHandler = (e)=>{
    setUserData(prevState=>{
      return{...prevState,[e.target.name]: e.target.value}
    })
  }

  const registerUser = async(e)=>{
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/users/register`, userData)
      const newUser = response.data;
      if(!newUser){
        setError("Registration failed!")
      }
      navigate('/login')
    } catch (error) {
      setError(error.response.data.message)
    }
  }

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register-form" onSubmit={registerUser}>
          {error && <p className="form-error-message">
            {error}
          </p>}
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={changeInputHandler}/>
          <input type="text" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler}/>
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler}/>
          <input type="password" placeholder='Confirm Password' name='confirmPassword' value={userData.confirmPassword} onChange={changeInputHandler}/>
          <button type="submit" className='btn primary'>Register</button>
        </form>
        <small>Already have an account? <Link to="/login">sign in</Link></small>
      </div>
    </section>
  )
}

export default Register