const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  createBlog,
  getAllBlogs,
  getFeaturedBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  deleteComment,
  getBlogsByCategory,
  getBlogsByAuthor,
} = require("../controllers/blogController");

// Public routes (no authentication required)
router.get("/", getAllBlogs);
router.get("/featured", getFeaturedBlogs);
router.get("/category/:category", getBlogsByCategory);
router.get("/author/:authorId", getBlogsByAuthor);
router.get("/:slug", getBlogBySlug);

// Authenticated routes
router.use(authenticate);

// Like/comment routes
router.post("/:id/like", toggleLike);
router.post("/:id/comments", addComment);
router.delete("/:blogId/comments/:commentId", deleteComment);

// Author & admin protected routes
router.post("/", authorize(["author", "admin"]), createBlog);
router
  .route("/:id")
  .put(authorize(["author", "admin"]), updateBlog)
  .delete(authorize(["author", "admin"]), deleteBlog);

module.exports = router;
