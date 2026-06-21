import React from 'react';
import UserSidebar from './UserSidebar';
import Navbar from './Navbar';

const UserLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-main dark:text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden px-1 pb-1">
        <UserSidebar />
        <main className="flex-1 overflow-y-auto rounded-3xl ml-2">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
