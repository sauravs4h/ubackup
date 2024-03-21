import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import './layout.css';

const Layout = () => {
  return (
    <>
    
    <div className="flex flex-col md:flex-row overflow-hidden bg-[#F5F5F5] xl:w-full home-pg">
    <div className="md:w-80  lg:w-1/4">
        <Sidebar />
      </div>
     
      <div className="ml-20 w-fit px-8 py-5 lg:w-3/4 2xl:w-[100%] mini-container">
        <div className='navbar'>
          <Navbar />
        </div>
        <div className="outlet">{<Outlet />}</div>
      </div>
    </div>
    </>
  );
};

export default Layout;
