import { X } from "@phosphor-icons/react";
import React from "react";

const OneReport = ({ responseData, handleCloseReport }) => {
  return (
    <div className=" p-6 bg-white rounded-lg relative w-1/2">
      <button
        className=" absolute top-1 right-2 p-2 cursor-pointer"
        onClick={handleCloseReport}
      >
        <X size={20} />
      </button>

      <div className="m-4">
        <h1 className="text-2xl mb-8">Report</h1>

        <div className="my-8 ">
          <label className="text-[#646464]">User Name</label>
          <p className=" border-b-2  my-4 w-full">{responseData?.name}</p>
        </div>

        <div className="my-8 ">
          <label className="text-[#646464]">User Email</label>
          <p className=" border-b-2 my-4 w-full">{responseData?.email}</p>
        </div>

        <div className="my-8  ">
          <label className="text-[#646464]">Reason</label>
          <p className=" border-b-2  my-4 w-full  break-words">
            {responseData?.reason}
          </p>
        </div>

        {/* <div className="my-4 ">
          <label className="text-[#646464] mb-2">Images</label>
          <div className="flex gap-4">
            {responseData?.reportImage.length > 0
              ? responseData?.reportImage.map((image, index) => (
                  <img key={index} src={image} alt="" height={80} width={90} />
                ))
              : "No Images Uploaded"}
          </div>
        </div> */}

      </div>
    </div>
  );
};

export default OneReport;
