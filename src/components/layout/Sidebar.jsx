// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Package, User, Settings, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <Home size={20} />
    },
    {
      path: '/sessions',
      name: 'Sessions',
      icon: <Calendar size={20} />
    },
    {
      path: '/packages',
      name: 'Packages',
      icon: <Package size={20} />
    },
    {
      path: '/profile',
      name: 'Profile',
      icon: <User size={20} />
    },
    {
      path: '/stats', // Example path
      name: 'Stats',
      icon: <BarChart2 size={20} />
    },
    {
      path: '/settings', // Example path
      name: 'Settings',
      icon: <Settings size={20} />
    }
  ];

  return (
    <div className="h-screen fixed left-0 top-0 w-64 bg-white border-r border-gray-200 flex flex-col z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">FitStream</h1>
      </div>

      <nav className="flex-1 mt-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700
                  ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600' : ''}
                `}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
          <div>
            <p className="text-sm font-medium text-gray-900">User Name</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
