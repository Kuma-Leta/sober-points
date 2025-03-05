import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/api";
import { useParams } from "react-router-dom";
import Users from "../users";
export default function CompanyDetail() {
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/companies/${companyId}`);
        setCompanyData(res.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Error fetching company details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompany();
    }
  }, [companyId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {" "}
      <div className="p-4 my-10 bg-white dark:bg-darkCard rounded-md">
        {companyData && (
          <>
            <h2 className="text-2xl font-bold mb-4">{companyData.name}</h2>
            <div className="mb-2">
              <strong>Industry:</strong> {companyData.industry || "N/A"}
            </div>
            <div className="mb-2">
              <strong>Subscription Type:</strong> {companyData.subscriptionType}
            </div>
            <div className="mb-2 gap-2 flex">
              <strong>Status: </strong>
              <span className="flex items-center">
                <span
                  className={`inline-block h-3 w-3 rounded-full ${
                    companyData.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                {companyData.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mb-2">
              <strong>Users: </strong> {companyData.usersCount}
            </div>
          </>
        )}
      </div>
      <Users companyId={companyId} />
    </div>
  );
}
