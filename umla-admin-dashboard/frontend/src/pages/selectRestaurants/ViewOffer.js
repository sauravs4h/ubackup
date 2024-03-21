import { X } from "@phosphor-icons/react";
import React, { useContext } from "react";
import RestaurantContext from "../../components/Context";
import { useDispatch } from "react-redux";
import {
  getRestaurants,
  submitClaimOffer,
} from "../../redux/actions/partnerActions";
import { useNavigate, useParams } from "react-router-dom";

const ViewOffer = ({ handleCloseQuery, restaurantName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const restaurantId = useParams();

  const { restaurant, itemsSelected, noOfOffers } =
    useContext(RestaurantContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const myItems = itemsSelected.map((item) => {
      return { id: item.itemId, itemSelectForOffer: item.itemSelectForOffer };
    });

    console.log(myItems);
    const bodyData = {
      restaurantId: restaurantId.id,
      resSelectForOffer: true,
      resNumOffer: noOfOffers,
      items: myItems,
    };

    dispatch(submitClaimOffer(bodyData));
    setTimeout(() => {
      navigate("/restaurants");
      dispatch(getRestaurants());
    }, 500);
  };

  return (
    <div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="bg-white w-[100%] h-fit p-4  rounded-xl relative"
      >
        <button
          className=" absolute top-1 right-1 p-1 cursor-pointer"
          onClick={handleCloseQuery}
        >
          <X size={20} />
        </button>
        <div className=" bg-[#535ADB4D] p-4 mt-6 rounded-lg">
          <div className="grid grid-cols-3 gap-20 ">
            <div className="flex flex-col">
              <span className="font-bold text-lg">Restaurant Name </span>
              <span>{restaurantName}</span>
            </div>

            <div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">Food Name </span>
                <span className="flex flex-col  col-auto">
                  {itemsSelected?.map(
                    (item, index) =>
                      item.itemSelectForOffer && (
                        <span key={index}> {item.itemName} </span>
                      )
                  )}
                </span>
              </div>
            </div>

            <div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">Offer </span>
                <span>{noOfOffers} Offers</span>
              </div>
            </div>
          </div>
        </div>

        <button className="bg-[#515ada] text-white p-2 w-full mt-6 mb-4 rounded-lg">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ViewOffer;
