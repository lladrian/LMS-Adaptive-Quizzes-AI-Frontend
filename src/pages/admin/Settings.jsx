// src/pages/Settings.jsx
import React, { useState } from "react";
import AdminLayout from "../../pages/layouts/AdminLayout";

export default function AccountSettings() {
  const [account, setAccount] = useState({
    username: "johndoe",
    email: "john@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessions, setSessions] = useState([
    { id: 1, device: "MacBook Pro", browser: "Chrome", location: "New York, USA", lastActive: "2 hours ago", current: true },
    { id: 2, device: "iPhone 12", browser: "Safari", location: "Chicago, USA", lastActive: "5 days ago", current: false }
  ]);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccount(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Password change logic here
    alert("Password changed successfully!");
    setAccount(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  const revokeSession = (id) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  };

  return (
    <AdminLayout>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage your account information and security settings
            </p>
          </div>

          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your account's profile information
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <img 
                    className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" 
                    src={account.avatar} 
                    alt="User avatar" 
                  />
                  <button className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Change avatar
                  </button>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={account.username}
                    onChange={handleAccountChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={account.email}
                    onChange={handleAccountChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200">
                  Save changes
                </button>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Ensure your account is using a strong password
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={account.currentPassword}
                  onChange={handleAccountChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={account.newPassword}
                  onChange={handleAccountChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Enter new password"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={account.confirmPassword}
                  onChange={handleAccountChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
                  disabled={!account.currentPassword || !account.newPassword || account.newPassword !== account.confirmPassword}
                >
                  Update password
                </button>
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your account security settings
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Two-factor authentication</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button
                  onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${twoFactorAuth ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 py-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Active sessions</h3>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${session.current ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {session.device.includes("iPhone") ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            )}
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {session.device} • {session.browser}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {session.location} • Last active {session.lastActive}
                            {session.current && <span className="ml-2 text-indigo-600 dark:text-indigo-400">Current session</span>}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <button 
                          onClick={() => revokeSession(session.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-red-200 dark:border-red-900/50">
            <div className="px-6 py-5 border-b border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Danger Zone</h2>
              <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                These actions are irreversible - proceed with caution
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Delete account</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20 font-medium rounded-lg transition-colors duration-200">
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}