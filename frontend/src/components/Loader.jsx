import React from 'react'
import Loading from '../assets/loading.gif'

const Loader = () => {
  return (
    <div className='loader'>
        <div className="loader_image">
            <img src={Loading} alt="" />
        </div>
    </div>
  )
}

export default Loader