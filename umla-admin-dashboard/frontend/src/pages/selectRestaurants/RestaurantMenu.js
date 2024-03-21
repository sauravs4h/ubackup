import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantContext from "../../components/Context";
import { useDispatch, useSelector } from "react-redux";
import { getMenuItems } from "../../redux/actions/partnerActions";
import NoOfOffers from "./NoOfOffers";
import ViewOffer from "./ViewOffer";

const RestaurantMenu = () => {
  const { id } = useParams();
  const [showPopUp, setShowPopUp] = useState(false);
  const [showOfferBox, setShowOfferBox] = useState(false);
  const [showViewBox, setShowViewBox] = useState(false);

  const { itemsSelected, setItemsSelected } =
    useContext(RestaurantContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuData = useSelector((state) => state.getMenuItems);
  const { responseData, restaurantName } = menuData;

  useEffect(() => {
    dispatch(getMenuItems(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (responseData) {
      setItemsSelected([...responseData]);
    }
  }, [responseData]);

  const updateItems = (itemId) => {
    const myItems = itemsSelected.map((item) => {
      if (item.itemId === itemId) {
        item.itemSelectForOffer = !item.itemSelectForOffer;
      }
      return item;
    });
    setItemsSelected([...myItems]);
  };

  // console.log(itemsSelected);

  const handleContinue = () => {
    const allFalse = itemsSelected.every(
      (item) => item.itemSelectForOffer === false
    );

    if (allFalse) {
      setShowPopUp(true);
    } else {
      setShowOfferBox(true);
    }
  };

  const handleClose = () => {
    setShowOfferBox(false);
  };

  const handleCloseViewBox = () => {
    setShowViewBox(false);
  };

  const handleBackButton = () => {
    setItemsSelected([]);
    navigate("/restaurants");
  };

  return (
    <div>
      <div className=" flex justify-between">
        <span className="text-3xl justify-center items-center text-[#515ada] font-bold text-center tracking-wide">
          {restaurantName}
          
        </span>
        <button
          onClick={handleBackButton}
          className="py-1 px-6  bg-[#515ada] text-white rounded-lg "
        >
          Back
        </button>
      </div>

      <div className="bg-white p-4 mt-5 rounded-lg flex flex-col gap-10 items-center overflow-x-auto">
        <table className="min-w-full ">
          <thead className="border-b-2">
            <tr className="text-[#646464] font-normal text-base">
              <th
                style={{ width: "35%" }}
                className="pb-2 font-normal my-2 text-left"
              >
                Item Name
              </th>
              <th className="pb-2 font-normal">Item Price</th>
              <th className="pb-2 font-normal">Item Status</th>
              <th className="pb-2 font-normal">Select for Offer</th>
            </tr>
          </thead>

          <tbody>
            {itemsSelected?.map((response, index) => (
              <tr key={index} className="">
                <td className=" my-10">{response?.itemName}</td>
                <td className="text-center">₹ {response?.itemPrice}</td>

                <td
                  className={`text-center ${
                    response?.itemStatus === "active"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {response?.itemStatus === "active" ? "Active" : "In-Active"}
                </td>

                <td className="text-center">
                  <input
                    type="checkbox"
                    className="h-10 w-8 cursor-pointer"
                    onChange={() => updateItems(response?.itemId)}
                    checked={response.itemSelectForOffer}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showOfferBox && (
        <div
          className="overlay-container"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "999",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NoOfOffers
            handleClose={handleClose}
            setShowViewBox={setShowViewBox}
          />
        </div>
      )}

      {showPopUp && (
        <div
          className="overlay-container"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "999",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="flex flex-col justify-center items-center gap-8 w-5/12 p-3 h-1/3 rounded-lg bg-[#515ada] text-white text-center">
            <span className="text-5xl">Oops!</span>

            <div className="flex flex-col">
              <span className="text-2xl">
                It looks like you haven't selected any food items yet.🍔🥗
              </span>
              <span className="text-2xl">
                Please choose some items from the menu to proceed further
              </span>
            </div>

            <button
              className="bg-[#EFD5FF] w-1/2 mt-3 text-[#515ADA] p-3 rounded-lg text-lg font-semibold "
              onClick={() => setShowPopUp(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {showViewBox && (
        <div
          className="overlay-container"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "999",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ViewOffer
            handleCloseViewBox={handleCloseViewBox}
            restaurantName = {restaurantName}
          />
        </div>
      )}

      <div className="flex justify-center my-4">
        <button
          onClick={handleContinue}
          className="p-3 bg-[#515ada] rounded-lg text-xl tracking-wider font-bold text-white w-1/3"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RestaurantMenu;
