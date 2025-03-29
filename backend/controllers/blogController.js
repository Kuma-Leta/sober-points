const Blog = require("../models/blog");
const APIfeatures = require("../utils/APIfeatures");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Multer configuration for blog images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/blog-images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
}).array("images", 5); // Allow up to 5 images

// Create a new blog post
exports.createBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { title, excerpt, content, categories, tags } = req.body;
      const author = req.user._id;

      // Calculate read time (approx 200 words per minute)
      const wordCount = content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);

      const images =
        req.files?.map((file) => `uploads/blog-images/${file.filename}`) || [];

      // Handle categories and tags parsing
      let parsedCategories = [];
      let parsedTags = [];

      try {
        parsedCategories = typeof categories === 'string' ? 
          (categories.startsWith('[') ? JSON.parse(categories) : categories.split(',').map(cat => cat.trim())) : 
          categories;
      } catch (e) {
        parsedCategories = categories.split(',').map(cat => cat.trim());
      }

      try {
        parsedTags = tags ? 
          (typeof tags === 'string' ? 
            (tags.startsWith('[') ? JSON.parse(tags) : tags.split(',').map(tag => tag.trim())) : 
            tags) : 
          [];
      } catch (e) {
        parsedTags = tags ? tags.split(',').map(tag => tag.trim()) : [];
      }

      const blog = new Blog({
        title,
        excerpt,
        content,
        categories: parsedCategories,
        tags: parsedTags,
        author,
        readTime,
        featuredImage: images[0] || "",
        images,
      });

      await blog.save();

      // Populate author info in response
      const populatedBlog = await Blog.findById(blog._id).populate(
        "author",
        "name profilePicture"
      );

      res.status(201).json({
        success: true,
        blog: populatedBlog,
      });
    } catch (error) {
      console.log(error);
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const filePath = path.join(
            __dirname,
            "../",
            `uploads/blog-images/${file.filename}`
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
};

// Get all blogs with filtering, sorting, pagination
exports.getAllBlogs = async (req, res) => {
  try {
    // Start with base query and populate author info
    let query = Blog.find()
      .populate("author", "name profilePicture")
      .populate("likes", "name profilePicture")
      .populate("comments.user", "name profilePicture");

    // Use APIfeatures for filtering, searching, etc.
    const features = new APIfeatures(query, req.query)
      .multfilter(["title", "excerpt", "content", "tags"])
      .filter()
      .sort()
      .limiting()
      .paginatinating();

    // Get total count for pagination
    const totalRecords = await Blog.countDocuments(features.query.getQuery());
    const blogs = await features.query;

    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      success: true,
      totalPages,
      totalRecords,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get featured blogs
exports.getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isFeatured: true })
      .populate("author", "name profilePicture")
      .limit(3)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("author", "name profilePicture")
      .populate("likes", "name profilePicture")
      .populate("comments.user", "name profilePicture");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { title, excerpt, content, categories, tags } = req.body;
      const blogId = req.params.id;

      // Find existing blog
      const existingBlog = await Blog.findById(blogId);
      if (!existingBlog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      // Check if user is author or admin
      if (
        existingBlog.author.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this blog",
        });
      }

      // Calculate new read time if content changed
      let readTime = existingBlog.readTime;
      if (content && content !== existingBlog.content) {
        const wordCount = content.split(/\s+/).length;
        readTime = Math.ceil(wordCount / 200);
      }

      // Handle images - keep existing if no new ones uploaded
      let images = existingBlog.featuredImage || [];
      if (req.files && req.files.length > 0) {
        // Delete old images if they're being replaced
        if (existingBlog.featuredImage && existingBlog.featuredImage.length > 0) {
          existingBlog.featuredImage.forEach((image) => {
            const filePath = path.join(__dirname, "../", image);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
        }

        images = req.files.map(
          (file) => `uploads/blog-images/${file.filename}`
        );
      }

      const updateData = {
        title: title || existingBlog.title,
        excerpt: excerpt || existingBlog.excerpt,
        content: content || existingBlog.content,
        categories: categories ? 
          (typeof categories === 'string' ? 
            (categories.startsWith('[') ? JSON.parse(categories) : categories.split(',').map(cat => cat.trim())) : 
            categories) : 
          existingBlog.categories,
        tags: tags ? 
          (typeof tags === 'string' ? 
            (tags.startsWith('[') ? JSON.parse(tags) : tags.split(',').map(tag => tag.trim())) : 
            tags) : 
          existingBlog.tags,
        readTime,
        featuredImage: images && images.length > 0 ? [...(existingBlog.featuredImage || []), ...images] : (existingBlog.featuredImage || []),
        images: images && images.length > 0 ? images : (existingBlog.images || []),
        updatedAt: Date.now(),
      };

      const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
        new: true,
        runValidators: true,
      }).populate("author", "name profilePicture");

      res.status(200).json({
        success: true,
        blog: updatedBlog,
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if user is author or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this blog",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Like/unlike a blog
exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const userId = req.user._id;
    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Like the blog
      blog.likes.push(userId);
    } else {
      // Unlike the blog
      blog.likes.splice(likeIndex, 1);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      likes: blog.likes.length,
      isLiked: likeIndex === -1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comment = {
      user: req.user._id,
      text,
    };

    blog.comments.push(comment);
    await blog.save();

    // Populate the user info in the response
    const populatedBlog = await Blog.findById(blog._id).populate(
      "comments.user",
      "name profilePicture"
    );

    const newComment =
      populatedBlog.comments[populatedBlog.comments.length - 1];

    res.status(201).json({
      success: true,
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const commentIndex = blog.comments.findIndex(
      (comment) => comment._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user is comment author or admin
    const comment = blog.comments[commentIndex];
    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    blog.comments.splice(commentIndex, 1);
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get blogs by category
exports.getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    let query = Blog.find({ categories: category }).populate(
      "author",
      "name profilePicture"
    );

    const features = new APIfeatures(query, req.query)
      .sort()
      .limiting()
      .paginatinating();

    const totalRecords = await Blog.countDocuments({ categories: category });
    const blogs = await features.query;

    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      success: true,
      category,
      totalPages,
      totalRecords,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get blogs by author
exports.getBlogsByAuthor = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    let query = Blog.find({ author: authorId }).populate(
      "author",
      "name profilePicture"
    );

    const features = new APIfeatures(query, req.query)
      .sort()
      .limiting()
      .paginatinating();

    const totalRecords = await Blog.countDocuments({ author: authorId });
    const blogs = await features.query;

    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      success: true,
      totalPages,
      totalRecords,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
