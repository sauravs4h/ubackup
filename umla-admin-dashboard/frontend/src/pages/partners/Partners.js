import React, { useEffect, useState } from "react";
import PartnerMeetUpHistory from "./PartnerMeetUpHistory";
import PartnerCityDetails from "./PartnerCityDetails";
import PartnersData from "./PartnersData";
import PartnerTransaction from "./PartnerTransaction";
import { useDispatch, useSelector } from "react-redux";
import { getPartnerCityDetails, getPartnerMeetupHistory } from "../../redux/actions/partnerActions";

const Partners = () => {
  const [selectedButton, setSelectedButton] = useState("Partners Data");

  const dispatch = useDispatch();
  const meetupData = useSelector((state) => state.getPartnerMeetupHistory);
  const { todaysMeetups, newSechedule, totalPartner, newPartner } =
    meetupData;

    const cityData = useSelector((state) => state.getPartnerCityDetails);
    const { totalBooking, totalOutlet } = cityData;

  useEffect(() => {
    dispatch(getPartnerMeetupHistory());
    dispatch(getPartnerCityDetails());
  }, [dispatch]);

  return (
    <div>
      <div className=" flex justify-between">
        <div className="flex gap-3">


        <button
            onClick={() => {
              setSelectedButton("Partners Data");
            }}
            className={`px-6 rounded-md  ${
              selectedButton === "Partners Data"
                ? "bg-[#515ada] text-white"
                : "bg-[#E2E2E2]"
            } `}
          >
            Partners Data
          </button>

          <button
            onClick={() => {
              setSelectedButton("Meetup History");
            }}
            className={`px-6 rounded-md  ${
              selectedButton === "Meetup History"
                ? "bg-[#515ada] text-white"
                : "bg-[#E2E2E2]"
            } `}
          >
            Meetup History
          </button>

         

          <button
            onClick={() => setSelectedButton("Transactions")}
            className={`px-6 rounded-md  ${
              selectedButton === "Transactions"
                ? "bg-[#515ada] text-white"
                : "bg-[#E2E2E2]"
            } `}
          >
            Transactions
          </button>

          <button
            onClick={() => setSelectedButton("City Details")}
            className={`px-6 rounded-md  ${
              selectedButton === "City Details"
                ? "bg-[#515ada] text-white"
                : "bg-[#E2E2E2]"
            } `}
          >
            City's Details
          </button>
        </div>

        {/* {selected button side data} */}

        {selectedButton === "Meetup History" && (
          <div className="flex gap-3">
            <div className="flex flex-col px-5 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
              <span>Todays Meetups</span>
              <span>{todaysMeetups}</span>
            </div>

            <div className="flex flex-col px-5 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
              <span>New Schedule Today</span>
              <span>{newSechedule}</span>
            </div>

          </div>
        )}

        {selectedButton === "Partners Data" && (
          <div className="flex gap-3">
            <div className="flex flex-col px-5 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
            <span>Total Partners</span>
              <span>{totalPartner}</span>
            </div>

            <div className="flex flex-col px-5 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
              <span>New Partners</span>
              <span>{newPartner}</span>
            </div>
          </div>
        )}

        {selectedButton === "Transactions" && (
          <div className="flex gap-3">
             <div className="flex flex-col px-5 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
              <span>Total Bookings</span>
              <span>{totalBooking}</span>
            </div>

            <div className="flex flex-col px-5 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
              <span>Total Restaurants Added</span>
              <span>{totalOutlet}</span>
            </div>
          </div>
        )}

        {selectedButton === "City Details" && (
          <div className="flex gap-3">
            <div className="flex flex-col px-5 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
              <span>Total Bookings</span>
              <span>{totalBooking}</span>
            </div>

            <div className="flex flex-col px-5 shadow-[2px_2px_4px_2px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
              <span>Total Restaurants Added</span>
              <span>{totalOutlet}</span>
            </div>
          </div>
        )}
      </div>

      <div className="my-4">
        {selectedButton === "Meetup History" && <PartnerMeetUpHistory />}
        {selectedButton === "Partners Data" && <PartnersData />}
        {selectedButton === "Transactions" && <PartnerTransaction />}
        {selectedButton === "City Details" && <PartnerCityDetails />}
      </div>
    </div>
  );
};

export default Partners;
