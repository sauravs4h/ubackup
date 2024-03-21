import { CalendarCheck, ClockAfternoon } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDeals } from "../../redux/actions/userActions";
import { useParams } from "react-router-dom";

const UserProfileDeals = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const dealsData = useSelector((state) => state.getUserDeals);
  const { floatingdeals, upcomingdeals } = dealsData;

  useEffect(() => {
    dispatch(getUserDeals(id));
  }, [dispatch, id]);

  return (
    <div style={{ width: "calc(100vw - 400px)" }} className=" overflow-x-auto ">
      <span className="text-lg">Floating on Profile</span>
      <div className="flex gap-4">
        {floatingdeals?.map((deal, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)] my-3"
          >
            <div className="flex gap-3 items-center mb-1">
              <span className="font-semibold">{deal?.outletName}</span>
              <span className="flex gap-1 items-center">
                <span>
                  <CalendarCheck size={20} fill="#515ada" />
                </span>
                <span>{deal?.date}</span>
              </span>
              <hr className=" border-r-2 border-r-[#646464] border-opacity-50 h-[19px]"></hr>
              <div className="flex gap-1 items-center">
                <ClockAfternoon size={20} fill="#515ada" />
                <span>{deal?.time}</span>
              </div>
            </div>

            <span className="text-xs text-[#646464] mb-1">
              {deal?.outletaddress}
            </span>

            {deal?.order.map((item, index) => (
              <div key={index} className="flex justify-between mt-2">
                <span>1x {item.item}</span>
                <span>₹ {item.price}</span>
              </div>
            ))}

            <hr className="my-1 border-dotted border-[#646464] border-opacity-50 "></hr>

            <div className="flex justify-between mt-2">
              <span>Total</span>
              <span>{deal?.total}</span>
            </div>
          </div>
        ))}
      </div>

      <span className="text-lg">Upcoming Deals</span>

      <div className="flex gap-4 ">
        {upcomingdeals?.map((deal, index) => (
          <div
            key={index}
            className="border min-w-[450px] p-4 rounded-lg shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)] my-3"
          >
            <div className="flex gap-3 items-center mb-1">
              <span className="font-semibold">{deal?.outletName}</span>
              <span className="flex gap-1 items-center">
                <span>
                  <CalendarCheck size={20} fill="#515ada" />
                </span>
                <span>{deal?.date}</span>
              </span>
              <hr className=" border-r-2 border-r-[#646464] border-opacity-50 h-[19px]"></hr>
              <div className="flex gap-1 items-center">
                <ClockAfternoon size={20} fill="#515ada" />
                <span>{deal?.time}</span>
              </div>
            </div>

            <span className="text-xs text-[#646464] mb-1">
              {deal?.outletaddress}
            </span>

            {deal?.order.map((item, index) => (
              <div key={index} className="flex justify-between mt-2 text-md">
                <span>1x {item.item}</span>
                <span>₹ {item.price}</span>
              </div>
            ))}

            <hr className="my-1 border-dotted border-[#646464] border-opacity-50 "></hr>

            <div className="flex justify-between mt-2">
              <span>Total</span>
              <span>{deal?.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfileDeals;
