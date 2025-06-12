// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import {
  updateStudent,
  updateInstructor,
  updateStudentPassword,
  updateInstructorPassword,
  updateAdmin,
  updateAdminPassword,
} from "../utils/authService";
import { toast } from "react-toastify";

export default function AccountSettings() {
  const [account, setAccount] = useState({
    fullname: localStorage.getItem("fullname") || "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const isStudent = role === "student";
  const isAdmin = role === "admin";

  useEffect(() => {
    // Initialize email from localStorage if available
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setAccount((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (isStudent) {
        response = await updateStudent(
          userId,
          account.email,
          account.fullname,
          localStorage.getItem("student_id_number") || ""
        );
      } else if (isAdmin) {
        response = await updateAdmin(userId, {
          fullname: account.fullname,
          email: account.email,
        });
      } else {
        response = await updateInstructor(userId, {
          fullname: account.fullname,
          email: account.email,
        });
      }

      if (response.success) {
        // Update localStorage with new values
        localStorage.setItem("fullname", account.fullname);
        localStorage.setItem("email", account.email);

        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (account.newPassword !== account.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      let response;
      if (isStudent) {
        response = await updateStudentPassword(userId, account.newPassword);
      } else if (isAdmin) {
        response = await updateAdminPassword(userId, account.newPassword);
      } else {
        response = await updateInstructorPassword(userId, account.newPassword);
      }

      if (response.success) {
        toast.success("Password updated successfully!");
        setAccount((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        toast.error(response.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account information and security settings
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your account's profile information
            </p>
          </div>
          <form onSubmit={handleProfileSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={account.fullname}
                  onChange={handleAccountChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={account.email}
                  onChange={handleAccountChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Change Password
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Ensure your account is using a strong password
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={account.newPassword}
                onChange={handleAccountChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="Enter new password"
                required
                minLength={8}
              />
              <p className="mt-2 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={account.confirmPassword}
                onChange={handleAccountChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                disabled={
                  isLoading ||
                  !account.newPassword ||
                  account.newPassword !== account.confirmPassword ||
                  account.newPassword.length < 8
                }
              >
                {isLoading ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
