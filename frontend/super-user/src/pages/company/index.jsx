import React, { useEffect, useState } from "react";
import CompanyForm from "./form";
import axiosInstance from "../../api/api";
import Table from "../../ui/table";
import Modal from "../../ui/modal";
import Pagination from "../../ui/pagination";
import Search from "../../components/search";
import { FaEdit, FaEye, FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function Companies() {
  const columns = [
    "NAME",
    "INDUSTRY",
    "SUBSCRIPTION",
    "USERS",
    "STATUS",
    "ACTION",
  ];
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/companies`, {
          params: { page, limit, q: query },
        });
        setCompanies(res.data.companies);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching companies");
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [page, query, limit]);

  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/companies/${confirmDelete}`);
        setCompanies(
          companies.filter((company) => company._id !== confirmDelete)
        );
        setConfirmDelete(null);
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    }
  };

  const handleEdit = (companyId) => {
    setSelectedCompanyId(companyId);
  };

  const handleCloseModal = () => {
    setSelectedCompanyId(null);
    setIsCreating(false);
    setConfirmDelete(null);
  };

  const handleUpdate = async () => {
    const res = await axiosInstance.get(`/companies`, {
      params: { page, limit, q: query },
    });
    setCompanies(res.data.companies);
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const mappedCompanies = companies.map((company) => ({
    NAME: <div className="min-w-max">{company.name}</div>,
    INDUSTRY: company.industry || "-",
    SUBSCRIPTION: company.subscriptionType,
    STATUS: (
      <span className="flex items-center">
        <span
          className={`inline-block h-3 w-3 rounded-full mr-2 ${
            company.isActive ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        {company.isActive ? "Active" : "Inactive"}
      </span>
    ),
    USERS: company.usersCount,
    ACTION: (
      <Action
        companyId={company._id}
        onDelete={() => setConfirmDelete(company._id)}
        onEdit={handleEdit}
      />
    ),
  }));

  const handleCreate = () => {
    setIsCreating(true);
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center mb-4 justify-between">
        <Search setQuery={handleSearchChange} />
        <button
          onClick={handleCreate}
          className="bg-ternary h-min text-white px-4 py-2 rounded"
        >
          Add Company
        </button>
      </div>

      <Table
        error={error}
        loading={loading}
        data={mappedCompanies}
        columns={columns}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal
        isOpen={isCreating || selectedCompanyId !== null}
        onClose={handleCloseModal}
      >
        <CompanyForm
          mode={isCreating ? "create" : "edit"}
          companyId={selectedCompanyId}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      </Modal>

      <Modal isOpen={confirmDelete !== null} onClose={handleCloseModal}>
        <div className="p-8 rounded bg-white">
          <p>Are you sure you want to delete this company?</p>
          <div className="flex justify-end space-x-4 mt-4">
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
    </div>
  );
}

const Action = ({ companyId, onDelete, onEdit }) => (
  <div className="flex items-left gap-3 justify-start mx-auto">
    <FaRegTrashAlt
      onClick={onDelete}
      className="cursor-pointer text-red-500 hover:text-red-700"
    />
    <FaEdit
      onClick={() => onEdit(companyId)}
      className="cursor-pointer text-ternary hover:text-primary"
    />
    <Link
      to={`/companies/${companyId}`}
      className="cursor-pointer text-ternary"
    >
      <FaEye className="cursor-pointer text-ternary hover:text-primary" />
    </Link>
  </div>
);
