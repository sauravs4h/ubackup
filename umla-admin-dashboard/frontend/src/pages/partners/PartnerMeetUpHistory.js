import {
  DotOutline,
  FunnelSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getPartnerMeetupHistory } from "../../redux/actions/partnerActions";
import dropdown from "../../assets/images/dropdown.png";
import { getOutlets } from "../../redux/actions/userActions";
import Loader from "../../components/loader/Loader";
import Slider from "react-slider";
import "../../css/range.css";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const MIN = 0;
const MAX = 5000;

const PartnerMeetUpHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [showDate, setShowDate] = useState(false);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [rangeValue, setRangeValue] = useState([MIN, MAX]);
  const [selectedCafeId, setSelectedCafeId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const dispatch = useDispatch();
  const meetupData = useSelector((state) => state.getPartnerMeetupHistory);
  const { meetups } = meetupData;

  const outletData = useSelector((state) => state.getOutlets);
  const { outlets } = outletData;

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    if (meetups) {
      setPageCount(Math.ceil(meetups.length / 20));
    }
  }, [meetups]);

  
  useEffect(() => {
    dispatch(getOutlets());
  }, [dispatch]);


  const handleSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedCafeId(selectedId);
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setSelectedStatus(selectedStatus);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

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
      getPartnerMeetupHistory(
        currentPage,
        searchInput,
        selectedCafeId,
        selectedStatus,
        rangeValue[0],
        rangeValue[1],
        formateedStartDate,
        formateedEndDate
      )
    );
  }, [currentPage, dispatch, endDate, rangeValue, searchInput, selectedCafeId, selectedStatus, startDate]);



  return (
    <div style={{ width: "calc(100vw - 370px)" }}>

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
          
          <div className="z-20">
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
                <option key={index} value={outlet._id}>
                  {outlet.name}
                </option>
              ))}
            </select>
            <img
              src={dropdown}
              alt=""
              className=" absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
          </div>

          <div className=" relative w-32">
            <select
              onChange={(e) => {
                handleStatusChange(e);
              }}
              className="w-full py-2 px-3 bg-[#F7F9FB] border border-gray-400 rounded shadow-md appearance-none"
            >
              <option value="">Status</option>
              <option value="completed">Completed</option>
              <option value="inprogress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
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
        <div className="overflow-x-auto bg-white p-4 mt-3 rounded-lg flex flex-col gap-10 items-center">
          {/* {loading ? (
    <Loader />
  ) : ( */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b-2 sticky top-0 z-10">
                <tr className="text-[#646464] font-normal text-base">
                  <th
                    style={{ minWidth: "100px" }}
                    className="pb-2 font-normal my-2"
                  >
                    Meetup ID
                  </th>
                  <th
                    style={{ minWidth: "300px" }}
                    className="pb-2 font-normal"
                  >
                    Name
                  </th>
                  <th
                    style={{ minWidth: "350px" }}
                    className="pb-2 font-normal"
                  >
                    Address
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal "
                  >
                    City
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal "
                  >
                    Order
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal"
                  >
                    Host Name
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal"
                  >
                    Guest Name
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal "
                  >
                    Date
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal "
                  >
                    Time
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal "
                  >
                    Purchase Of
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal "
                  >
                    Order Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {meetups?.map((meetup, index) => (
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
                        {meetup?._id}
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

                    <td>{meetup?.name}</td>
                    <td>{meetup?.address}</td>
                    <td>{meetup?.city}</td>
                    <td>{meetup?.order}</td>
                    <td>{meetup?.hostName}</td>
                    <td>{meetup?.guestName}</td>
                    <td>{meetup?.date}</td>
                    <td>{meetup?.time}</td>
                    <td>{meetup?.purchaseOf}</td>

                    <td className="items-center flex py-3 justify-center ">
                      <span>
                        <DotOutline
                          size={36}
                          weight="fill"
                          fill={`${
                            meetup?.orderStatus === "completed"
                              ? "#0EB300"
                              : meetup?.orderStatus === "pending"
                              ? "black"
                              : meetup?.orderStatus === "inprogress"
                              ? "#515ada"
                              : "red"
                          }`}
                        />
                      </span>
                      <span
                        className={`${
                          meetup?.orderStatus === "completed"
                            ? "text-[#0EB300]"
                            : meetup?.orderStatus === "pending"
                            ? "black"
                            : meetup?.orderStatus === "inprogress"
                            ? "text-[#515ada]"
                            : "text-red-500"
                        }`}
                      >
                        {meetup?.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* )} */}
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

export default PartnerMeetUpHistory;
