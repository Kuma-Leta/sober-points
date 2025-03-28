import React, { useEffect, useState } from "react";
import { FaUsers, FaMapMarkerAlt, FaStar, FaChartLine } from "react-icons/fa";
import axiosInstance from "../../api/api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SkeletonLoader = () => {
  return (
    <div className="p-4 mt-14 dark:bg-darkBg min-h-screen">
      {/* Skeleton for Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Skeleton for Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-md"
            >
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4"></div>
              <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get("/venues/admin/analytics");
        console.log("API Response:", response);
        const data = response.data;
        if (data.success) {
          setAnalytics(data.data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics) {
    return <SkeletonLoader />;
  }

  const venueStatusData = analytics.venueAnalytics.venueStatusBreakdown.map(
    (item) => ({
      name: item.status,
      value: item.count,
    })
  );

  const userRoleData = analytics.userAnalytics.userRoleBreakdown.map(
    (item) => ({
      name: item.role,
      value: item.count,
    })
  );

  const COLORS = ["#10B981", "#3B82F6", "#EF4444"];

  return (
    <div className="p-4 mt-14 dark:bg-darkBg min-h-screen">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Venues */}
        <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-600">Total Venues</p>
              <p className="text-2xl font-bold">
                {analytics.venueAnalytics.totalVenues}
              </p>
            </div>
          </div>
        </div>

        {/* New Venues (Last 30 Days) */}
        <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaChartLine className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-600">New Venues (30 Days)</p>
              <p className="text-2xl font-bold">
                {analytics.venueAnalytics.newVenuesLast30Days}
              </p>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaUsers className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">
                {analytics.userAnalytics.totalUsers}
              </p>
            </div>
          </div>
        </div>

        {/* Average Venue Rating */}
        <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaStar className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-gray-600">Avg. Venue Rating</p>
              <p className="text-2xl font-bold">
                {analytics.venueAnalytics.averageRating}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Venue Status Breakdown (Pie Chart) */}
        <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Venue Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={venueStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {venueStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Role Breakdown (Bar Chart) */}
        <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Role Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userRoleData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
