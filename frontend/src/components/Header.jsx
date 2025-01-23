import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Logo from "../assets/logo.png";
import {FaBars} from "react-icons/fa";
import {AiOutlineClose} from "react-icons/ai"
import {UserContext} from '../context/userContext'

const Header = () => {

  const [isNavbarOpen,setIsNavbarOpen] = useState(window.innerWidth > 800 ? true : false)
  const {currentUser} = useContext(UserContext)

  const closeNavHandler = ()=>{
    if (window.innerWidth < 800) {
      setIsNavbarOpen(false);
    }
    else{
      setIsNavbarOpen(true)
    }
  }

  return (
    <nav>
      <div className="container nav-container">
        <Link to={"/"} className="nav-logo"  onClick={closeNavHandler}>
          <img src={Logo} alt="App logo" />
        </Link>
        {currentUser?.id && isNavbarOpen && <ul className='nav-menu'>
          <li><Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler}>{currentUser?.name}</Link></li>
          <li><Link to={"/create"} onClick={closeNavHandler}>Create Post</Link></li>
          <li><Link to={"/authors"} onClick={closeNavHandler}>Authors</Link></li>
          <li><Link to={"/logout"} onClick={closeNavHandler}>Logout</Link></li>
        </ul>}
        {!currentUser?.id && isNavbarOpen && <ul className='nav-menu'>
          <li><Link to={"/authors"} onClick={closeNavHandler}>Authors</Link></li>
          <li><Link to={"/login"} onClick={closeNavHandler}>Login</Link></li>
        </ul>}
        <button className="nav-toggle-btn"  onClick={()=>setIsNavbarOpen(!isNavbarOpen)}>
          {
            isNavbarOpen ? <AiOutlineClose/>
            : <FaBars/>
          }
        </button>
      </div>
    </nav>
  )
}

export default Header