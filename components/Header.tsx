
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          BISD Trespass Management
        </h1>
        <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
                <p className="text-white font-semibold">{user?.username}</p>
                <p className="text-xs text-blue-300">{user?.role === UserRole.VIEWER ? 'user' : user?.role}</p>
            </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;