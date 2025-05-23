import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiUpload, 
  FiBook, 
  FiPlus, 
  FiLogOut,
  FiBarChart2,
  FiCalendar,
  FiMessageSquare,
  FiAlertCircle
} from 'react-icons/fi';

const InstructorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample data for dashboard overview
  const stats = [
    { title: 'Total Students', value: 142, change: '+12%', icon: FiUsers, color: 'text-indigo-600' },
    { title: 'Active Classes', value: 8, change: '+2', icon: FiBook, color: 'text-green-600' },
    { title: 'Materials Shared', value: 47, change: '+5', icon: FiUpload, color: 'text-blue-600' },
    { title: 'Pending Tasks', value: 3, change: '-2', icon: FiAlertCircle, color: 'text-yellow-600' },
  ];

  const recentActivities = [
    { id: 1, action: 'Uploaded new material', course: 'Math 101', time: '2 hours ago' },
    { id: 2, action: 'Added new student', course: 'Science 202', time: '5 hours ago' },
    { id: 3, action: 'Created new assignment', course: 'History 301', time: '1 day ago' },
    { id: 4, action: 'Graded submissions', course: 'English 102', time: '2 days ago' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Faculty Meeting', date: 'Tomorrow, 10:00 AM' },
    { id: 2, title: 'Parent-Teacher Conference', date: 'May 25, 2:00 PM' },
    { id: 3, title: 'End of Term Exams', date: 'June 5-9' },
  ];

  const navItems = [
    { path: '/instructor/students', icon: FiUsers, label: 'Students' },
    { path: '/instructor/materials', icon: FiUpload, label: 'Materials' },
    { path: '/instructor/classes', icon: FiBook, label: 'Classes' },
  ];

  const quickActions = [
    { icon: FiPlus, label: 'Add Student', action: () => navigate('/instructor/students') },
    { icon: FiUpload, label: 'Upload Material', action: () => navigate('/instructor/materials') },
    { icon: FiBook, label: 'Create Class', action: () => navigate('/instructor/classes') },
    { icon: FiMessageSquare, label: 'Send Announcement', action: () => alert('Feature coming soon!') },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-md transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-indigo-600">Instructor Portal</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>
        
        <nav className="p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg mb-1 transition-colors ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="text-lg" />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button className="flex items-center text-gray-600 hover:text-red-500 w-full p-2 rounded-lg hover:bg-gray-100">
            <FiLogOut />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {location.pathname === '/instructor' && 'Dashboard Overview'}
            {location.pathname.includes('students') && 'Student Management'}
            {location.pathname.includes('materials') && 'Lesson Materials'}
            {location.pathname.includes('classes') && 'My Classes'}
          </h2>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/instructor/students/new')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <FiPlus className="mr-2" />
              Add New
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Show dashboard overview when at the root path */}
          {location.pathname === '/instructor' ? (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                        <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg bg-opacity-20 ${stat.color.replace('text', 'bg')}`}>
                        <stat.icon className={`text-xl ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                    >
                      <action.icon className="text-2xl text-indigo-600 mb-2" />
                      <span className="text-sm text-center">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FiBarChart2 className="mr-2" /> Recent Activities
                  </h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                          <FiUpload className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-500">
                            {activity.course} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FiCalendar className="mr-2" /> Upcoming Events
                  </h3>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                          <FiCalendar className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;