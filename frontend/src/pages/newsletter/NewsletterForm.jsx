import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function NewsletterForm({
  mode = "create",
  newsletterId,
  onClose,
  onUpdate,
}) {
  const initialNewsletterData = {
    subject: "",
    content: "",
    scheduledAt: "",
  };

  const [newsletterData, setNewsletterData] = useState(initialNewsletterData);
  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [error, setError] = useState(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "link",
    "image",
  ];

  useEffect(() => {
    // Reset form when mode or newsletterId changes
    setNewsletterData(initialNewsletterData);
    setEditorContent("");
    setError(null);

    if (mode === "edit" && newsletterId) {
      const fetchNewsletter = async () => {
        try {
          setLoading(true);
          const res = await axiosInstance.get(`/newsletters/${newsletterId}`);
          const newsletter = res.data;

          setNewsletterData({
            subject: newsletter.subject || "",
            content: newsletter.content || "",
            scheduledAt: newsletter.scheduledAt
              ? new Date(newsletter.scheduledAt).toISOString().slice(0, 16)
              : "",
          });

          setEditorContent(newsletter.content || "");
        } catch (error) {
          setError(
            error.response?.data?.message || "Error fetching newsletter"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchNewsletter();
    }
  }, [mode, newsletterId]);

  const handleChange = (e) => {
    setNewsletterData({ ...newsletterData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content) => {
    setEditorContent(content);
    setNewsletterData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e, sendImmediately = false) => {
    e.preventDefault();

    try {
      const payload = {
        subject: newsletterData.subject,
        content: newsletterData.content,
        scheduledAt: newsletterData.scheduledAt || null,
      };

      if (mode === "create") {
        if (sendImmediately) {
          setSendLoading(true);
          await axiosInstance.post(`/newsletters/create-and-send`, payload);
        } else {
          setLoading(true);
          await axiosInstance.post(`/newsletters`, payload);
        }
      } else {
        setLoading(true);
        await axiosInstance.put(`/newsletters/${newsletterId}`, payload);
      }

      onUpdate();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Error saving newsletter");
    } finally {
      setLoading(false);
      setSendLoading(false);
    }
  };

  const handleFormReset = () => {
    onClose();
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="p-4 w-[94vw] sm:w-[60vw] lg:w-[50vw] bg-white dark:bg-darkCard rounded-md">
      <h2 className="text-xl mb-4">
        {mode === "create" ? "Create Newsletter" : "Edit Newsletter"}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-green-100">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            placeholder="Monthly Newsletter"
            value={newsletterData.subject}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-green-100">
            Content
          </label>
          <div className=" dark:bg-darkBg dark:border-gray-700">
            <ReactQuill
              value={editorContent}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              theme="snow"
              style={{ minHeight: "200px" }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-green-100">
            Schedule (optional)
          </label>
          <input
            type="datetime-local"
            name="scheduledAt"
            value={newsletterData.scheduledAt}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="bg-gray-400 px-4 py-2 rounded text-white"
            onClick={handleFormReset}
          >
            Cancel
          </button>
          {mode === "create" && (
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className={`bg-ternary px-4 py-2 rounded text-white ${
                sendLoading ? "opacity-50" : ""
              }`}
              disabled={sendLoading || loading}
            >
              {sendLoading ? "Sending..." : "Create & Send"}
            </button>
          )}
          <button
            type="submit"
            className={`bg-primary px-4 py-2 rounded text-white ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading || sendLoading}
          >
            {loading
              ? "Saving..."
              : mode === "create"
              ? "Save Draft"
              : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
