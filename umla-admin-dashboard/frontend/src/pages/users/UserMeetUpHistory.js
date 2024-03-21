import {
  DotOutline,
  DotsThreeVertical,
  FunnelSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import {
  getOutletCity,
  getOutlets,
  getUserDataMeetup,
} from "../../redux/actions/userActions";
import dropdown from "../../assets/images/dropdown.png";
import Loader from "../../components/loader/Loader";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const UserMeetUpHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [selectedCafeId, setSelectedCafeId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [citySelected, setCitySelected] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [showDate, setShowDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const dispatch = useDispatch();

  const userMeetupData = useSelector((state) => state.getUserDataMeetup);
  const { responseData, loading } = userMeetupData;

  const outletData = useSelector((state) => state.getOutlets);
  const { outlets } = outletData;

  const outletcityData = useSelector((state) => state.getOutletCity);
  const { city } = outletcityData;

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
    const formattedDay = String(inputDate.getDate()).padStart(2, "0");
    const formattedMonth = String(inputDate.getMonth() + 1).padStart(2, "0");
    const formattedYear = inputDate.getFullYear();
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  };

  useEffect(() => {
    const formateedStartDate = formatDate(startDate);
    const formateedEndDate = formatDate(endDate);

    dispatch(
      getUserDataMeetup(
        currentPage,
        searchInput,
        citySelected,
        selectedCafeId,
        selectedStatus,
        formateedStartDate,
        formateedEndDate
      )
    );
  }, [
    dispatch,
    searchInput,
    currentPage,
    citySelected,
    selectedCafeId,
    selectedStatus,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    dispatch(getOutlets());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOutletCity());
  }, [dispatch]); // get city

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    if (responseData) {
      setPageCount(Math.ceil(responseData.length / 20));
    }
  }, [responseData]);

  const handleCafeSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedCafeId(selectedId);
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setSelectedStatus(selectedStatus);
  };

  const handleCitySelect = (e) => {
    const citySelected = e.target.value;
    setCitySelected(citySelected);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div style={{ width: "calc(100vw - 370px)" }}>

      <div className="bg-white p-4 flex rounded-lg items-center gap-4 ">
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

        <div className="custom-select relative w-60">
          <select
            onChange={(e) => {
              handleCafeSelect(e);
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

        <div className="custom-select relative w-32">
          <select
            onChange={(e) => {
              handleCitySelect(e);
            }}
            className="w-full py-2 px-3 bg-[#F7F9FB] border border-gray-400 rounded shadow-md appearance-none"
          >
            <option value="">City</option>
            {city?.map((item, index) => (
              <option key={index}>{item}</option>
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
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <img
            src={dropdown}
            alt=""
            className=" absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      <div className="bg-white p-4 mt-5 rounded-lg flex flex-col gap-10 items-center overflow-x-auto">
        <div className="w-full overflow-x-auto">
          {loading ? (
            <Loader />
          ) : (
            <table className="min-w-full ">
              <thead className="border-b-2">
                <tr className="text-[#646464] text-base">
                  <th
                    style={{ minWidth: "100px" }}
                  className="pb-2 font-normal my-2">Order ID</th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal"
                  >
                    User Name
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal"
                  >
                    User Number
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal "
                  >
                    User Email
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal"
                  >
                    Guest Name
                  </th>
                  <th
                    style={{ minWidth: "150px" }}
                    className="pb-2 font-normal "
                  >
                    Date
                  </th>
                  <th
                    style={{ minWidth: "150px" }}
                    className="pb-2 font-normal "
                  >
                    Time
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal "
                  >
                    Restaurant Name
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal "
                  >
                    City
                  </th>
                  <th
                    style={{ minWidth: "200px" }}
                    className="pb-2 font-normal"
                  >
                    Order Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {responseData?.map((response, index) => (
                  <tr
                    key={index}
                    className="border-b-[1px] last:border-none text-center"
                  >
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
                        {response?.orderId}
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
                    <td>{response?.userName}</td>
                    <td>{response?.userNumber}</td>
                    <td>{response?.userEmail}</td>
                    <td>{response?.guestName}</td>
                    <td>{response?.date}</td>
                    <td>{response?.time}</td>
                    <td>{response?.restaurantName}</td>
                    <td>{response?.city}</td>
                    <td className="items-center flex py-3 justify-center ">
                      <span>
                        <DotOutline
                          size={36}
                          weight="fill"
                          fill={`${
                            response?.orderStatus === "completed"
                              ? "#0EB300"
                              : response?.orderStatus === "pending"
                              ? "#515ada"
                              : "red"
                          }`}
                        />
                      </span>
                      <span
                        className={`${
                          response?.orderStatus === "completed"
                            ? "text-[#0EB300]"
                            : response?.orderStatus === "pending"
                            ? "text-[#515ada]"
                            : "text-red-500"
                        }`}
                      >
                        {response?.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

export default UserMeetUpHistory;
