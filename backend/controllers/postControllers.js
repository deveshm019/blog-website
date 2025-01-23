const Post = require("../models/postModel.js");
const User = require("../models/userModel.js");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel.js");

const createPost = async (req, res, next) => {
  try {
    let { title, category, desc } = req.body;
    if (!title || !category || !desc || !req.files) {
      return next(new HttpError("Please fill in all fields!", 422));
    }
    const { thumbnail } = req.files;
    if (thumbnail.size > 2000000) {
      return next(new HttpError("Thumbnail size should not exceed 2MB!", 422));
    }
    let filename = thumbnail.name;
    let splittedFilename = filename.split(".");
    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];
    thumbnail.mv(
      path.join(__dirname, "..", "/uploads", newFilename),
      async (error) => {
        if (error) {
          return next(new HttpError(error));
        } else {
          const newPost = await Post.create({
            title,
            category,
            desc,
            thumbnail: newFilename,
            creator: req.user.id,
          });
          if (!newPost) {
            return next(new HttpError("Failed to create post!", 422));
          }
          const currentUser = await User.findById(req.user.id);
          const userPostCount = currentUser.posts + 1;
          await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
          res.status(201).json(newPost);
        }
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found!", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getCategoryPost = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category: category }).sort({
      updatedAt: -1,
    });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const editPost = async (req, res, next) => {
  try {
    let fileName, newFilename, updatedPost;
    const postId = req.params.id;
    let { title, category, desc } = req.body;
    if (!title || !category || desc.length < 12) {
      return next(new HttpError("Please fill all fields!", 422));
    }
    if (!req.files) {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, desc },
        { new: true }
      );
      //res.status(201).json(updatedPost);
    } else {
      const oldPost = await Post.findById(postId);
      fs.unlink(
        path.join(__dirname, "..", "/uploads", oldPost.thumbnail),
        async (error) => {
          if (error) {
            return next(new HttpError(error));
          }
        }
      );
      const { thumbnail } = req.files;
      if (thumbnail.size > 2000000) {
        return next(new HttpError("Thumbnail should be less than 2MB!", 422));
      }
      fileName = thumbnail.name;
      let splittedFilename = fileName.split(".");
      newFilename =
        splittedFilename[0] +
        uuid() +
        "." +
        splittedFilename[splittedFilename.length - 1];
      thumbnail.mv(
        path.join(__dirname, "..", "/uploads", newFilename),
        async (error) => {
          if (error) {
            return next(new HttpError(error));
          }
        }
      );
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, desc, thumbnail: newFilename },
        { new: true }
      );
    }
    if (!updatedPost) {
      return next(new HttpError("Failed to update post!", 422));
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if(!postId){
      return next(new HttpError("Post unavailable!",400))
    }
    const post = await Post.findById(postId);
    const fileName = post.thumbnail;
    if(req.user.id == post.creator){
    fs.unlink(path.join(__dirname, '..', '/uploads', fileName), async(error)=>{
      if(error){
        return next(new HttpError(error))
      }
      else{
        await Post.findByIdAndDelete(postId);
        const currentUser = await User.findById(req.user.id);
        const userPostCount = currentUser.posts -1 
        await User.findByIdAndUpdate(req.user.id,{posts: userPostCount})
        res.json(`Post ${postId} deleted successfully!`)
      }
    })
  } else{
    return next(new HttpError("Failed to delete post!",403))
  }
  } catch (error) {
    return next(new HttpError(error))
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCategoryPost,
  getUserPosts,
  editPost,
  deletePost,
};
