import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import { FaRegHeart, FaHeart, FaRegComment, FaRegClock } from "react-icons/fa";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { useSelector } from "react-redux";
const BlogRead = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    setIsLiked(blog?.likes?.includes(user?._id));
  }, [user]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(`/blogs/${slug}`);
        setBlog(response.data.blog);
        setIsLiked(response.data.blog.likes.includes(response.data.blog._id));
      } catch (err) {
        setError("Failed to fetch blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleLike = async () => {
    try {
      const response = await axiosInstance.post(`/blogs/${blog._id}/like`);
      setIsLiked(response.data.isLiked);
      setBlog((prev) => ({
        ...prev,
        likes: response.data.isLiked
          ? [...prev.likes, blog._id]
          : prev.likes.filter((id) => id !== blog._id),
      }));
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Save current location before redirecting
      navigate("/auth/login", { state: { from: `/blog/${slug}` } });
    }
    try {
      const response = await axiosInstance.post(`/blogs/${blog._id}/comments`, {
        text: comment,
      });
      setBlog((prev) => ({
        ...prev,
        comments: [...prev.comments, response.data.comment],
      }));
      setComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Blog post not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 text-sm font-semibold text-white bg-primary rounded-full">
                {blog.categories[0]}
              </span>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaRegClock className="mr-2" />
                {blog.readTime} min read
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {blog.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <img
                  src={`${import.meta.env.VITE_API_URL}/${
                    blog.author.profilePicture
                  }`}
                  alt={blog.author.name}
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {blog.author.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(blog.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden mb-8">
              {blog.featuredImage && blog.featuredImage.length > 0 ? (
                <div className="relative w-full h-full">
                  {/* Image Carousel */}
                  <div className="carousel w-full h-full">
                    {blog.featuredImage.map((image, index) => (
                      <div
                        key={index}
                        id={`slide-${index}`}
                        className="carousel-item relative w-full h-full"
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}/${image}`}
                          alt={`${blog.title} - image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Navigation Arrows */}
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                          <a
                            href={`#slide-${
                              index === 0
                                ? blog.featuredImage.length - 1
                                : index - 1
                            }`}
                            className="btn btn-circle bg-black/30 border-none text-white hover:bg-black/50"
                          >
                            ❮
                          </a>
                          <a
                            href={`#slide-${
                              index === blog.featuredImage.length - 1
                                ? 0
                                : index + 1
                            }`}
                            className="btn btn-circle bg-black/30 border-none text-white hover:bg-black/50"
                          >
                            ❯
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Indicator Dots */}
                  <div className="absolute bottom-4 left-0 right-0">
                    <div className="flex items-center justify-center gap-2">
                      {blog.featuredImage.map((_, index) => (
                        <a
                          key={index}
                          href={`#slide-${index}`}
                          className="w-3 h-3 rounded-full bg-white/70 hover:bg-white transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    No images available
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />

          {/* Interactions */}
          <div className="flex items-center gap-6 border-t border-b py-4 mb-8">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary"
            >
              {isLiked ? <FaHeart className="text-primary" /> : <FaRegHeart />}
              {blog.likes.length} likes
            </button>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FaRegComment />
              {
                blog.comments.filter((comment) => comment.isVerified).length
              }{" "}
              comments
            </div>
          </div>

          {/* Comments Section */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Comments
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                rows="3"
                required
              />
              <button
                type="submit"
                className="mt-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors"
              >
                Post Comment
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {blog.comments
                .filter(
                  (comment) =>
                    comment?.isVerified || user?._id === comment?.user?._id
                )
                .map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${
                          comment.user?.profilePicture
                        }`}
                        alt={comment.user?.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {comment.user?.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(comment.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {comment.text}
                    </p>
                  </motion.div>
                ))}
            </div>
          </section>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogRead;
