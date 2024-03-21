import {
  BookOpenText,
  Calendar,
  ChartLine,
  ChatDots,
  Coffee,
  ForkKnife,
  IdentificationCard,
  Money,
  Question,
  SealWarning,
  UserRectangle,
  Users,
  UsersFour,
  Wallet,
  Warning,
} from "@phosphor-icons/react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import umlaLogo from "../../src/assets/images/umlaLogo.png";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/adminActions";
import { toast } from "react-toastify";

const listArray = [
  {
    title: "Dashboard",
    icon: <ChartLine size={24} />,
    link: "/home",
  },
  {
    title: "Early Bird",
    icon: <IdentificationCard size={24} />,
    link: "/early_bird",
  },
  {
    title: "Select Restaurants",
    icon: <Coffee size={24} />,
    link: "/restaurants",
  },
  {
    title: "Users Data",
    icon: <UserRectangle size={24} />,
    link: "/users",
  },
  
  {
    title: "Manage Partners",
    icon: <ForkKnife size={24} />,
    link: "/partners",
  },
  {
    title: "Transaction History",
    icon: <Wallet size={24} />,
    link: "/transactions",
  },
  {
    title: "Booking History",
    icon: <Calendar size={24} />,
    link: "/bookings",
  },
  {
    title: "Matching History",
    icon: <Users size={24} />,
    link: "/matchings",
  },
  {
    title: "Refund Request",
    icon: <Money size={24} />,
    link: "/refunds",
  },
  {
    title: "Queries",
    icon:<Question size={24} />,
    link: "/queries",
  },
  {
    title: "All Users",
    icon: <UsersFour size={24} />,
    link: "/allUsers",
  },
  {
    title: "Floating Offers",
    icon: <BookOpenText size={24} />,
    link: "/floatingOffers",
  },
  {
    title: "Alerts",
    icon: <Warning size={24} />,
    link: "/alerts",
  },
  {
    title: "Reports",
    icon: <SealWarning size={24} />,
    link: "/reports",
  },
  {
    title: "Feedback",
    icon: <ChatDots size={24} />,
    link: "/feedbacks",
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logout Successful");
  };

  return (
    <div className="fixed lg:w-80 md:w-56 p-3 text-[#828282] bg-[#515ada] h-screen flex flex-col justify-between overflow-y-auto sidebar-scroll">
      {/* {Top Section} */}
      <div>
        <div className="flex justify-center items-center gap-3 my-2 md:my-4">
          <img src={umlaLogo} alt="logo" className=" h-10 w-8"></img>
          <div className=" text-2xl md:text-3xl text-white ">
            <span>MASTER</span>
            <span className="ml-2 font-bold">UMLA</span>
          </div>
        </div>

        <div className="my-4 md:my-10 ">
          <ul className="h-full text-white flex flex-col gap-2 md:gap-3 overflow-y-auto">
            {listArray.map((item, index) => (
              <li key={index} className=" rounded-lg w-full overflow-hidden">
                <NavLink
                  to={item.link}
                  className="flex items-center gap-3 text-base p-3"
                  style={({ isActive }) => ({
                    color: isActive ? "black" : "white",
                    background: isActive ? "#EFD5FF" : "",
                  })}
                >
                  <span>{item.icon}</span>
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* {Bottom Section} */}
      <div className=" text-center">
        <button
          className="mb-2 md:mb-4 bg-[#EFD5FF] p-2 md:p-3 rounded-lg w-full overflow-hidden font-semibold text-black "
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
