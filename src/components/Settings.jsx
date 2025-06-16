// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import {
  updateStudent,
  updateInstructor,
  updateAdmin,
  updateStudentPassword,
  updateInstructorPassword,
  updateAdminPassword,
  checkPromotedUser,
  promoteUser,
} from "../utils/authService";
import { toast } from "react-toastify";
import { FiArrowDown } from "react-icons/fi";

export default function AccountSettings() {
  const [account, setAccount] = useState({
    first_name: localStorage.getItem("first_name") || "",
    middle_name: localStorage.getItem("middle_name") || "",
    last_name: localStorage.getItem("last_name") || "",
    student_id_number: localStorage.getItem("student_id_number") || "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPromotedUser, setIsPromotedUser] = useState(false);
  const [originalRole, setOriginalRole] = useState(null);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const isStudent = role === "student";
  const isAdmin = role === "admin";
  const [showDemoteModal, setShowDemoteModal] = useState(false);

  useEffect(() => {
    // Initialize email from localStorage if available
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setAccount((prev) => ({ ...prev, email: storedEmail }));
    }

    // Check if current admin was promoted from instructor
    if (isAdmin) {
      checkIfPromotedUser();
    }
  }, []);

  const checkIfPromotedUser = async () => {
    try {
      const response = await checkPromotedUser(userId);
      if (response.success && response.data) {
        setIsPromotedUser(true);
        setOriginalRole(response.data.data); // This will be "instructor"
      }
    } catch (error) {
      console.error("Error checking promoted user:", error);
    }
  };

  const handleDemote = async () => {
    setIsLoading(true);
    try {
      const response = await promoteUser(userId, originalRole);
      if (response.success) {
        toast.success("You have been demoted back to instructor");
        // Update local storage and reload
        localStorage.setItem("role", originalRole);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(response.data || "Failed to demote user");
      }
    } catch (error) {
      console.error("Demote error:", error);
      toast.error("Failed to demote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          account.first_name,
          account.middle_name,
          account.last_name,
          account.student_id_number
        );
      } else if (isAdmin) {
        response = await updateAdmin(userId, {
          first_name: account.first_name,
          middle_name: account.middle_name,
          last_name: account.last_name,
          email: account.email,
        });
      } else {
        response = await updateInstructor(userId, {
          first_name: account.first_name,
          middle_name: account.middle_name,
          last_name: account.last_name,
          email: account.email,
        });
      }

      if (response.success) {
        // Update localStorage with new values
        localStorage.setItem("first_name", account.first_name);
        localStorage.setItem("middle_name", account.middle_name);
        localStorage.setItem("last_name", account.last_name);
        localStorage.setItem("student_id_number", account.student_id_number || 0);
        localStorage.setItem("email", account.email);

        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("1Failed to update profile. Please try again.");
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

        {/* Demote Section for Promoted Admins */}
        {isAdmin && isPromotedUser && originalRole === "instructor" && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Demote Account
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                You can demote yourself back to{" "}
                <span className="font-medium">{originalRole}</span>.
              </p>
            </div>
            <div className="p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDemoteModal(true)}
                  className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : `Demote to ${originalRole}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Demote Confirmation Modal */}
        {showDemoteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                    <FiArrowDown className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                    Confirm Demotion
                  </h3>
                  <div className="mt-2 text-sm text-gray-500 text-center">
                    <p>
                      Are you sure you want to demote yourself back to{" "}
                      <span className="font-semibold">{originalRole}</span>?
                    </p>
                    <p className="mt-1">
                      This will remove your administrator privileges.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDemoteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDemoteModal(false);
                      handleDemote();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Confirm Demote
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={account.first_name}
                  onChange={handleAccountChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="middle_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Middle Name
                </label>
                <input
                  id="middle_name"
                  name="middle_name"
                  type="text"
                  value={account.middle_name}
                  onChange={handleAccountChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

                  <div>
                <label
                  htmlFor="middle_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Middle Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={account.last_name}
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
