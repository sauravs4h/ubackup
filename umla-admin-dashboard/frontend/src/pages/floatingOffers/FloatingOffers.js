import { FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFloatingOffers } from "../../redux/actions/partnerActions";

const FloatingOffers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const floatingData = useSelector((state) => state.getFloatingOffers);
  //   const { responseData } = floatingData;

  const dummyArr = [1, 2, 3, 4, 5];

  // console.log(responseData);

  useEffect(() => {
    dispatch(getFloatingOffers(currentPage, searchInput));
  }, [dispatch, currentPage, searchInput]);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  //   useEffect(() => {
  //     if (responseData) {
  //       setPageCount(Math.ceil(responseData.length / 20));
  //     }
  //   }, [responseData]);

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

      <div className="bg-white p-4 mt-4 mb-4  rounded-lg flex flex-col gap-10 items-center">
        <table className="min-w-full ">
          <thead className="border-b-2">
            <tr className="text-[#646464] font-normal text-base">
              <th className="pb-2 font-normal my-2">Offer Id</th>
              <th className="pb-2 font-normal ">User Name</th>
              <th className="pb-2 font-normal ">View Offer</th>
            </tr>
          </thead>

          <tbody>
            {dummyArr?.map((response, index) => (
              <tr key={index} className=" text-center">
                <td className="py-2">{response?.offerId}</td>
                <td className="flex items-center gap-4 justify-center py-[9px]">
                  <img
                    src={response?.image}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />

                  <span>{response?.name}</span>
                </td>

                <td>
                  <button
                    className="underline"
                    onClick={() => navigate(`/userOffers/${response.userId}`)}
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
    </div>
  );
};

export default FloatingOffers;
