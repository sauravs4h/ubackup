import { X } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUserQueryReply, getUserQuery } from "../../redux/actions/partnerActions";

const OneQuery = ({ responseData, handleCloseQuery }) => {
  const [reply, setReply] = useState("");

  const dispatch = useDispatch();

  const queryId = responseData?.id;

  const handleQuerySubmit = (e) => {
    e.preventDefault();

    const bodyData = {
      queryid: queryId,
      resolution: reply,
    };
    dispatch(addUserQueryReply(bodyData));
    
    handleCloseQuery();

    dispatch((getUserQuery()));

  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };


  return (
    <div className="flex flex-col md:flex-row p-4 bg-white rounded-lg my-10 relative w-2/5 h-fit">
      <button
        className=" absolute top-1 right-2 p-2 cursor-pointer"
        onClick={handleCloseQuery}
      >
        <X size={20} />
      </button>

      <form onSubmit={handleQuerySubmit} className=" w-full m-4">
        <h1 className="text-xl mb-4">User Query</h1>

        <div className="my-4 ">
          <label className="text-[#646464]">User Name</label>
          <p className=" border-b-2  my-4  w-full">{responseData?.name}</p>
        </div>

        <div className="my-4 ">
          <label className="text-[#646464]">Email</label>
          <p className=" border-b-2  my-4 w-full">{responseData?.email}</p>
        </div>

        <div className="my-4 ">
          <label className="text-[#646464]">Title</label>
          <p className=" border-b-2  my-4 w-full">{responseData?.query}</p>
        </div>

        <div className="my-4 ">
          <label className="text-[#646464]">Description</label>
          <p className=" border-b-2  my-4 w-full overflow-auto">
            {responseData?.description}
          </p>
        </div>

        <div className="my-4 ">
          <label className="text-[#646464]">Images</label>
          <div className="flex gap-4">
            {responseData?.queryImage.length > 0
              ? responseData?.queryImage.map((image, index) => (
                  <img key={index} src={image} alt="" height={80} width={90} />
                ))
              : "No Images Uploaded"}
          </div>
        </div>

        <div className="my-4 ">
          <label className="text-[#646464]">Reply</label>
          <input
            type="text"
            className=" border-b-2  p-2 w-full"
            onChange={handleReplyChange}
          />
        </div>

        <button className="mt-8 w-full p-2 bg-[#6B15EC] text-white rounded-md">
          Submit
        </button>
      </form>
    </div>
  );
};

export default OneQuery;
