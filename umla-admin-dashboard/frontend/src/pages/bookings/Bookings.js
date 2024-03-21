import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookingHistory from "./BookingHistory";
import WeeklyBookings from "./WeeklyBookings";
import { getBookings } from "../../redux/actions/userActions";

const Users = () => {
  const [selectedButton, setSelectedButton] = useState("Weekly Bookings");
  const dispatch = useDispatch();


  const bookingData = useSelector((state) => state.getBookings);
  
  const { todaysBooking, thisWeekBooking } = bookingData;

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  return (
    <div>
      <div className=" flex justify-between">
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedButton("Bookings");
            }}
            className={`px-6 rounded-md  ${
              selectedButton === "Bookings"
                ? "bg-[#515ada] text-white"
                : "bg-[#E2E2E2]"
            } `}
          >
            Bookings
          </button>

          <button
            onClick={() => {
              setSelectedButton("Weekly Bookings");
            }}
            className={`px-6 rounded-md  ${
              selectedButton === "Weekly Bookings"
                ? "bg-[#515ada] text-white"
                : "bg-[#E2E2E2]"
            } `}
          >
            Weekly bookings
          </button>
        </div>
          <div className="flex gap-5">
            <div className="flex flex-col px-7 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
            <span>Today's Bookings</span>
            <span>{todaysBooking}</span>
            </div>

            <div className="flex flex-col px-7 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
            <span>This Week's Bookings</span>
            <span>{thisWeekBooking}</span>
            </div>
          </div>
      </div>

      <div className="my-4">
        {selectedButton === "Bookings" && <BookingHistory />}
        {selectedButton === "Weekly Bookings" && <WeeklyBookings />}
      </div>
    </div>
  );
};

export default Users;
