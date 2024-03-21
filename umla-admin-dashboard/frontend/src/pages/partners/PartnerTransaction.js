import {
  DotOutline,
  DotsThreeVertical,
  FunnelSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";

const PartnerTransaction = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const dummyArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };
  return (
    <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
      <div className="  overflow-y-auto  ">

        <div className="bg-white p-4 mt-5 rounded-lg flex flex-col gap-10 items-center">
          <table className="min-w-full ">
            <thead className="border-b-2">
              <tr className="text-[#646464] font-normal text-base">
                <th className="pb-2 font-normal my-2">Transaction ID</th>
                <th className="pb-2 font-normal">Amount Debited</th>
                <th className="pb-2 font-normal">Name</th>
                <th className="pb-2 font-normal ">City</th>
                <th className="pb-2 font-normal ">Address</th>
                <th className="pb-2 font-normal">Supervisor Name</th>
                <th className="pb-2 font-normal">User Email</th>
                <th className="pb-2 font-normal ">Payment Gateway</th>
                <th className="pb-2 font-normal "></th>
              </tr>
            </thead>

            <tbody>
              {dummyArr.map((item, index) => (
                <tr
                  key={index}
                  className="border-b-[1px] text-center"
                >
                  <td className="py-[13px] it">Tr1578999410055</td>
                  <td>₹ 200</td>
                  <td>Starbucks</td>
                  <td>Jaipur</td>

                  <td>Opposite Central Park Gate No. 4, C-Scheme</td>
                  <td>Geeta</td>
                  <td>chinmayee.apte@email.com</td>
                  <td>Paytm</td>
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
};

export default PartnerTransaction;
