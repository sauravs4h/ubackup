import { CalendarCheck, ClockAfternoon } from "@phosphor-icons/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getUserOffers } from "../../redux/actions/partnerActions";

const UserOffers = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  
  const dummyArr = [1, 2];

    // const offerData = useSelector((state) => state.getUserOffers);
  //   const { responseData } = offerData;

  // useEffect(() => {
  //   dispatch(getUserOffers(id));
  // }, [dispatch, id]);

  return (
    <div>
      <Link
        to="/floatingOffers"
        className="rounded-lg px-6 py-2 bg-[#515ada] text-white"
      >
        Back
      </Link>

      <div className="flex flex-wrap gap-5 my-6">
        {dummyArr?.map((response, index) => (
          <div
            key={index}
            className="border w-[420px] p-5 rounded-lg border-[#8A8A8A] my-3"
          >
            <h1 className={`mb-4 text-xl font-semibold ${response?.offer === "archived" ? "text-[#B845FF]" : "text-[#249F5D]" }`}>Floating</h1>

            <div className="flex gap-4 items-center mb-2">
              {/* <span className="font-semibold">{response?.restaurantName}</span> */}
              <span className="font-semibold">Cafe Sam Updated</span>

              <span className="flex gap-1 items-center">
                <span>
                  <CalendarCheck size={20} fill="#515ada" />
                </span>
                {/* <span>{response?.date}</span> */}
                <span>12/13/3402</span>
              </span>
              <hr className=" border-r-2 border-r-[#646464] border-opacity-50 h-[19px]"></hr>
              <div className="flex gap-1 items-center">
                <ClockAfternoon size={20} fill="#515ada" />
                {/* <span>{response?.time}</span> */}
                <span>1:20</span>
              </div>
            </div>

            <span className="text-xs text-[#646464] mb-1">
              {/* {response?.restaurantaddress} */}
              Ground Floor, Near Naturals Icecream, A-5, C scheme chomu circle, Sardar Patel Marg, Jaipur, Rajasthan 302007
            </span>

            <p className="text-[#787779] mt-6 mb-2 text-sm">
              Offer Type: 
              <span className="text-black ml-2">
              Instant Meetup
              {/* {response?.offerType} */}
              </span>
            </p>

            <p className="text-[#787779] mb-6 mt-2 text-sm">
              Time Slot:
              <span className="text-black ml-2">Morning</span>
              {/* <span className="text-black ml-2">{response?.timeSlot}</span> */}
            </p>


            {response?.order?.map((item, index) => (
            <div className="flex justify-between mt-2 text-md">
              <span>1x {item.item}</span>
                <span>₹ {item.price}</span>
            </div>
             ))}

            <hr className="my-1 border-dotted border-[#646464] border-opacity-50 "></hr>

            <div className="flex justify-between mt-2">
              <span>Total</span>
              {/* <span>{response?.total}</span> */}
              <span>₹ 362.90</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOffers;
