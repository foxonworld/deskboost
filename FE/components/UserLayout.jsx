import React from 'react';
import UserSidebar from './UserSidebar';
import Navbar from './Navbar';

const UserLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <UserSidebar />
        <main className="flex-1 overflow-y-auto bg-[#F7F9F8] dark:bg-[#10221f]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
