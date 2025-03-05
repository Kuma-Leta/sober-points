import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/api";

export default function CompanyForm({
  mode = "create",
  companyId,
  onClose,
  onUpdate,
}) {
  const [companyData, setCompanyData] = useState({
    name: "",
    industry: "",
    subscriptionType: "Free",
    markup: 1.0,
    surcharge: 0.0,
    exchangeRates: 1.0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode === "edit" && companyId) {
      const fetchCompany = async () => {
        try {
          setLoading(true);
          const res = await axiosInstance.get(`/companies/${companyId}`);
          setCompanyData(res.data);
        } catch (error) {
          setError(error.response?.data?.message || "Error fetching company");
        } finally {
          setLoading(false);
        }
      };
      fetchCompany();
    }
  }, [mode, companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        await axiosInstance.post(`/companies`, companyData);
      } else {
        await axiosInstance.put(`/companies/${companyId}`, companyData);
      }
      onUpdate();
      handleFormReset();
    } catch (error) {
      setError(error.response?.data?.message || "Error saving company");
    } finally {
      setLoading(false);
    }
  };

  const handleFormReset = () => {
    setCompanyData({
      name: "",
      industry: "",
      subscriptionType: "Free",
      markup: 1.0,
      surcharge: 0.0,
      exchangeRates: 1.0,
      isActive: true,
    });
    setError(null);
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
    <div className="p-4 w-[94vw] sm:w-[60vw] lg:w-[50vw] dark:bg-darkCard bg-white rounded-md">
      <h2 className="text-xl mb-4">
        {mode === "create" ? "Add New Company" : "Edit Company"}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={companyData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700 "
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            Industry
          </label>
          <input
            type="text"
            name="industry"
            value={companyData.industry}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700 "
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            Subscription Type
          </label>
          <select
            name="subscriptionType"
            value={companyData.subscriptionType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700 "
            required
          >
            <option value="Free">Free</option>
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">
              Markup
            </label>
            <input
              type="number"
              name="markup"
              step="0.01"
              value={companyData.markup}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700 "
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">
              Surcharge
            </label>
            <input
              type="number"
              name="surcharge"
              step="0.01"
              value={companyData.surcharge}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700 "
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">
              Exchange Rates
            </label>
            <input
              type="number"
              name="exchangeRates"
              step="0.01"
              value={companyData.exchangeRates}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700 "
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">
              <input
                type="checkbox"
                name="isActive"
                checked={companyData.isActive}
                onChange={(e) =>
                  setCompanyData({ ...companyData, isActive: e.target.checked })
                }
                className="mr-2"
              />
              Active
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-400 px-4 py-2 mr-2 rounded text-white"
            onClick={handleFormReset}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-primary px-4 py-2 rounded text-white ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
