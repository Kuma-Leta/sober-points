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

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  // Fetch analytics data from the backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get("/venues/admin/analytics");
        console.log("API Response:", response); // Log the entire response
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
    return <div className="text-center mt-20">Loading...</div>;
  }

  // Data for charts
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

  // Colors for charts
  const COLORS = ["#10B981", "#3B82F6", "#EF4444"]; // Green, Blue, Red

  return (
    <div className="p-4 mt-14 bg-gray-100 dark:bg-darkBg min-h-screen">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 dark:bg-darkBg sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Venues */}
        <div className="bg-white p-6 rounded-lg dark:bg-darkBg shadow-md">
          <div className="flex items-center dark:bg-darkBg space-x-4">
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
        <div className="bg-white p-6 dark:bg-darkBg rounded-lg shadow-md">
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
        <div className="bg-white p-6 dark:bg-darkBg dark:bg-darkBg rounded-lg shadow-md">
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
        <div className="bg-white p-6 dark:bg-darkBg rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaStar className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-gray-600 dark:bg-darkBg">Avg. Venue Rating</p>
              <p className="text-2xl font-bold">
                {analytics.venueAnalytics.averageRating}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 dark:bg-darkBg lg:grid-cols-2 gap-6">
        {/* Venue Status Breakdown (Pie Chart) */}
        <div className="bg-white p-6 dark:bg-darkBg rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Venue Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            {" "}
            {/* Reduced height */}
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
        <div className="bg-white p-6 dark:bg-darkBg rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Role Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            {" "}
            {/* Reduced height */}
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
