import {
  DotOutline,
  DotsThreeVertical,
  FunnelSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getRefundRequest } from "../../redux/actions/partnerActions";

const Refund = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const [searchInput, setSearchInput] = useState("");

  const dispatch = useDispatch();

  const refundData = useSelector((state) => state.getRefundRequest);
  const { responseData, refundedAmount, refundApproved, refundDeclined } =
    refundData;

  useEffect(() => {
    dispatch(getRefundRequest(currentPage, searchInput));
  }, [currentPage, dispatch, searchInput]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const dummyArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  return (
    <div>
      <div className="flex justify-between items-center ">
        <div className="flex gap-3">
          <div className="flex flex-col py-2 px-5 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
            <span>Amount Refunded</span>
            <span>{refundedAmount}</span>
          </div>

          <div className="flex flex-col py-2 px-5 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
            <span>Refunds Approved</span>
            <span>{refundApproved}</span>
          </div>

          <div className="flex flex-col py-2 px-5 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center text-center">
            <span>Refunds Declined</span>
            <span>{refundDeclined}</span>
          </div>
        </div>

        <div className=" ">
          <button className="py-2 px-5 bg-green-400 rounded-lg justify-center text-center mr-4">
            Approve
          </button>
          <button className="py-2 px-5 bg-red-400 rounded-lg justify-center text-center mr-4">
            Decline
          </button>
        </div>
      </div>

      <div className="bg-white p-3 flex rounded-lg items-center justify-between my-4 ">
        <div className="flex items-center gap-4 ">
          <FunnelSimple size={30} />
          <div className="border border-gray-300 rounded-lg p-2 px-8 flex items-center gap-2">
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Search"
              className=" outline-none"
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }} className="refund-scroll">
        <div className="  overflow-y-auto  ">
          <div className="bg-white p-4 mt-5 rounded-lg flex flex-col gap-10 items-center">
            <table className="min-w-full ">
              <thead className="border-b-2">
                <tr className="text-[#646464] font-normal text-base">
                <th className="pb-2 font-normal my-2"><input type="checkbox" className="h-4 w-4 mt-2"  /></th>
                  <th className="pb-2 font-normal my-2">Name</th>
                  <th className="pb-2 font-normal ">Amount</th>
                  <th className="pb-2 font-normal ">Bank Account Number</th>
                  <th className="pb-2 font-normal">Account Holder Name</th>
                  <th className="pb-2 font-normal">IFSC Code</th>
                  <th className="pb-2 font-normal ">Refund Status</th>

                </tr>
              </thead>

              <tbody>
                {responseData?.map((response, index) => (
                  <tr
                    key={index}
                    className="border-b-[1px] last:border-none text-center"
                  >
                    <td><input type="checkbox" className="h-4 w-4 mt-2"/> </td>
                    <td>{response?.name}</td>
                    <td>{response?.amount}</td>
                    <td>{response?.accountNumber}</td>
                    <td>{response?.accountHolderName}</td>
                    <td>{response?.ifscCode}</td>

                    <td className="items-center flex py-[13px] justify-center">
                    <span>
                        <DotOutline
                          size={36}
                          weight="fill"
                          fill={`${
                            response?.refundStatus === "success"
                              ? "#0EB300"
                              : response?.refundStatus === "pending"
                              ? "#515ada"
                              : "red"
                          }`}
                        />
                      </span>
                      <span
                        className={`${
                          response?.refundStatus === "success"
                            ? "text-[#0EB300]"
                            : response?.refundStatus === "pending"
                            ? "text-[#515ada]"
                            : "text-red-500"
                        }`}
                      >
                        {response?.refundStatus}
                      </span>
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
        </div>
      </div>
    </div>
  );
};

export default Refund;
