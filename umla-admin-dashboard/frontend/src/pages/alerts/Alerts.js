import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import OneAlert from "./OneAlert";
import { getUserAlert } from "../../redux/actions/partnerActions";
import { FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const Alerts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const dispatch = useDispatch();

  const alertData = useSelector((state) => state.getUserAlert);
  const { responseData } = alertData;

  useEffect(() => {
    dispatch(getUserAlert(currentPage, searchInput));
  }, [dispatch, currentPage, searchInput]);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    if (responseData) {
      setPageCount(Math.ceil(responseData.length / 20));
    }
  }, [responseData]);

  const handleCloseAlert = () => {
    setIsOpenAlert(false);
  };

  const handleOpenAlert = (alertId) => {
    const selected = responseData.find((alert) => alert.id === alertId);

    setSelectedAlert(selected);
    setIsOpenAlert(true);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div>
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
      </div>

      <div className="bg-white p-4 mt-4  rounded-lg flex flex-col gap-10 items-center">
        <table className="min-w-full ">
          <thead className="border-b-2">
            <tr className="text-[#646464] font-normal text-base">
              <th className="pb-2 font-normal my-2">Alert Id</th>
              <th className="pb-2 font-normal ">Host Name</th>
              <th className="pb-2 font-normal ">Guest Name</th>
              <th className="pb-2 font-normal">Restaurant</th>
              <th className="pb-2 font-normal">Location</th>
              <th className="pb-2 font-normal ">Date</th>
              <th className="pb-2 font-normal ">Time</th>
              <th className="pb-2 font-normal ">Reason</th>
              <th className="pb-2 font-normal ">Status</th>
            </tr>
          </thead>

          <tbody>
            {responseData?.map((response, index) => (
              <tr key={index} className="border-b-[1px] text-center">
                <td
                  className="py-2 scroller "
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
                    {response?.id}
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

                <td className="py-2">
                  <span className="flex items-center justify-center gap-3">
                    <img
                      src={response?.hostImage}
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />
                    <Link to={`/userProfile/${response.hostid}`}>
                      {response?.hostName}
                    </Link>
                  </span>
                </td>

                <td>
                  <span className="flex items-center justify-center gap-3">
                    <img
                      src={response?.guestImage}
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />
                    <Link to={`/userProfile/${response.guestid}`}>
                      {response?.guestName}
                    </Link>
                  </span>
                </td>

                <td style={{ width: "15%" }}>{response?.restaurantName}</td>
                <td>{response?.restaurantAddress}</td>
                <td>{response?.date}</td>
                <td>{response?.time}</td>
                <td>
                  {response?.alertReason.length > 20
                    ? `${response?.alertReason.substring(0, 20)}...`
                    : response?.alertReason}
                </td>

                <td>
                  <button
                    onClick={() => handleOpenAlert(response.id)}
                    className="underline text-[#515ada]"
                  >
                    View
                  </button>
                </td>
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

      {isOpenAlert && (
        <div
          className="overlay-container"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "999", // Higher z-index to appear on top
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <OneAlert
            responseData={selectedAlert}
            handleCloseAlert={handleCloseAlert}
          />
        </div>
      )}
    </div>
  );
};

export default Alerts;
