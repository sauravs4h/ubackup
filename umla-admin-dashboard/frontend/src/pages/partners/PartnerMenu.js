import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getPartnerMenu } from "../../redux/actions/partnerActions";
import { ArrowCircleLeft } from "@phosphor-icons/react";
import veg from "../../assets/images/veg.png";
import nonVegPic from "../../assets/images/nonVeg.png";
import ReactPaginate from "react-paginate";

const PartnerMenu = () => {
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All Items");

  const [nonVeg, setNonVeg] = useState(false);

  const dispatch = useDispatch();

  const partnersData = useSelector((state) => state.getPartnerMenu);
  const { responseData, restaurantName } = partnersData;

  useEffect(() => {
    if (nonVeg === null) {
      dispatch(getPartnerMenu(id));
    } else {
      dispatch(getPartnerMenu(id, nonVeg));
    }
  }, [dispatch, id, nonVeg]);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold tracking-wider text-[#515ada]">
          {restaurantName?.name}
        </h1>

        <Link
          to={`/partnerDetails/${restaurantName?._id}`}
          className="flex items-center gap-1 border border-[#646464] rounded-full px-3 py-1"
        >
          <ArrowCircleLeft size={26} />
          Back
        </Link>
      </div>

      <div className=" flex gap-4 mb-4">
        <button
          onClick={() => {
            setSelectedTypeFilter("All Items");
            setNonVeg(null);
          }}
          className={`px-6 py-2 rounded-full text-center text-[#515ada] border-2 border-[#515ada]  ${
            selectedTypeFilter === "All Items" ? "text-white bg-[#515ada]" : ""
          }`}
        >
          All Items
        </button>

        <button
          onClick={() => {
            setSelectedTypeFilter("Veg");
            setNonVeg(false);
          }}
          className={`px-6 py-2 rounded-full text-center text-[#515ada] border-2 border-[#515ada] flex items-center gap-2  ${
            selectedTypeFilter === "Veg" ? "text-white bg-[#515ada] " : ""
          }`}
        >
          <img src={veg} alt="" height={13} width={13} />
          Veg
        </button>

        <button
          onClick={() => {
            setSelectedTypeFilter("Non-Veg");
            setNonVeg(true);
          }}
          className={`px-6 py-2 rounded-full text-center text-[#515ada] border-2 border-[#515ada] flex items-center gap-2 ${
            selectedTypeFilter === "Non-Veg" ? "text-white bg-[#515ada] " : ""
          }`}
        >
          <img src={nonVegPic} alt="" height={13} width={13} />
          Non-Veg
        </button>
      </div>

      <div className="flex gap-4 flex-wrap ">
        {responseData?.map((response, index) => (
          <div
            key={index}
            className="border border-[#B4B4B4] p-2 w-[200px]  rounded-lg flex flex-col gap-5"
          >
            <img src={response.itemImage} className="h-1/2 rounded-md" alt="" />
            <div>
              <h1 className="font-semibold text-center text-lg">
                {response?.itemName}
              </h1>
              <p className="text-xs text-center my-1">
                {response?.itemDescription}
              </p>
              <p className="text-center">
                Price:
                <span className="text-[#515ada] mx-1">
                ₹ {response?.itemPrice}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="my-4 flex justify-center">
        <ReactPaginate
          className="react-paginate gap-2  items-center justify-center flex text-sm w-fit rounded-xl"
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

export default PartnerMenu;
