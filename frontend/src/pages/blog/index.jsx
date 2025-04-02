import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import {
  FaRegClock,
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaSearch,
  FaArrowLeft,
  FaAngleRight,
  FaChevronDown,
  FaChevronUp,
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
  const [isLiking, setIsLiking] = useState({});
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const categories = [
    "All",
    "Nightlife",
    "Food",
    "Culture",
    "Wellness",
    "Travel",
  ];

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // Memoized fetch function
  const fetchBlogs = useCallback(async () => {
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

      // Initialize liked blogs based on user data
      if (user) {
        const userLikedBlogs = response.data.blogs
          .filter((blog) => blog.likes.includes(user._id))
          .map((blog) => blog._id);
        setLikedBlogs(userLikedBlogs);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch blogs. Please try again later."
      );
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortOption, page, user]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        setPage(1); // Reset to first page on search
        fetchBlogs();
      }, 500)
    );

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchQuery]);

  // Filter by category
  useEffect(() => {
    if (activeCategory === "All") {
      setBlogs(allBlogs);
    } else {
      const filtered = allBlogs.filter((blog) =>
        blog.categories.includes(activeCategory)
      );
      setBlogs(filtered);
    }
    setPage(1); // Reset to first page when category changes
  }, [activeCategory, allBlogs]);

  const handleLike = async (blogId) => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    try {
      setIsLiking((prev) => ({ ...prev, [blogId]: true }));

      await axiosInstance.post(`/blogs/${blogId}/like`);

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => {
          if (blog._id === blogId) {
            const wasLiked = likedBlogs.includes(blogId);
            return {
              ...blog,
              likes: wasLiked
                ? blog.likes.filter((id) => id !== user._id)
                : [...blog.likes, user._id],
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
      console.error("Like error:", err);
      if (err.response?.status === 401) {
        navigate("/auth/login");
      }
    } finally {
      setIsLiking((prev) => ({ ...prev, [blogId]: false }));
    }
  };

  // Add this function to handle category selection
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  // Loading skeleton
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
        >
          <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
            </div>
            <div className="flex justify-between mt-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-10"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-10"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchBlogs}
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primaryDark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Our Featured Blogs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the latest articles and insights from our community
          </p>
        </div>

        <div className="mb-8 w-full mx-auto">
          <div className="flex items-center flex-row gap-2 md:gap-4 justify-between pb-4 border-b ">
            <div className="relative w-full md:w-auto md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                className="block w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category Dropdown */}
            <div className="relative w-max md:w-auto">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full md:w-auto flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span>{activeCategory}</span>
                {isCategoryDropdownOpen ? (
                  <FaChevronUp className="ml-2" />
                ) : (
                  <FaChevronDown className="ml-2" />
                )}
              </button>
              
              {isCategoryDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        activeCategory === category
                          ? "bg-primary text-white hover:bg-primaryDark"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          renderSkeletons()
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              No articles found matching your criteria
            </h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setSortOption("newest");
                setPage(1);
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
                          src={`${import.meta.env.VITE_API_URL}/${
                            blog.featuredImage[0]
                          }`}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="top-4 left-4">
                      <span className="px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                        {blog.categories[0] || "Uncategorized"}
                      </span>
                      <div className="flex items-center">
                        <FaRegClock className="mr-1" />
                        <span>{blog.readTime} min read</span>
                      </div>
                    </div>
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
                      <Link className="text-black underline flex items-center" to={`/blog/${blog.slug}`}>
                        Read more <FaAngleRight className="ml-1" />
                      </Link>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleLike(blog._id);
                          }}
                          disabled={isLiking[blog._id]}
                          className="flex items-center hover:text-primary-500 transition-colors disabled:opacity-50"
                          aria-label={
                            likedBlogs.includes(blog._id) ? "Unlike" : "Like"
                          }
                        >
                          {likedBlogs.includes(blog._id) ? (
                            <FaHeart className="text-red-500 mr-1" />
                          ) : (
                            <FaRegHeart className="mr-1" />
                          )}
                          <span>{blog.likes?.length || 0}</span>
                        </button>

                        <div className="flex items-center">
                          <FaRegComment className="mr-1" />
                          <span>{blog.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {blog.author && (
                        <div className="flex items-center">
                          <img
                            src={`${import.meta.env.VITE_API_URL}/${
                              blog.author.profilePicture
                            }`}
                            alt={blog.author.name}
                            className="w-8 h-8 rounded-full object-cover mr-2"
                            loading="lazy"
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

                  {totalPages > 5 && page < totalPages - 2 && (
                    <span className="px-2">...</span>
                  )}

                  {totalPages > 5 && page < totalPages - 2 && (
                    <button
                      onClick={() => setPage(totalPages)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {totalPages}
                    </button>
                  )}

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
