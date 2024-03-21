import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import OneQuery from "./OneQuery";
import { useDispatch, useSelector } from "react-redux";
import { getUserQuery } from "../../redux/actions/partnerActions";

const Queries = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isOpenQuery, setIsOpenQuery] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const dispatch = useDispatch();

  const queryData = useSelector((state) => state.getUserQuery);
  const { responseData } = queryData;

  // console.log(responseData);

  useEffect(() => {
    dispatch(getUserQuery(currentPage));
  }, [dispatch, currentPage]);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    if (responseData) {
      setPageCount(Math.ceil(responseData.length / 20));
    }
  }, [responseData]);

  const handleCloseQuery = () => {
    setIsOpenQuery(false);
  };

  const handleOpenQuery = (queryId) => {
    // Find the selected query based on queryId
    const selected = responseData.find((query) => query.id === queryId);
    setSelectedQuery(selected);
    setIsOpenQuery(true);
  };

  return (
    <div>
      <div className="bg-white p-4  rounded-lg flex flex-col gap-10 items-center">
        <table className="min-w-full ">
          <thead className="border-b-2">
            <tr className="text-[#646464] font-normal text-base">
              <th className="pb-2 font-normal my-2">Query Id</th>
              <th className="pb-2 font-normal ">Date</th>
              <th className="pb-2 font-normal ">Time</th>
              <th className="pb-2 font-normal">Name</th>
              <th className="pb-2 font-normal">City</th>
              <th className="pb-2 font-normal ">Query</th>
              <th className="pb-2 font-normal ">Status</th>
            </tr>
          </thead>

          <tbody>
            {responseData?.map((response, index) => (
              <tr key={index} className="border-b-[1px] text-center">
                <td className="py-[13px]">{response?.id}</td>
                <td>{response?.date}</td>
                <td>{response?.time}</td>

                <td className="flex items-center justify-center py-[9px]">
                  <span className=" w-3/12">
                    <img
                      src={response?.userImage}
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />
                  </span>
                  <span className="w-6/12">{response?.name}</span>
                </td>

                {/* <span className="flex gap-2 justify-center">
                      <img
                        src={response.userImage}
                        alt=""
                        className="h-8 w-8 rounded-full"
                      />
                      <span>{response?.name}</span>
                    </span> */}

                <td>Jaipur</td>
                <td style={{ width: "25%" }}>{response?.query}</td>
                <td>
                  <button
                    onClick={() => handleOpenQuery(response.id)}
                    className={`underline ${
                      response.status === "Resolved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {response?.status}
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

      {isOpenQuery && (
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
          <OneQuery
            responseData={selectedQuery}
            handleCloseQuery={handleCloseQuery}
          />
        </div>
      )}
    </div>
  );
};

export default Queries;
