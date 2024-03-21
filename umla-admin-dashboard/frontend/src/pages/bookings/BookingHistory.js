import {
  DotOutline,
  DotsThreeVertical,
  FunnelSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import dropdown from "../../assets/images/dropdown.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getBookings,
  getOutletCity,
  getOutlets,
} from "../../redux/actions/userActions";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../../components/loader/Loader";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const BookingHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const [showDate, setShowDate] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedCafeId, setSelectedCafeId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const dispatch = useDispatch();

  const bookingData = useSelector((state) => state.getBookings);
  const { bookings, loading } = bookingData;
  const outletData = useSelector((state) => state.getOutlets);
  const { outlets } = outletData;

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  }; // changing page number

  useEffect(() => {
    if (bookings) {
      setPageCount(Math.ceil(bookings.length / 20));
    }
  }, [bookings]); // setting the page count


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
      getBookings(currentPage, selectedCafeId, selectedStatus,  formateedStartDate,
        formateedEndDate)
    );

    dispatch(getOutlets());
  }, [currentPage, dispatch, selectedCafeId, startDate, endDate, selectedStatus]); // dispatching the actions: getBookings, getOutlets

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedCafeId(selectedId);
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setSelectedStatus(selectedStatus);
  };


  return (
    <div>
      <div className="bg-white p-2 flex rounded-lg items-center gap-4 ">
        <FunnelSimple size={30} />
        <div className="border border-gray-300 rounded-lg p-2 px-8 flex items-center gap-2">
          <MagnifyingGlass size={20} />
          <input placeholder="Search" className=" outline-none" />
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

        <div className="relative w-60">
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
      </div>
      <div className="bg-white p-4 mt-4 rounded-lg flex flex-col gap-10 items-center">
        {loading ? (
          <Loader />
        ) : (
          <table className="min-w-full">
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "5%" }} />
            </colgroup>
            <thead className="border-b-2">
              <tr className="text-[#646464] font-normal text-base">
                <th className="pb-2 font-normal my-2">Booking ID</th>
                <th className="pb-2 font-normal ">Date</th>
                <th className="pb-2 font-normal ">Time</th>
                <th className="pb-2 font-normal">Host Name</th>
                <th className="pb-2 font-normal">Name</th>
                <th className="pb-2 font-normal ">Order</th>
                <th className="pb-2 font-normal">Address</th>
                <th className="pb-2 font-normal ">City</th>
                <th className="pb-2 font-normal ">Purchase Of</th>
                <th className="pb-2 font-normal ">Order Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings?.map((booking, index) => (
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
                      {booking?._id}
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

                  <td>{booking?.date}</td>
                  <td>{booking?.time}</td>
                  <td>{booking?.hostName}</td>
                  <td>{booking?.name}</td>
                  <td>{booking?.order}</td>
                  <td>{booking?.address} </td>
                  <td>{booking?.city}</td>
                  <td>{booking?.purchaseOf}</td>
                  <td className="items-center flex py-3 justify-center ">
                    <span>
                      <DotOutline
                        size={36}
                        weight="fill"
                        fill={`${
                          booking?.orderStatus === "completed"
                            ? "#0EB300"
                            : booking?.orderStatus === "pending"
                            ? "black"
                            : booking?.orderStatus === "inprogress"
                            ? "#515ada"
                            : "red"
                        }`}
                      />
                    </span>
                    <span
                      className={` ${
                        booking?.orderStatus === "completed"
                          ? "text-[#0EB300]"
                          : booking?.orderStatus === "pending"
                          ? "black"
                          : booking?.orderStatus === "inprogress"
                          ? "text-[#515ada]"
                          : "text-red-500"
                      }`}
                    >
                      {booking?.orderStatus}
                    </span>
                  </td>
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

export default BookingHistory;
