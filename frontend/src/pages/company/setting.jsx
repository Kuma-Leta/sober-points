import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api";
import { useSelector } from "react-redux";
import { API_URL } from "../../constants/url";

export default function Setting() {
  const user = useSelector((state) => state.auth.user);
  const companyId = user?.company._id;
  const [companyData, setCompanyData] = useState({
    name: "",
    industry: "",
    subscriptionType: "Free",
    markup: 1.0,
    surcharge: 0.0,
    exchangeRates: 1.0,
    isActive: true,
    logo: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/companies/${companyId}`);
        setCompanyData(res.data);
        setLogoPreview(API_URL + "/" + res.data.logo);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message || "Error fetching company settings"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      console.log(companyId);
      fetchCompany();
    }
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyData({ ...companyData, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(companyData).forEach((key) => {
        formData.append(key, companyData[key]);
      });

      await axiosInstance.put(`/companies/${companyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Settings updated successfully");

      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error updating settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-darkCard shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Company Settings</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center w-min flex justify-center mx-auto">
          <label htmlFor="logoUpload" className="cursor-pointer w-max">
            <div className="w-24 h-24 mx-auto border rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 dark:text-gray-50">Upload Logo</span>
              )}
            </div>
            <input
              type="file"
              id="logoUpload"
              className="hidden"
              onChange={handleLogoChange}
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-100 font-medium">
            Company Name
          </label>
          <input
            type="text"
            name="name"
            value={companyData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:border-gray-700 dark:bg-darkBg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium dark:text-gray-100">Industry</label>
          <input
            type="text"
            name="industry"
            value={companyData.industry}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:border-gray-700 dark:bg-darkBg"
          />
        </div>
        <div>
          <label className="block text-gray-700  dark:text-gray-100 font-medium">
            Subscription Type
          </label>
          <select
            disabled
            name="subscriptionType"
            value={companyData.subscriptionType}
            onChange={handleChange}
            className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-darkBg dark:text-gray-100 rounded-lg"
          >
            <option value="Free">Free</option>
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-100 font-medium">
              Markup (%)
            </label>
            <input
              type="number"
              name="markup"
              step="0.01"
              value={companyData.markup}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:border-gray-700 dark:bg-darkBg"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-100 font-medium">
              Surcharge (%)
            </label>
            <input
              type="number"
              name="surcharge"
              step="0.01"
              value={companyData.surcharge}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:border-gray-700 dark:bg-darkBg"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-100 font-medium">
              Exchange Rate
            </label>
            <input
              type="number"
              name="exchangeRates"
              step="0.01"
              value={companyData.exchangeRates}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:border-gray-700 dark:bg-darkBg"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className={`bg-primary text-white  px-6 py-2 rounded-lg ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
