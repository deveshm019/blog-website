import React from 'react'
import {Link} from "react-router-dom"
import PostAuthor from "./PostAuthor"

const PostItem = ({postID,thumbnail,title,category,desc,authorID,createdAt}) => {

    const shortDescription= desc.length > 145 ? desc.substr(0,145) + '...' : desc;
    const postTitle= title.length > 30 ? title.substr(0,30) + '...' : title;

  return (
    <article className="post">
        <div className="post-thumbnail">
            <img src={`http://localhost:5000/uploads/${thumbnail}`} alt={postTitle} />
        </div>
        <div className="post-content">
            <Link to={`/posts/${postID}`}>
                <h3>{postTitle}</h3>
            </Link>
            <p dangerouslySetInnerHTML={{__html: shortDescription}}></p>
            <div className="post-footer">
                <PostAuthor authorID={authorID} createdAt={createdAt}/>
                <Link to={`/posts/categories/${category}`} className="btn category">{category}</Link>
            </div>
        </div>
    </article>
  )
}
export default PostItem