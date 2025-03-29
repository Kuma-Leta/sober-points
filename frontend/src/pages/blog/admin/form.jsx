import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import axiosInstance from "../../../api/api";

const BlogForm = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const isEditMode = Boolean(slug);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    categories: [],
    tags: "",
    isFeatured: false,
    images: [],
  });
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState([]);

  const categories = ["Nightlife", "Food", "Culture", "Wellness", "Travel"];

  useEffect(() => {
    if (isEditMode) {
      fetchBlogData();
    }
  }, [slug]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/blogs/${slug}`);
      const blog = response.data.blog;
      setId(blog._id);
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        categories: blog.categories,
        tags: blog.tags.join(", "),
        isFeatured: blog.isFeatured,
        images: [],
      });
      setImagePreview(blog.featuredImage || []);
    } catch (error) {
      setError("Failed to fetch blog data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formDataToSend = new FormData();

    // Append all non-file fields
    Object.keys(formData).forEach((key) => {
      if (key === "tags") {
        const tags = formData.tags.split(",").map((tag) => tag.trim());
        formDataToSend.append("tags", JSON.stringify(tags));
      } else if (key !== "images") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append files
    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditMode) {
        await axiosInstance.put(`/blogs/${id}`, formDataToSend, config);
      } else {
        await axiosInstance.post("/blogs", formDataToSend, config);
      }
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.response?.data?.message || "Failed to save blog post");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows="10"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categories
          </label>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    formData.categories.includes(category)
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              className="h-5 w-5 text-primary rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Feature this post
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Images
          </label>
          <div className="flex flex-wrap gap-4 mb-4">
            {imagePreview.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={
                    url.startsWith("http")
                      ? url
                      : `${import.meta.env.VITE_API_URL}/${url}`
                  }
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
              <MdCloudUpload className="w-8 h-8" />
              <span className="mt-2 text-sm">
                Click or drag images to upload
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
