import React, { useEffect, useState } from "react";
import UserForm from "./form";
import axiosInstance from "../../api/api";
import Table from "../../ui/table";
import Modal from "../../ui/modal";
import { getProfilePicUrl } from "../../utils/functions";
import { FaEdit, FaRegTrashAlt, FaSearch } from "react-icons/fa";
import Pagination from "../../ui/pagination";
import { useSelector } from "react-redux";

// const columns = ["NAME", "EMAIL", "STATUS", "ACTION"];
export default function Users({ role }) {
  const columns = ["PROFILE", "NAME", "EMAIL", "ROLE", "ACTION"];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(1); // Page state
  const [limit] = useState(10); // Items per page
  const [query, setQuery] = useState(""); // Search query
  const [totalPages, setTotalPages] = useState(1); // Total pages

  // Fetch users with pagination and search query
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/users/?`, {
          params: { page, limit, q: query }, // Pass page, limit, and search query
        });
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages); // Assuming API returns total pages
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching users");
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, query, limit]);

  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/users/${confirmDelete}`);
        setUsers(users.filter((user) => user._id !== confirmDelete));
        setConfirmDelete(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
    setIsCreating(false);
    setConfirmDelete(null);
  };

  const handleUpdate = async () => {
    const res = await axiosInstance.get(`/users`, {
      params: { page, limit, q: query },
    });
    setUsers(res.data.users);
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  const [mappedUsers, setMappedUsers] = useState([]);
  useEffect(() => {
    const mapped = users.map((user) => ({
      PROFILE: (
        <div className="w-full flex items-end justify-center">
          <img
            className="w-8 h-8 object-cover rounded-full"
            src={getProfilePicUrl(user.profilePicture)}
          />
        </div>
      ),
      NAME: user.name,
      EMAIL: user.email,
      ROLE: user.role,
      ACTION: (
        <Action
          userId={user._id}
          onDelete={() => setConfirmDelete(user._id)} // Set userId for deletion
          onEdit={handleEdit}
        />
      ),
    }));
    setMappedUsers(mapped);
    if (users.length > 0) {
      setError(null);
    }
  }, [users]);
  const handleCreate = () => {
    setIsCreating(true);
  };
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="w-full max-w-7xl mx-auto px-6  mt-20">
      <div className="flex gap-2 items-center mb-4 justify-between">
        <Search setQuery={handleSearchChange} />
        <button
          onClick={handleCreate}
          className="bg-ternary h-min text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>

      <Table
        error={error}
        loading={loading}
        data={mappedUsers}
        columns={columns}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)} // Update page on change
      />

      <Modal
        isOpen={isCreating || selectedUserId !== null}
        onClose={handleCloseModal}
      >
        <UserForm
          mode={isCreating ? "create" : "edit"}
          userId={selectedUserId}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      </Modal>

      <Modal isOpen={confirmDelete !== null} onClose={handleCloseModal}>
        <div className=" p-8 dark:bg-darkCard rounded bg-white">
          <p>Are you sure you want to delete this member?</p>
          <div className="flex justify-end space-x-4  mt-4 -lg">
            <button
              disabled={user?._id === confirmDelete}
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
    </div>
  );
}

const Action = ({ userId, onDelete, onEdit }) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div>
      <div className="flex items-center gap-3 justify-center mx-auto ">
        <FaRegTrashAlt
          onClick={onDelete}
          className="cursor-pointer text-red-500 hover:text-red-700"
        />
        <FaEdit
          onClick={() => {
            onEdit(userId);
          }}
          className=" cursor-pointer text-ternary hover:text-primary"
        />
      </div>
    </div>
  );
};

function Search({ setQuery, placeholder = "Search..." }) {
  return (
    <div className="relative min-w-[25%] dark:bg-darkCard">
      <input
        type="text"
        placeholder={placeholder}
        className="border w-full dark:border-gray-500 rounded dark:bg-darkCard px-4 py-2 pl-10" // Add left padding to make space for the icon
        onChange={setQuery}
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  );
}
