import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantContext from "../../components/Context";
import {
  getRestaurants,
  submitClaimOffer,
} from "../../redux/actions/partnerActions";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";

const Restaurants = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const restaurantsData = useSelector((state) => state.getRestaurants);
  const { responseData } = restaurantsData;

  const { itemsSelected } = useContext(RestaurantContext);

  useEffect(() => {
    dispatch(getRestaurants(currentPage));
  }, [currentPage, dispatch]);

  const handleOpen = (restaurantId, numberOfOffer, selectOfOffer) => {
    if (selectOfOffer === true) {
      const myItems = itemsSelected.map((item) => {
        return { id: item.itemId, itemSelectForOffer: item.itemSelectForOffer };
      });
      const bodyData = {
        restaurantId: restaurantId,
        resSelectForOffer: false,
        resNumOffer: numberOfOffer,
        items: myItems,
      };

      dispatch(submitClaimOffer(bodyData));
      setTimeout(() => {
        dispatch(getRestaurants());
      }, 500);
    } else {
      navigate(`/restaurantMenu/${restaurantId}`);
    }
  };

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    if (responseData) {
      setPageCount(Math.ceil(responseData.length / 20));
    }
  }, [responseData]);

  return (
    <div>
      <div className="text-3xl justify-center items-center text-[#515ada] font-bold text-center tracking-wide  ">
        Restaurants
      </div>

      <div className="bg-white p-4 mt-5 rounded-lg flex flex-col gap-10 items-center overflow-x-auto">
        <div className="w-full">
          <table className="min-w-full ">
            <thead className="border-b-2">
              <tr className="text-[#646464] text-base ">
                <th
                  style={{ width: "30%" }}
                  className="pb-2 my-2 text-left font-normal"
                >
                  Restaurant Name
                </th>
                <th className="pb-2 font-normal">Restaurant Status</th>
                <th className="pb-2 font-normal">Select for Offer</th>
              </tr>
            </thead>

            <tbody>
              {responseData?.map((response, index) => (
                <tr key={index}>
                  <td className="flex items-center gap-4 my-2">
                    <span>
                      <img
                        src={response?.restaurantImage}
                        alt=""
                        className=" h-14 w-14 rounded-full"
                      />
                    </span>
                    <span>{response?.restaurantName}</span>
                  </td>

                  <td
                    className={`text-center ${
                      response?.restaurantStatus === "open"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {response?.restaurantStatus === "open"
                      ? "Active"
                      : "In-Active"}
                  </td>

                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={response.selectOfOffer}
                      className="h-8 w-8 cursor-pointer"
                      onChange={() =>
                        handleOpen(
                          response?.restaurantId,
                          response?.numberOfOffer,
                          response?.selectOfOffer
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ReactPaginate
          className="react-paginate gap-2 p-2 items-center justify-center flex lg:text-md md:text-base w-fit rounded-xl"
          previousLabel={"←"}
          nextLabel={"→"}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          pageClassName={"pagination-page "}
          containerClassName={"pagination"}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
        />
      </div>
    </div>
  );
};

export default Restaurants;
