import React from 'react';
import UserSidebar from './UserSidebar';
import Navbar from './Navbar';

const UserLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <UserSidebar />
        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
