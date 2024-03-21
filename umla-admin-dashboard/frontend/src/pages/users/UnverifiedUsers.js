import { MagnifyingGlass } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getUnVerifiedUsers } from "../../redux/actions/userActions";
import Loader from "../../components/loader/Loader";
import { Link } from "react-router-dom";

const UnverifiedUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const dispatch = useDispatch();
  const unverifiedUsersData = useSelector((state) => state.getUnVerifiedUsers);
  const { responseData, loading } = unverifiedUsersData;

  useEffect(() => {
    dispatch(getUnVerifiedUsers(currentPage, searchInput));
  }, [dispatch, currentPage, searchInput]);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    if (responseData) {
      setPageCount(Math.ceil(responseData.length / 20));
    }
  }, [responseData]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div>

        <div className="bg-white p-4 flex justify-between rounded-lg items-center gap-4 ">
          <div className="border border-gray-300 rounded-lg p-2 px-8 flex items-center gap-2">
            <MagnifyingGlass size={20} />
            <input
              placeholder="Search"
              className=" outline-none"
              onChange={handleSearchChange}
            />
          </div>

          <Link to="/users" className="text-white bg-[#515ada] p-2 px-6 rounded-lg">Back</Link>
        </div>
        <div className="bg-white p-4 mt-5 rounded-lg flex flex-col gap-10 items-center">
          {loading ? (
            <Loader />
          ) : (
            <table className="min-w-full ">
              <thead className="border-b-2">
                <tr className="text-[#646464] font-normal text-base">
                  <th className="pb-2 font-normal my-2">User Name</th>
                  <th className="pb-2 font-normal">User Number</th>
                  <th className="pb-2 font-normal ">User Email</th>
                  <th className="pb-2 font-normal ">Date of Birth</th>
                  <th className="pb-2 font-normal ">City</th>
                </tr>
              </thead>

              <tbody>
                {responseData?.map((response, index) => (
                  <tr
                    key={index}
                    className="border-b-[1px] last:border-none text-center"
                  >
                    <td className="flex items-center gap-2 justify-center py-[13px]">
                      <Link
                        className=" text-[#515ada] "
                        to={`/userProfile/${response.userId}`}
                      >
                        {response?.userName}
                      </Link>
                    </td>
                    <td className="py-[14px]">
                      <Link to={`/userProfile/${response.userId}`}>
                        {response?.userNumber}
                      </Link>
                    </td>
                    <td>{response?.userEmail}</td>
                    <td>{response?.dateOfBirth}</td>
                    <td>{response?.city}</td>
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

export default UnverifiedUsers;
