import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getWeeklyBookings } from "../../redux/actions/userActions";
import dropdown from "../../assets/images/dropdown.png";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const WeeklyBookings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [showDate, setShowDate] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const dispatch = useDispatch();

  const weeklyBookingsData = useSelector((state) => state.getWeeklyBookings);

  const weeklyBooking = weeklyBookingsData?.weeklyBooking;

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
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
    const formattedDay = String(inputDate.getDate()).padStart(2, "0");
    const formattedMonth = String(inputDate.getMonth() + 1).padStart(2, "0");
    const formattedYear = inputDate.getFullYear();
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  };

  useEffect(() => {
    if (weeklyBooking && weeklyBooking.length > 0) {
      setPageCount(Math.ceil(weeklyBooking.length / 20));
    } else {
      setPageCount(1);
    }
  }, [weeklyBooking]);

  useEffect(() => {
    const formateedStartDate = formatDate(startDate);
    const formateedEndDate = formatDate(endDate);

    dispatch(
      getWeeklyBookings(currentPage, formateedStartDate, formateedEndDate)
    );
  }, [dispatch, currentPage, startDate, endDate]);

  // const dates = weeklyBooking ? Object.keys(weeklyBooking["Jaipur"]) : [];
  const dates =
    weeklyBooking && weeklyBooking["Jaipur"]
      ? Object.keys(weeklyBooking["Jaipur"])
      : [];

  return (
    <div >
      <div className="bg-white p-2 rounded-lg items-center  ">
        <div className="ml-10">
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
      </div>
      <div className="bg-white p-4 mt-4 rounded-lg flex flex-col gap-10 items-center">
        <table className="min-w-full" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "20%" }} />
            {dates.map((date, index) => (
              <col key={index} style={{ width: "10%" }} />
            ))}
          </colgroup>
          <thead className="border-b-[1px]">
            <tr className="text-[#646464] font-normal text-base">
              <th className="pb-2 font-normal my-2">Location</th>
              {dates?.slice(0,7).map((date, index) => (
                <th className="pb-2 font-normal my-2" key={index}>
                  {date}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {weeklyBooking &&
              Object.keys(weeklyBooking)?.map((city, index) => (
                <tr
                  key={index}
                  className="border-b-[1px] last:border-none text-center"
                >
                  <td className="py-3">{city}</td>
                  {dates?.slice(0,7).map((date, index) => (
                    <td key={index}>
                      {weeklyBooking[city][date]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>

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

export default WeeklyBookings;
