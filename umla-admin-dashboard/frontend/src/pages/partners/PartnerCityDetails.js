import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getPartnerCityDetails } from "../../redux/actions/partnerActions";
import Loader from "../../components/loader/Loader";
import { MagnifyingGlass } from "@phosphor-icons/react";

const PartnerCityDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const dispatch = useDispatch();
  const cityData = useSelector((state) => state.getPartnerCityDetails);
  const { cityDetials, loading } = cityData;

  useEffect(() => {
    dispatch(getPartnerCityDetails(currentPage, searchInput));
  }, [currentPage, dispatch, searchInput]);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    if (cityDetials) {
      setPageCount(Math.ceil(cityDetials.length / 20));
    }
  }, [cityDetials]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div>
      <div className="bg-white p-3 flex rounded-lg items-center gap-4 ">
        <div className="border border-gray-300 rounded-lg p-2 px-8 flex items-center gap-2">
          <MagnifyingGlass size={20} />
          <input
            placeholder="Search"
            className=" outline-none "
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="bg-white p-4 mt-5 rounded-lg flex flex-col gap-10 items-center">
        {loading ? (
          <Loader />
        ) : (
          <table className="min-w-full table-left">
            <thead className="border-b-2">
              <tr className="text-[#646464] font-normal text-base">
                <th className="pb-2 font-normal my-2">Location</th>
                <th className="pb-2 font-normal">Restro</th>
                <th className="pb-2 font-normal ">Total Bookings</th>
              </tr>
            </thead>

            <tbody>
              {cityDetials?.map((item, index) => (
                <tr key={index} className="border-b-[1px]  text-center">
                  <td className="py-[13px]">{item?.city}</td>
                  <td>{item?.outletCount}</td>
                  <td className="py-[13px]">{item?.bookingsCount}</td>
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

export default PartnerCityDetails;
