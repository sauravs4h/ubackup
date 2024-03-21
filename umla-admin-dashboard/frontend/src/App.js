import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import "./index.css";
import Layout from "./components/shared/Layout";
import UserData from "./pages/UserData";
import UserProfile from "./pages/UserProfile";
import { useEffect } from "react";
import CouponDetails from "./pages/CouponDetails";
import Users from "./pages/users/Users";
import Partners from "./pages/partners/Partners";
import Transactions from "./pages/transactions/Transactions";
import Bookings from "./pages/bookings/Bookings";
import Matchings from "./pages/matchings/Matchings";
import Refund from "./pages/refund/Refund";
import AllUsers from "./pages/allUsers/AllUsers";
import OneUserProfile from "./pages/userProfile/OneUserProfile";
import Queries from "./pages/queries/Queries";
import VerifiedUsers from "./pages/users/VerifiedUsers";
import UnverifiedUsers from "./pages/users/UnverifiedUsers";
import Home from "./pages/Home";
import Restaurants from "./pages/selectRestaurants/Restaurants";
import RestaurantMenu from "./pages/selectRestaurants/RestaurantMenu";
import  { RestaurantData } from "./components/Context";
import PartnerDetails from "./pages/partners/PartnerDetails";
import PartnerMenu from "./pages/partners/PartnerMenu";
import FloatingOffers from "./pages/floatingOffers/FloatingOffers";
import Alerts from "./pages/alerts/Alerts";
import Reports from "./pages/reports/Reports";
import UserOffers from "./pages/floatingOffers/UserOffers";
import Feedbacks from "./pages/feedbacks/Feedbacks";


function App() {
  const navigate = useNavigate();
  const admin = localStorage.getItem("admin");

  useEffect(() => {
    if (!admin) {
      navigate("/");
    }
  }, [admin, navigate]);

  return (
    <RestaurantData>
      
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/early_bird" element={<UserData />} />
          <Route path="/user_profile/:id" element={<UserProfile />} />
          <Route path="/coupon_details" element={<CouponDetails />} />
          <Route path="/users" element={<Users />} />
          <Route path="/allUsers" element={<AllUsers />} />
          <Route path="/verifiedUsers" element={<VerifiedUsers />} />
          <Route path="/unverifiedUsers" element={<UnverifiedUsers />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/matchings" element={<Matchings />} />

          <Route path="/refunds" element={<Refund />} />
          <Route path="/queries" element={<Queries />} />

          <Route path="/allUsers" element={<AllUsers />} />

          <Route path="/userProfile/:id" element={<OneUserProfile />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurantMenu/:id" element={<RestaurantMenu />} />
          <Route path="/partnerDetails/:id" element={<PartnerDetails />} />
          <Route path="/partnerMenu/:id" element={<PartnerMenu />} />
        
          <Route path="/floatingOffers" element={<FloatingOffers />} />
          <Route path="/userOffers/:id" element={<UserOffers />} />

          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/feedbacks" element={<Feedbacks />} />




        </Route>
      </Routes>
    </RestaurantData>
  );
}

export default App;
