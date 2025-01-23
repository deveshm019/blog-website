const {
  createPost,
  getPosts,
  getPost,
  getCategoryPost,
  getUserPosts,
  editPost,
  deletePost,
} = require("../controllers/postControllers.js");
const authMiddleware = require('../middleware/authMiddleware.js')
const { Router } = require("express");

const router = Router();

router.post("/", authMiddleware, createPost)
router.get("/",getPosts)
router.get("/:id",getPost)
router.get("/categories/:category",getCategoryPost)
router.get("/users/:id",getUserPosts)
router.patch("/:id", authMiddleware, editPost)
router.delete("/:id", authMiddleware, deletePost)

module.exports = router;
