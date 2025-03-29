import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaRegClock, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';

const BlogListing = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Nightlife", "Food", "Culture", "Wellness", "Travel"];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const url = selectedCategory === 'all' 
          ? '/api/blogs'
          : `/api/blogs/category/${selectedCategory}`;
        
        const response = await axios.get(url);
        setBlogs(response.data.blogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover the latest stories, tips, and insights about travel and experiences
        </p>
      </div>

      {/* Categories Filter */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category.toLowerCase()
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              to={`/blog/${blog.slug}`}
              key={blog._id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                {blog.isFeatured && (
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                    Featured
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {blog.categories.map((category) => (
                    <span
                      key={category}
                      className="flex items-center text-sm text-primary dark:text-primaryLight"
                    >
                      <MdCategory className="mr-1" />
                      {category}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {blog.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center">
                      <FaRegClock className="mr-1" />
                      {blog.readTime} min read
                    </span>
                    <span className="flex items-center">
                      <FaRegHeart className="mr-1" />
                      {blog.likes.length}
                    </span>
                    <span className="flex items-center">
                      <FaRegComment className="mr-1" />
                      {blog.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogListing;
