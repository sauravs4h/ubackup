import { Bell } from "@phosphor-icons/react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import dp from "../../src/assets/images/dp.jpg";

const Navbar = () => {
  const location = useLocation().pathname.split("/")[1];
  const navigate = useNavigate();

  let navHeading = "";

  switch (location) {
    case "home":
      navHeading = "MASTER DASHBOARD";
      break;
    case "early_bird":
      navHeading = "User Data";
      break;
    case "user_profile":
      navHeading = "User Profile";
      break;
    case "coupon_details":
      navHeading = "Coupon Details";
      break;
    case "users":
      navHeading = "Users";
      break;
    case "partners":
      navHeading = "Partners";
      break;
    case "transactions":
      navHeading = "Transaction History";
      break;
    case "bookings":
      navHeading = "Booking History";
      break;
    case "matchings":
      navHeading = "Matchmaking History";
      break;
    case "refunds":
      navHeading = "Refund Requests";
      break;
    case "allUsers":
      navHeading = "All Users";
      break;
    case "queries":
      navHeading = "User Query";
      break;
    case "userProfile":
      navHeading = "User Profile";
      break;
    case "verifiedUsers":
      navHeading = "Verified Users";
      break;
    case "unverifiedUsers":
      navHeading = "Un-Verified Users";
      break;
    case "restaurants":
      navHeading = "Claim Offer";
      break;
    case "restaurantMenu":
      navHeading = "Restaurant Menu";
      break;
    case "partnerDetails":
      navHeading = "Partner Details";
      break;
    case "partnerMenu":
      navHeading = "Menu";
      break;
    case "floatingOffers":
      navHeading = "Floating Offers";
      break;
      case "userOffers":
      navHeading = "User Offers";
      break;
    case "alerts":
      navHeading = "Alerts";
      break;
    case "reports":
      navHeading = "Reports";
      break;
      case "feedbacks":
        navHeading = "Feedbacks";
        break;
    default:
      navHeading = "";
  }

  return (
    <header className=" flex items-center justify-between gap-3  h-[88px] w-[100%] ">
      <div className="flex gap-8  ">
        <h1 className="text-2xl font-semibold text-[#252525] capitalize">
          {navHeading}
        </h1>
      </div>

      <div className="flex items-center justify-center gap-5 ">
        <div>
          <Link
            to={"#"}
            className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-full"
          >
            <img src={dp} alt="user" className="w-full h-full object-cover" />
          </Link>
        </div>

        <div>
          <Link to={"#"} className="text-2xl font-semibold text-[#515ADA]">
            <span className="text-[#252525] mr-1">Hello,</span>
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
