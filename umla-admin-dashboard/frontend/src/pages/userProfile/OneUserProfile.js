import React, { useEffect, useState } from "react";
import UserProfileMatches from "./UserProfileMatches";
import UserProfileDeals from "./UserProfileDeals";
import UserProfileMeetups from "./UserProfileMeetups";
import UserProfileInfo from "./UserProfileInfo";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/actions/userActions";
import { useParams } from "react-router-dom";
import {
  blockUser,
  denyUserVerification,
  verifyProfile,
} from "../../redux/actions/adminActions";

const OneUserProfile = () => {
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState("Profile");

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.getUserProfile);
  const { info, userProfile } = userData;

  useEffect(() => {
    dispatch(getUserProfile(id));
  }, [id, dispatch]);

  const handleVerifyProfile = () => {
    dispatch(verifyProfile({ userId: id }));
    dispatch(getUserProfile(id));
  };

  const handleDenyVerification = () => {
    const isSelected = window.confirm(
      `Are you sure you want to deny ${userProfile?.name}'s Verification?`
    );

    if (isSelected) {
      dispatch(denyUserVerification({ userId: id }));

      setTimeout(() => {
        dispatch(getUserProfile(id));
      }, 500);
    }
  };

  const handleBlockUser = () => {
    const isSelected = window.confirm(
      `Are you sure you want to block ${userProfile?.name}?`
    );

    if (isSelected) {
      dispatch(blockUser({ userId: id }));

      setTimeout(() => {
        dispatch(getUserProfile(id));
      }, 500);
    }
  };

  return (
    <div>
      <div className="flex gap-[50px] ">
        <div className="border border-[#5E5E5E] border-opacity-50  rounded-xl p-4 w-[200px] h-[100px] text-center flex flex-col gap-4 justify-center">
          <span className="text-3xl text-[#515ADA] font-semibold ">
            {info?.totalMatches}
          </span>
          <span className=" text-[#5E5E5E]">Total Matches</span>
        </div>

        <div className="border border-[#5E5E5E] border-opacity-50  rounded-xl p-4 w-[200px] h-[100px] text-center flex flex-col gap-4 justify-center">
          <span className="text-3xl text-[#515ADA] font-semibold ">
            {info?.totalMeetUps}
          </span>
          <span className=" text-[#5E5E5E]">Total Meetups</span>
        </div>

        <div className="border border-[#5E5E5E] border-opacity-50  rounded-xl p-4 w-[200px] h-[100px] text-center flex flex-col gap-4 justify-center">
          <span className="text-3xl text-[#515ADA] font-semibold ">
            {info?.totalSwipes}
          </span>
          <span className=" text-[#5E5E5E]">Total Swipes</span>
        </div>

        <div className="border border-[#5E5E5E] border-opacity-50  rounded-xl p-4 w-[200px] h-[100px] text-center flex flex-col gap-4 justify-center">
          <span className="text-3xl text-[#515ADA] font-semibold ">
            {info?.dealsCreated}
          </span>
          <span className=" text-[#5E5E5E]">Deals Created</span>
        </div>

        <div className="flex flex-col gap-2 justify-center">
          <button
            onClick={handleVerifyProfile}
            disabled={userProfile?.profileVerification}
            className={` p-[9px] px-6  rounded-xl ${
              userProfile?.profileVerification
                ? "bg-[#51DA77] border border-[#51DA77] text-white w-[150px]"
                : "border border-[#515ADA] text-[#515ada]"
            }`}
          >
            {userProfile?.profileVerification ? "Verified" : "Verify Profile"}
          </button>

          <div>
            <button
              onClick={handleDenyVerification}
              disabled={
                userProfile?.profileVerification ||
                userProfile?.profileVerificationDenied ||
                userProfile?.profileBlocked
              }
              className={` text-[#DA5151] w-full p-[9px] px-6 rounded-xl border border-[#DA5151] ${
                userProfile?.profileVerificationDenied
                  ? "bg-[#DA5151] text-white"
                  : ""
              }`}
            >
              {userProfile?.profileVerificationDenied ? "Denied" : "Deny"}
            </button>
          </div>
        </div>

        <button
          onClick={handleBlockUser}
          // disabled={
          //   userProfile?.profileVerification ||
          //   userProfile?.profileVerificationDenied || 
          //   userProfile?.profileBlocked
          // }
          className={` text-[#DA5151] px-6 rounded-xl border border-[#DA5151] ${
            userProfile?.profileBlocked
              ? "bg-[#DA5151] text-white"
              : ""
          }`}
        >
          {userProfile?.profileBlocked ? "Blocked" : "Block User"}
        </button>
      </div>

      <div className="border border-[#5E5E5E] border-opacity-50  rounded-xl p-4 mt-6 flex flex-col gap-4 justify-center">
        <span className="text-[#5E5E5E]">User Profile</span>
        <span className="flex justify-between">
          <span>
            <span className="text-[#5E5E5E] mr-2">Name:</span>
            <span>{userProfile?.name}</span>
          </span>
          <span>
            <span className="text-[#5E5E5E] mr-2">Profile Completed:</span>
            <span>{userProfile?.profileCompleted}</span>
          </span>
          <span>
            <span className="text-[#5E5E5E] mr-2">Profile Verification:</span>
            <span>
              {userProfile?.profileVerification ? "Verified" : "Un-Verified"}
            </span>
          </span>
          <span>
            <span className="text-[#5E5E5E] mr-2">Phone Number:</span>
            <span>{userProfile?.phoneNumber}</span>
          </span>

          <span>
            <span className="text-[#5E5E5E] mr-2">Email:</span>
            <span>{userProfile?.email}</span>
          </span>
        </span>
      </div>

      <div className=" flex gap-16 border-b-2 border-b-[#5E5E5E] border-opacity-50 mt-12">
        <button
          onClick={() => setSelectedOption("Profile")}
          className={` ${
            selectedOption === "Profile"
              ? "border-b-2 border-b-[#515ada] text-[#515ada] "
              : ""
          } `}
        >
          Profile Info
        </button>

        <button
          onClick={() => setSelectedOption("Matches")}
          className={`${
            selectedOption === "Matches"
              ? "border-b-2 border-b-[#515ada] text-[#515ada] "
              : ""
          } `}
        >
          Matches
        </button>

        <button
          onClick={() => setSelectedOption("Meetups")}
          className={` ${
            selectedOption === "Meetups"
              ? "border-b-2 border-b-[#515ada] text-[#515ada] "
              : ""
          } `}
        >
          Meetups
        </button>

        <button
          onClick={() => setSelectedOption("Deals")}
          className={` ${
            selectedOption === "Deals"
              ? "border-b-2 border-b-[#515ada] text-[#515ada] "
              : ""
          } `}
        >
          Deals
        </button>
      </div>

      <div className="my-4">
        {selectedOption === "Profile" && <UserProfileInfo />}
        {selectedOption === "Matches" && <UserProfileMatches />}
        {selectedOption === "Meetups" && <UserProfileMeetups />}
        {selectedOption === "Deals" && <UserProfileDeals />}
      </div>
    </div>
  );
};

export default OneUserProfile;
