import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import {
  FaRegClock,
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaSearch,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedBlogs, setLikedBlogs] = useState([]);

  const categories = [
    "All",
    "Nightlife",
    "Food",
    "Culture",
    "Wellness",
    "Travel",
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          sort: sortOption,
          q: searchQuery,
        };

        const response = await axiosInstance.get(`/blogs`, { params });

        setAllBlogs(response.data.blogs);
        setBlogs(response.data.blogs);
        setTotalPages(response.data.totalPages);
        setError("");
      } catch (err) {
        setError("Failed to fetch blogs. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [searchQuery, sortOption, page]);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (activeCategory === "All") {
      setBlogs(allBlogs);
    } else {
      const filtered = allBlogs.filter((blog) =>
        blog.categories.includes(activeCategory)
      );
      setBlogs(filtered);
    }
  }, [activeCategory, allBlogs]);
  const navigate = useNavigate();
  const handleLike = async (blogId) => {
    try {
      await axiosInstance.post(`/blogs/${blogId}/like`);
      setBlogs(
        blogs.map((blog) => {
          if (blog._id === blogId) {
            const isLiked = likedBlogs.includes(blogId);
            return {
              ...blog,
              likes: isLiked ? blog.likes - 1 : blog.likes + 1,
            };
          }
          return blog;
        })
      );
      setLikedBlogs((prev) =>
        prev.includes(blogId)
          ? prev.filter((id) => id !== blogId)
          : [...prev, blogId]
      );
    } catch (err) {
      if (err.response.status === 401) {
        navigate("/auth/login");
      }
      console.error("Error liking blog:", err.response.status);
    }
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Our Featured Blogs
          </h1>
        </div>

        <div className="mb-8 w-max mx-auto">
          <div className="flex items-center justify-end">
            <div className="relative mx-auto w-max border mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                className="block pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setSortOption("newest")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  sortOption === "newest"
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortOption("oldest")}
                className={`px-4 py-2 text-sm font-medium ${
                  sortOption === "oldest"
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Oldest
              </button>
              <button
                onClick={() => setSortOption("popular")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  sortOption === "popular"
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Popular
              </button>
            </div>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              No articles found matching your criteria
            </h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setSortOption("newest");
              }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <Link to={`/blog/${blog.slug}`}>
                    <div className="relative h-48 w-full overflow-hidden">
                      {blog.featuredImage?.length > 0 ? (
                        <img
                          src={`http://localhost:5000/${blog.featuredImage[0]}`}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                          {blog.categories[0]}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/blog/${blog.slug}`}>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                          {blog.title}
                        </h3>
                      </Link>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FaRegClock className="mr-1" />
                        <span>{blog.readTime} min read</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleLike(blog._id);
                          }}
                          className="flex items-center hover:text-primary-500 transition-colors"
                        >
                          {user &&
                          (blog?.likes?.includes(user._id) ||
                            likedBlogs.includes(blog._id)) ? (
                            <FaHeart className="text-red-500 mr-1" />
                          ) : (
                            <FaRegHeart className="mr-1" />
                          )}
                          <span>{blog?.likes?.length}</span>
                        </button>

                        <div className="flex items-center">
                          <FaRegComment className="mr-1" />
                          <span>{blog.comments.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {blog.author && (
                        <div className="flex items-center">
                          <img
                            src={`http://localhost:5000/${blog.author.profilePicture}`}
                            alt={blog.author.name}
                            className="w-8 h-8 rounded-full object-cover mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {blog.author.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          page === pageNum
                            ? "bg-primary text-white"
                            : "border hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;
