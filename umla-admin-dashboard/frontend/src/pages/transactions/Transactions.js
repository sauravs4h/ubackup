import React, { useEffect, useState } from "react";
import CreditAmount from "./CreditAmount";
import DebitAmount from "./DebitAmount";
import { useDispatch, useSelector } from "react-redux";
import { getCreditAmount } from "../../redux/actions/partnerActions";


const Transactions = () => {
  const [selectedButton, setSelectedButton] = useState("Credit Amount");

  const dispatch = useDispatch();

  const offerData = useSelector((state) => state.getCreditAmount);
  const { totalTransaction, totalTransactionInRuppee } = offerData;

  useEffect(() => {
    dispatch(getCreditAmount());
  }, [dispatch]);

  return (
    <div>
      <div className=" flex justify-between">
      <div className="flex gap-3">
      <button
          onClick={() => {
            setSelectedButton("Credit Amount");
          }}
          className={` px-6 rounded-md  ${selectedButton==="Credit Amount" ? "bg-[#515ada] text-white" : "bg-[#E2E2E2]"}`}
          >
            Credit Amount
          </button>

          <button
          onClick={() => {
            setSelectedButton("Debit Amount");
          }}
          className={` px-6 rounded-md  ${selectedButton==="Debit Amount" ? "bg-[#515ada] text-white" : "bg-[#E2E2E2]"}`}
          >
            Debit Amount
          </button>
          </div>
      
          <div className="flex gap-5">
        <div className="flex flex-col py-1 px-5 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
          <span>Total Transactions</span>
          <span>{totalTransaction}</span>
        </div>

        <div className="flex flex-col py-1 px-5 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
          <span>Total Transactions in Ruppees</span>
          <span>{totalTransactionInRuppee}</span>
        </div>
      </div>

      </div>

      

      <div className="my-4">
        {selectedButton === "Credit Amount" && <CreditAmount />}
        {selectedButton === "Debit Amount" && <DebitAmount />}
      </div>
    </div>
  );
};

export default Transactions;
