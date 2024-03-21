import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getPartnerDetails } from "../../redux/actions/partnerActions";
import drunkenmonkey from "../../assets/images/drunkenmonkey.png";
import { ArrowCircleLeft } from "@phosphor-icons/react";

const PartnerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const partnersData = useSelector((state) => state.getPartnerDetails);
  const { responseData } = partnersData;
  console.log(responseData);

  useEffect(() => {
    dispatch(getPartnerDetails(id));
  }, [dispatch, id]);

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <span className="flex gap-4 ">
          <h1 className="text-3xl font-semibold tracking-wider text-[#515ada]">
            {responseData?.name}
          </h1>
          <img
            src={responseData?.restaurantImage[0]}
            alt=""
            height={10}
            width={40}
            className=" rounded-full"
          />
        </span>

        <Link
          to="/partners"
          className="flex items-center gap-1 border border-[#646464] rounded-full px-3 py-1"
        >
          <ArrowCircleLeft size={26} />
          Back
        </Link>
      </div>

      <div className="w-11/12">
        <div className="flex justify-between items-center ">
          <p className="font-semibold">
            Category
            <span className="font-normal ml-3 rounded-full px-5 py-2 border border-[#64646480] bg-[#E3E5FF]">
              {responseData?.category}
            </span>
          </p>
          <Link to={`/partnerMenu/${responseData?.id}`} className="py-2 px-6 text-white bg-[#515ada] rounded-full">
            View Menu
          </Link>
        </div>

        <div className=" grid grid-cols-2 gap-6 mt-4">
          <span className=" flex flex-col">
            <span className="font-semibold">Restaurant Name</span>
            <span className="bg-[#E3E5FF] rounded-lg my-2 px-5 py-3 border border-[#64646480] ">
              {responseData?.name}
            </span>
          </span>

          <span className=" flex flex-col">
            <span className="font-semibold">Email Address</span>
            <span className="bg-[#E3E5FF] rounded-lg my-2 px-5 py-3 border border-[#64646480] ">
              {responseData?.email}
            </span>
          </span>
        </div>

        <div className=" grid grid-cols-2 gap-6 mt-4">
          <span className=" flex flex-col">
            <span className="font-semibold">Manager Name</span>
            <span className="bg-[#E3E5FF] rounded-lg my-2 px-5 py-3 border border-[#64646480] ">
              {responseData?.managerName}
            </span>
          </span>

          <span className=" flex flex-col">
            <span className="font-semibold">Manager Contact Number</span>
            <span className="bg-[#E3E5FF] rounded-lg my-2 px-5 py-3 border border-[#64646480] ">
              {responseData?.managerContect}
            </span>
          </span>
        </div>

        <span className="mt-4 flex flex-col">
          <span className="font-semibold">Address</span>
          <span className="bg-[#E3E5FF] rounded-lg my-2 px-5 py-3 border border-[#64646480] ">
            {responseData?.address}
          </span>
        </span>

        <div className=" grid grid-cols-2 gap-6 mt-4">
          <div className=" flex flex-col">
            <span className="font-semibold">Working Hours</span>

            <span className="flex gap-4">
              <span className="bg-[#E3E5FF] w-1/2 rounded-lg my-2 px-5 py-3 border border-[#64646480] ">
                {responseData?.openAt}
              </span>
              <span className="bg-[#E3E5FF] w-1/2 rounded-lg my-2 px-5 py-3 border border-[#64646480] ">
                {responseData?.closeAt}
              </span>
            </span>
          </div>

          <span className=" flex flex-col">
            <span className="font-semibold">City</span>
            <span className="bg-[#E3E5FF] rounded-lg my-2 px-5 py-3 border border-[#64646480] ">
              {responseData?.city}
            </span>
          </span>
        </div>

        <h1 className="text-lg font-semibold mt-6">Account Details</h1>

        <div className=" grid grid-cols-3 gap-6 mt-4">
          <span className=" flex flex-col">
            <span className="font-semibold">Account Holder Name</span>
            <span className="bg-[#E3E5FF] rounded-lg my-2 px-5 py-3 border border-[#64646480] ">              
              {responseData?.accountDetails?.accountHolderName ? responseData?.accountDetails?.accountHolderName : "-"}
            </span>
          </span>

          <span className=" flex flex-col">
            <span className="font-semibold">Bank Name</span>
            <span className="bg-[#E3E5FF] rounded-lg my-2 px-5 py-3 border border-[#64646480] ">
              {responseData?.accountDetails?.bankName ? responseData?.accountDetails?.bankName : "-"}

            </span>
          </span>

          <span className=" flex flex-col">
            <span className="font-semibold">Account Number</span>
            <span className="bg-[#E3E5FF] rounded-lg my-2 px-5 py-3 border border-[#64646480] ">
              {responseData?.accountDetails?.accountNumber ? responseData?.accountDetails?.accountNumber : "-"}

            </span>
          </span>
        </div>

        <h1 className="text-lg font-semibold mt-6 mb-4" >Restaurant Images</h1>
        {responseData?.restaurantImage?.map((image, index) => (
            <img key={index} alt=""  src={image} className=" h-56 w-60"/>

        ))}
            
      </div>
    </div>
  );
};

export default PartnerDetails;
