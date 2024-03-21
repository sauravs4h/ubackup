import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getUserReport } from "../../redux/actions/partnerActions";
import OneReport from "./OneReport";
import { FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const Reports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isOpenReport, setIsOpenReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const dispatch = useDispatch();

  const reportData = useSelector((state) => state.getUserReport);
  const { responseData } = reportData;

  useEffect(() => {
    dispatch(getUserReport(currentPage, searchInput));
  }, [dispatch, currentPage, searchInput]);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    if (responseData) {
      setPageCount(Math.ceil(responseData.length / 20));
    }
  }, [responseData]);

  const handleCloseReport = () => {
    setIsOpenReport(false);
  };

  const handleOpenReport = (reportId) => {
    const selected = responseData.find((report) => report.id === reportId);

    setSelectedReport(selected);
    setIsOpenReport(true);
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
      <div className="bg-white p-4 mt-4 rounded-lg flex flex-col gap-10 items-center">
        <table className="min-w-full ">
          <thead className="border-b-2">
            <tr className="text-[#646464] font-normal text-base">
              <th className="pb-2 font-normal my-2">Report Id</th>
              <th className="pb-2 font-normal ">User Name</th>
              <th className="pb-2 font-normal">Contact Number</th>
              <th className="pb-2 font-normal">User Email</th>
              <th className="pb-2 font-normal">Date</th>
              <th className="pb-2 font-normal ">Reason</th>
              <th className="pb-2 font-normal ">View</th>
              {/* <th className="pb-2 font-normal ">Status</th> */}
            </tr>
          </thead>

          <tbody>
            {responseData?.map((response, index) => (
              <tr key={index} className="border-b-[1px] text-center">
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
                        width: 7%;
                      }
                    `}</style>

                <td className="flex items-center justify-center py-[9px]">
                  <img
                    src={response?.userImage}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />

                  <Link
                    className="w-1/2"
                    to={`/userProfile/${response.userId}`}
                  >
                    {response?.name}
                  </Link>
                </td>

                <td>{response?.number}</td>
                <td>{response?.email}</td>
                <td>{response?.date}</td>
                <td>
                  {response?.reason.length > 20
                    ? `${response?.reason.substring(0, 20)}...`
                    : response?.reason}
                </td>

                <td>
                  <button
                    onClick={() => handleOpenReport(response.id)}
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

      {isOpenReport && (
        <div
          className="overlay-container"
          style={{
            position: "fixed",
            top: "0px",
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
          <OneReport
            responseData={selectedReport}
            handleCloseReport={handleCloseReport}
          />
        </div>
      )}
    </div>
  );
};

export default Reports;
