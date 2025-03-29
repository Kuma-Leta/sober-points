import React, { useEffect, useState } from "react";
import NewsletterForm from "./NewsletterForm";
import ContentPreview from "./ContentPreview";
import axiosInstance from "../../api/api";
import Table from "../../ui/table";
import Modal from "../../ui/modal";
import { FaEdit, FaRegTrashAlt, FaPaperPlane } from "react-icons/fa";
import Pagination from "../../ui/pagination";

export default function NewsletterManager() {
  const columns = ["SUBJECT", "CONTENT", "STATUS", "RECIPIENTS", "ACTION"];

  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [confirmSend, setConfirmSend] = useState(null);
  const [newsletterToSend, setNewsletterToSend] = useState(null);

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/newsletters`, {
        params: { page, limit, q: query },
      });

      // Update to match your API response structure
      setNewsletters(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching newsletters");
      setNewsletters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, [page, query, limit]);

  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/newsletters/${confirmDelete}`);
        await fetchNewsletters();
        setConfirmDelete(null);
      } catch (error) {
        setError(error.response?.data?.message || "Error deleting newsletter");
      }
    }
  };

  const handleSendConfirmation = (id) => {
    setNewsletterToSend(id); // Show the confirmation modal
  };

  const handleSend = async () => {
    if (newsletterToSend) {
      try {
        await axiosInstance.post(`/newsletters/${newsletterToSend}/send`);
        await fetchNewsletters();
        setNewsletterToSend(null); // Close modal after sending
      } catch (error) {
        setError(error.response?.data?.message || "Error sending newsletter");
      }
    }
  };

  const handleEdit = (id) => {
    setSelectedId(id);
  };

  const handleCloseModal = () => {
    setSelectedId(null);
    setIsCreating(false);
    setConfirmDelete(null);
    setNewsletterToSend(null);
  };
  const handleUpdate = () => {
    fetchNewsletters();
  };

  const [mappedNewsletters, setMappedNewsletters] = useState([]);
  useEffect(() => {
    const mapped = newsletters.map((newsletter) => ({
      SUBJECT: newsletter.subject,
      STATUS: (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            newsletter.status === "sent"
              ? "bg-green-100 text-green-800"
              : newsletter.status === "scheduled"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {newsletter.status?.toUpperCase() || "DRAFT"}
        </span>
      ),
      CONTENT: <ContentPreview content={newsletter.content} maxLength={150} />,
      RECIPIENTS: newsletter.recipients?.length || 0,
      ACTION: (
        <Action
          newsletterId={newsletter._id}
          status={newsletter.status}
          onDelete={() => setConfirmDelete(newsletter._id)}
          onEdit={handleEdit}
          onSend={() => handleSendConfirmation(newsletter._id)}
        />
      ),
    }));
    setMappedNewsletters(mapped);
  }, [newsletters]);
  const handleCreate = () => {
    setSelectedId(null); // Clear any selected ID
    setIsCreating(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Newsletter Management
        </h1>
        <button
          onClick={handleCreate}
          className="bg-primary h-min text-white px-4 py-2 rounded"
        >
          Create Newsletter
        </button>
      </div>

      <Table
        error={error}
        loading={loading}
        data={mappedNewsletters}
        columns={columns}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <Modal
        isOpen={isCreating || selectedId !== null}
        onClose={handleCloseModal}
      >
        <NewsletterForm
          mode={isCreating ? "create" : "edit"}
          newsletterId={selectedId}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      </Modal>

      <Modal isOpen={confirmDelete !== null} onClose={handleCloseModal}>
        <div className="p-8 dark:bg-darkCard rounded bg-white">
          <p>Are you sure you want to delete this newsletter?</p>
          <div className="flex justify-end space-x-4 mt-4 -lg">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Yes, Delete
            </button>
            <button
              onClick={handleCloseModal}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={newsletterToSend !== null} onClose={handleCloseModal}>
        <div className="p-8 dark:bg-darkCard rounded bg-white">
          <p>Are you sure you want to send this newsletter?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={handleSend}
              className="bg-ternary text-white px-4 py-2 rounded"
            >
              Yes, Send
            </button>
            <button
              onClick={handleCloseModal}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const Action = ({ newsletterId, status, onDelete, onEdit, onSend }) => {
  return (
    <div className="flex items-center gap-3 justify-center mx-auto">
      {status === "draft" && (
        <FaPaperPlane
          onClick={() => onSend(newsletterId)}
          className="cursor-pointer text-blue-500 hover:text-blue-700"
          title="Send"
        />
      )}
      <FaEdit
        onClick={() => onEdit(newsletterId)}
        className="cursor-pointer text-ternary hover:text-primary"
        title="Edit"
      />
      <FaRegTrashAlt
        onClick={onDelete}
        className="cursor-pointer text-red-500 hover:text-red-700"
        title="Delete"
      />
    </div>
  );
};
