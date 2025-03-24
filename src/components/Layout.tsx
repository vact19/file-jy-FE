import Navbar from "./NavBar.tsx";
import React from "react";
import BottomNav from "./BottomNav.tsx";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}:LayoutProps) => {
  return (
      <div className="max-w-screen-sm h-screen mx-auto my-0">
          <Navbar/>
          <main className="p-6 h-[calc(100vh-56px)] overflow-y-scroll bg-gray-100 relative">
              {children}
          </main>
          <BottomNav/>
      </div>
  )
}

export default Layout
