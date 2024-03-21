import {
  FunnelSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getOfferCreation } from "../../redux/actions/partnerActions";
import dropdown from "../../assets/images/dropdown.png";
import { getOutlets } from "../../redux/actions/userActions";
import Loader from "../../components/loader/Loader";
import Slider from "react-slider";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const MIN = 0;
const MAX = 5000;

const OfferCreation = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCafeId, setSelectedCafeId] = useState("");
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [rangeValue, setRangeValue] = useState([MIN, MAX]);

  const [showDate, setShowDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const dispatch = useDispatch();

  const offerData = useSelector((state) => state.getOfferCreation);
  const { offerCreation, loading } = offerData;

  const outletData = useSelector((state) => state.getOutlets);
  const { outlets } = outletData;

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handleDateSelect = (date) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
  };

  const formatDate = (inputDate) => {
    const formattedDay = String(inputDate.getDate()).padStart(2, '0');
    const formattedMonth = String(inputDate.getMonth() + 1).padStart(2, '0');
    const formattedYear = inputDate.getFullYear();
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  }

  useEffect(() => {
    const formateedStartDate = formatDate(startDate);
    const formateedEndDate = formatDate(endDate);

    dispatch(
      getOfferCreation(
        currentPage,
        searchInput,
        selectedCafeId,
        rangeValue[0],
        rangeValue[1],
        formateedStartDate,
        formateedEndDate
      )
    );
  }, [currentPage, dispatch, rangeValue, searchInput, selectedCafeId, startDate, endDate]);

  useEffect(() => {
    dispatch(getOutlets());
  }, [dispatch]);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  }; // changing page number

  useEffect(() => {
    if (offerCreation) {
      setPageCount(Math.ceil(offerCreation.length / 20));
    }
  }, [offerCreation]); // setting the page count

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedCafeId(selectedId);
  };

  return (
    <div>

        <div className="bg-white p-3 flex rounded-lg items-center gap-4 ">
          <FunnelSimple size={30} />
          <div className="border border-gray-300 rounded-lg p-2 px-8 flex items-center gap-2">
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Search"
              className=" outline-none"
              onChange={handleSearchChange}
            />
          </div>

          <div>
              <button
                onClick={() => setShowDate(!showDate)}
                className="p-2 px-4 bg-[#F7F9FB] border border-gray-400 rounded shadow-md flex gap-3 items-center"
              >
                <span>Date</span>
                <img src={dropdown} alt="" />
              </button>

            {showDate && (
              <div className="absolute mt-2">
                <DateRangePicker
                  ranges={[selectionRange]}
                  onChange={handleDateSelect}
                />
              </div>
            )}
          </div>

          <div className="custom-select relative w-48">
            <select
              onChange={(e) => {
                handleSelect(e);
              }}
              className="w-full py-2 px-3 bg-[#F7F9FB] border border-gray-400 rounded shadow-md appearance-none"
            >
              <option value="">Restaurant Name</option>
              {outlets?.map((outlet, index) => (
                <option key={index} value={outlet?._id}>
                  {outlet?.name}
                </option>
              ))}
            </select>
            <img
              src={dropdown}
              alt=""
              className=" absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
          </div>

          <div className="relative flex justify-center ">
            <button
              onClick={() => setShowPriceRange(!showPriceRange)}
              className="p-2 px-4 bg-[#F7F9FB] border border-gray-400 rounded shadow-md flex gap-3 items-center"
              style={{ zIndex: showPriceRange ? 1 : "auto" }}
            >
              <span>Transaction</span>
              <img src={dropdown} alt="" />
            </button>

            {showPriceRange && (
              <div className="absolute z-20 mt-2 top-10 ">
                <div className="bg-white p-4 rounded-lg border border-gray-400">
                  <span>Amount: </span>
                  <Slider
                    className="slider mt-3"
                    onChange={setRangeValue}
                    value={rangeValue}
                    min={MIN}
                    max={MAX}
                  />
                  <div className="mt-4 flex justify-center items-center gap-5">
                    <input
                      className="w-28 border border-black text-center"
                      type="number"
                      value={rangeValue[0]}
                      onChange={(e) =>
                        setRangeValue([+e.target.value, rangeValue[1]])
                      }
                    />
                    <input
                      className="w-28 border border-black text-center"
                      type="number"
                      value={rangeValue[1]}
                      onChange={(e) =>
                        setRangeValue([rangeValue[0], +e.target.value])
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 mt-4 rounded-lg flex flex-col gap-10 items-center">
          {loading ? (
            <Loader />
          ) : (
            <table className="min-w-full">
              <thead className="border-b-2">
                <tr className="text-[#646464] font-normal text-base">
                  <th className="pb-2 font-normal my-2">User ID</th>
                  <th className="pb-2 font-normal ">Date</th>
                  <th className="pb-2 font-normal ">Time</th>
                  <th className="pb-2 font-normal">Host Name</th>

                  <th className="pb-2 font-normal">Offer</th>
                  <th className="pb-2 font-normal">Address</th>
                  <th className="pb-2 font-normal ">City</th>
                  <th className="pb-2 font-normal ">Purchase Of</th>
                  <th className="pb-2 font-normal ">Time Elapsed</th>
                  <th className="pb-2 font-normal ">Offer Reached</th>
                </tr>
              </thead>

              <tbody>
                {offerCreation?.map((offer, index) => (
                  <tr key={index} className="border-b-[1px]  text-center">
                    <td
                      className="py-[13px] scroller "
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        maxWidth: "0",
                      }}
                    >
                      <div
                        style={{
                          animation: "scroll 7s linear infinite",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {offer?.id}
                      </div>
                    </td>

                    <style>{`
                      @keyframes scroll {
                        0% {
                          transform: translateX(100%);
                        }
                        100% {
                          transform: translateX(-100%);
                        }
                      }
                      .scroller {
                        width: 5%;
                      }
                    `}</style>
                    <td>{offer?.date}</td>
                    <td>{offer?.time}</td>
                    <td className="flex items-center gap-2 py-[13px] justify-center">
                      {offer?.hostName}
                    </td>
                    <td>{offer?.offer}</td>
                    <td style={{ width: "25%" }}>{offer?.address}</td>

                    <td>{offer?.city}</td>
                    <td>{offer?.purchaseOf}</td>
                    <td>{offer?.leftTime}</td>
                    <td>{offer?.offerReached}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

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

export default OfferCreation;
