import {
    DotOutline,
    DotsThreeVertical,
    FunnelSimple,
    MagnifyingGlass,
  } from "@phosphor-icons/react";
  import React, { useState } from "react";
  import ReactPaginate from "react-paginate";
import avatar from '../../assets/images/avatar.png'


const DebitAmount = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const dummyArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
    const handlePageClick = ({ selected: selectedPage }) => {
      setCurrentPage(selectedPage + 1);
    };
    return (
      <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        <div className="  overflow-y-auto  ">
          <div className="bg-white p-4  rounded-lg flex flex-col gap-10 items-center">
            <table className="min-w-full ">
              <thead className="border-b-2">
                <tr className="text-[#646464] font-normal text-base">
                  <th className="pb-2 font-normal my-2">Transaction Id</th>
                  <th className="pb-2 font-normal">Total Amount</th>
                  <th className="pb-2 font-normal">Profit Cut</th>
                  <th className="pb-2 font-normal">Debited To</th>
                  <th className="pb-2 font-normal ">User ID</th>
                  <th className="pb-2 font-normal ">Order</th>
                  <th className="pb-2 font-normal ">Date</th>
                  <th className="pb-2 font-normal ">Time</th>
                  <th className="pb-2 font-normal ">Payment Gateway</th>
                  <th className="pb-2 font-normal ">Order Status</th>
                  <th className="pb-2 font-normal "></th>
                </tr>
              </thead>
  
              <tbody>
                {dummyArr.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b-[1px] text-center"
                  >
                    <td className="py-[13px]">15224021545</td>
                    <td>140 Rs.</td>
                    <td>₹ 50 </td>
                    <td>Starbucks</td>
                    <td>1222424</td>
                    <td>Coffee</td>
                    <td>05-10-1993</td>
                    <td>14:00 PM</td>
                    <td>UMLA_PAY</td>
                    <td className="items-center flex py-[13px] justify-center">
                      <span>
                        <DotOutline size={20} fill="red" />
                      </span>
                      Cancelled
                    </td>
                    <td>
                      <DotsThreeVertical size={32} />
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
              pageCount={10}
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
    );
}

export default DebitAmount