import { X } from "@phosphor-icons/react";
import React from "react";

const OneAlert = ({ responseData, handleCloseAlert }) => {
  return (
    <div className=" p-6 bg-white rounded-lg relative w-1/2">
      <button
        className=" absolute top-1 right-2 p-2 cursor-pointer"
        onClick={handleCloseAlert}
      >
        <X size={24} />
      </button>

      <div className="m-4">
        <h1 className="text-xl mb-4">Alert</h1>

        <div className="my-4 ">
          <label className="text-[#646464]">Host Name</label>
          <p className=" border-b-2  my-4 w-full">{responseData?.hostName}</p>
        </div>

        <div className="my-4 ">
          <label className="text-[#646464]">Guest Email</label>
          <p className=" border-b-2 my-4 w-full">{responseData?.guestName}</p>
        </div>

        <div className="my-4 ">
          <label className="text-[#646464]">Restaurant</label>
          <p className=" border-b-2 my-4 w-full">
            {responseData?.restaurantName}
          </p>
        </div>

        <div className="my-4  ">
          <label className="text-[#646464]">Reason</label>
          <p className=" border-b-2  my-4 w-full  break-words">
            {responseData?.alertReason}
          </p>
        </div>

        <div className="mb-8 mt-6 flex gap-5 items-center">
          <label className="text-[#646464]"> Status: </label>
          <span
            className={` px-2 py-1 ${
              responseData.alertStatus === "resolved"
                ? "bg-green-500 text-white"
                :"bg-red-500 text-white"
            }`}
          >
            {responseData?.alertStatus === "resolved" ? "Resolved" : "Unresolved"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OneAlert;

