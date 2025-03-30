import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/api";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    topic: "",
    inquiryType: "",
    message: "",
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      setError("You must accept the terms.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosInstance.post("/contact", formData);
      setSuccess(response.data.message);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        topic: "",
        inquiryType: "",
        message: "",
        acceptTerms: false,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 space-y-4 py-8">
      <h2 className="text-2xl font-semibold text-center">Get in Touch</h2>
      <p className="text-center text-gray-600">
        We'd love to hear from you! Reach out today.
      </p>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-1/2 p-2 border rounded"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-1/2 p-2 border rounded"
            required
          />
        </div>

        <div className="flex gap-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-1/2 p-2 border rounded"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-1/2 p-2 border rounded"
            required
          />
        </div>

        <div className="space-y-2">
          <p className="font-medium">What would you like to discuss?</p>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="partnership"
                name="topic"
                value="Partnership"
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label htmlFor="partnership">Partnership Opportunity</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="venueListing"
                name="topic"
                value="Venue Listing"
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label htmlFor="venueListing">I want to get my venue listed</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="general"
                name="topic"
                value="General"
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label htmlFor="general">General Question</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="other"
                name="topic"
                value="Other"
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label htmlFor="other">Other Inquiry</label>
            </div>
          </div>
        </div>

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Type your message..."
          className="w-full p-2 border rounded h-28"
          required
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="mr-2"
            required
          />
          <label>I accept the Terms</label>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
