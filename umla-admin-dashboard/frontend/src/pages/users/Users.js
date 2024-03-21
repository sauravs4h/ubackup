import React, {  useEffect, useState } from "react";
import UserMeetUpHistory from "./UserMeetUpHistory";

import UserPurchaseHistory from "./UserPurchaseHistory";
import UserTraffic from "./UserTraffic";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getVerifiedUsers } from "../../redux/actions/userActions";

const Users = () => {
  const [selectedButton, setSelectedButton] = useState("Meetups");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.getVerifiedUsers);
  const { verifiedUser, unVerifiedUser} = userData;


  useEffect(()=> {
    dispatch(getVerifiedUsers());
  }, [dispatch])

  return (
    <div>
      <div className=" flex justify-between">
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedButton("Meetups");
            }}
            className={`px-6 rounded-md  ${
              selectedButton === "Meetups"
                ? "bg-[#515ada] text-white"
                : "bg-[#E2E2E2]"
            } `}
          >
            Meetups
          </button>

          <button
            onClick={() => setSelectedButton("Purchases")}
            className={`px-6 rounded-md  ${
              selectedButton === "Purchases"
                ? "bg-[#515ada] text-white"
                : "bg-[#E2E2E2]"
            } `}
          >
            Purchases
          </button>

          <button
            onClick={() => setSelectedButton("User Traffic")}
            className={`px-6 rounded-md  ${
              selectedButton === "User Traffic"
                ? "bg-[#515ada] text-white"
                : "bg-[#E2E2E2]"
            } `}
          >
            User Traffic
          </button>
        </div>
        <div className="flex gap-3">
          <button onClick={()=> navigate('/verifiedUsers')} className="flex flex-col px-5 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center items-center">
            <span>Verified Users</span>
            <span>{verifiedUser}</span>
          </button>

          <button onClick={()=> navigate('/unverifiedUsers')} className=" items-center flex flex-col px-5 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
            <span>Un-Verified Users</span>
            <span>{unVerifiedUser}</span>
          </button>
        </div>
      </div>

      <div className="my-4">
        {selectedButton === "Meetups" && <UserMeetUpHistory />}
        {selectedButton === "Purchases" && <UserPurchaseHistory />}
        {selectedButton === "User Traffic" && <UserTraffic />}
      </div>
    </div>
  );
};

export default Users;
