import React, { useEffect, useState } from "react";
import OfferCreation from "./OfferCreation";
import Matched from "./Matched";
import OfferExpired from "./OfferExpired";
import { useDispatch, useSelector } from "react-redux";
import { getOfferCreation } from "../../redux/actions/partnerActions";

const Matchings = () => {
  const [selectedButton, setSelectedButton] = useState("Offer Creation");

  const dispatch = useDispatch();

  const offerData = useSelector((state) => state.getOfferCreation);
  const { offerCreated, offerMatched, offerExpire } = offerData;

  useEffect(() => {
    dispatch(getOfferCreation());
  }, [dispatch]);

  return (
    <div>
      <div className=" flex justify-between">
        <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedButton("Offer Creation");
              }}
              className={` px-6 rounded-md ${
                selectedButton === "Offer Creation"
                  ? "bg-[#515ada] text-white"
                  : "bg-[#E2E2E2]"
              }`}
            >
              Offer Creation
            </button>

            <button
              onClick={() => {
                setSelectedButton("Matched");
              }}
              className={` px-6 rounded-md ${
                selectedButton === "Matched"
                  ? "bg-[#515ada] text-white"
                  : "bg-[#E2E2E2]"
              }`}
            >
              Matched
            </button>

            <button
              onClick={() => {
                setSelectedButton("Offer Expired");
              }}
              className={` px-6 rounded-md ${
                selectedButton === "Offer Expired"
                  ? "bg-[#515ada] text-white"
                  : "bg-[#E2E2E2]"
              }`}
            >
              Offer Expired
            </button>
        </div>

        <div className="flex gap-5">
          <div className="flex flex-col px-8 py-1 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
            <span>Offer Created</span>
            <span>{offerCreated}</span>
          </div>

          <div className="flex flex-col px-8 py-1 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
            <span>Matches</span>
            <span>{offerMatched}</span>
          </div>

          <div className="flex flex-col px-8 py-1 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
            <span>Offer Expired</span>
            <span>{offerExpire}</span>
          </div>
        </div>
      </div>

      <div className="my-4">
        {selectedButton === "Offer Creation" && <OfferCreation />}
        {selectedButton === "Matched" && <Matched />}
        {selectedButton === "Offer Expired" && <OfferExpired />}
      </div>
    </div>
  );
};

export default Matchings;
