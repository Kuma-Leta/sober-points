import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/api";
import {
  FaRegClock,
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { motion } from "framer-motion";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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
        const response = await axiosInstance.get(`/blogs`);

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
  }, [searchQuery, categoryFilter, sortOption, page]);

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
      console.error("Error liking blog:", err);
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
        {/* Header and Filters */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Our Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the latest stories, tips, and insights about nightlife and
            entertainment
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search blogs..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="appearance-none block pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <select
              className="block px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              No blogs found matching your criteria
            </h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("All");
                setSortOption("newest");
              }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark"
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
                      <img
                        src={`http://localhost:5000/${blog.featuredImage}`}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
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

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
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
                          {likedBlogs.includes(blog._id) ? (
                            <FaHeart className="text-red-500 mr-1" />
                          ) : (
                            <FaRegHeart className="mr-1" />
                          )}
                          <span>{blog.likes}</span>
                        </button>

                        <div className="flex items-center">
                          <FaRegComment className="mr-1" />
                          <span>{blog.comments.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
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
                        className={`px-4 py-2 rounded-lg ${
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
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
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
