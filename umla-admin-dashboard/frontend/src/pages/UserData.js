import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveVerification,
  getUsers,
  secondOffer,
} from "../redux/actions/adminActions";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "../css/paginate.css";
import { MagnifyingGlass, SpinnerGap } from "@phosphor-icons/react";

const UserData = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.getUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const {
    users,
    total,
    loading,
    totalApproved,
    totalVerified,
    coffeeClaimed,
    maleCount,
    femaleCount,
    verificationDenied,
  } = userData;

  useEffect(() => {
    setPageCount(Math.ceil((total || 0) / 20));
  }, [total]);

  useEffect(() => {
    dispatch(getUsers(currentPage, searchInput));
  }, [dispatch, currentPage, searchInput]);

  const handleApproveClick = (id) => {
    dispatch(approveVerification({ userId: id }));
    setTimeout(() => {
      dispatch(getUsers(currentPage, searchInput));
    }, 500);
  };

  const handleSelect = (e, index) => {
    const selectedValue = e.target.value;
    const user = users[index];
    const isSelected = window.confirm(
      `Are you sure you want to offer ${user.name}, ${selectedValue} days premium?`
    );

    if (isSelected) {
      dispatch(secondOffer({ userId: user._id, days: selectedValue }));
      setTimeout(() => {
        dispatch(getUsers(currentPage, searchInput));
      }, 500);
    }
  };

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  }


  const formatDate = (time) => {
    let date = time.toISOString().slice(0, 10);
    let formattedDate = date.split("-").reverse().join("/");
    return <>{formattedDate}</>;
  };
  // 
  return (
    <div style={{ maxHeight: "calc(100vh - 100px)",  overflowY:'hidden',width:"100%",marginLeft:"0px"}}>
      <div className="h-screen overflow-y-auto user-Data w-full  ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 my-2 md:my-4 mx-10 ">
          <div className="rounded-[10px] py-4 px-12 shadow-[0px_4px_23px_1px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center gap-3 h-[100px]">
            <span className="text-xl text-[#646464] font-semibold min-w-max flex items-center gap-1">
              Total Users:
              <span className="text-[#515ADA] text-xl">{total}</span>
            </span>
            <span className="text-[#515ADA] text-lg min-w-max">
              {loading ? (
                <span className="animate-spin">
                  <SpinnerGap size={35} />
                </span>
              ) : (
                <div className="flex gap-4">
                  <span> M : {maleCount}</span>
                  <span> F : {femaleCount}</span>
                </div>
              )}
            </span>
          </div>
          <div className="rounded-[10px] py-4 px-12 shadow-[0px_4px_23px_1px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center  h-[100px]">
            <span className="text-[15px] text-[#646464]  font-semibold min-w-max">
              Total Verified:
            </span>
            <span className="text-[#515ADA] text-[30px] fom">
              {loading ? (
                <span className="animate-spin">
                  <SpinnerGap size={35} />
                </span>
              ) : (
                <span> {totalVerified}</span>
              )}
            </span>
          </div>

          <div className="rounded-[10px] py-4 px-12 shadow-[0px_4px_23px_1px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center  h-[100px]">
            <span className="text-[15px] text-[#646464]  font-semibold min-w-max">
              Total Pending:
            </span>
            <span className="text-[#515ADA] text-[30px] fom">
              {loading ? (
                <span className="animate-spin">
                  <SpinnerGap size={35} />
                </span>
              ) : (
                <span> {total - totalVerified - verificationDenied}</span>
              )}
            </span>
          </div>

          <div className="rounded-[10px] py-4 px-12 shadow-[0px_4px_23px_1px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center  h-[100px]">
            <span className="text-[15px] text-[#646464]  font-semibold min-w-max">
              Total Denied:
            </span>
            <span className="text-[#515ADA] text-[30px] fom">
              {loading ? (
                <span className="animate-spin">
                  <SpinnerGap size={35} />
                </span>
              ) : (
                <span> {verificationDenied}</span>
              )}
            </span>
          </div>

          <div className="rounded-[10px] py-4 px-12 shadow-[0px_4px_23px_1px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center  h-[100px]">
            <span className="text-[15px] text-[#646464] font-semibold min-w-max">
              Total Approved:
            </span>
            <span className="text-[#515ADA] text-[30px] min-w-max">
              {loading ? (
                <span className="animate-spin">
                  <SpinnerGap size={35} />
                </span>
              ) : (
                <span>{totalApproved}</span>
              )}
            </span>
          </div>

          <button
            onClick={() => navigate("/coupon_details")}
            className="rounded-[10px] py-4 px-12 shadow-[0px_4px_23px_1px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center h-[100px]"
          >
            <span className="text-[15px] text-[#646464] font-semibold min-w-max">
              Coffee Given:
            </span>
            <span className="text-[#515ADA] text-[30px] min-w-max">
              {loading ? (
                <span className="animate-spin">
                  <SpinnerGap size={35} />
                </span>
              ) : (
                <span> {coffeeClaimed}</span>
              )}
            </span>
          </button>
        </div>
        <div className="border rounded-[40px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] bg-white p-4 md:p-5 my-2 md:my-4 mx-4 md:mx-5">
          <div className="md:my-2">
            <div className="flex border border-[#646464] border-opacity-50 w-80 rounded-lg p-3 items-center gap-3 my-2 mb-8 mx-2">
              <MagnifyingGlass size={22} />
              <input
                type="text"
                placeholder="Search User"
                className="text-black outline-none w-full"
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div>
            <table className="min-w-full ">
              <thead className="border-b-2">
                <tr className="text-[#646464] font-normal text-base ">
                  <th className="pb-2 font-normal my-2">S.No</th>
                  <th className="pb-2 font-normal">Name</th>
                  <th className="pb-2 font-normal">Account Created</th>
                  <th className="pb-2 font-normal ">Gender</th>
                  <th className="pb-2 font-normal">Number</th>
                  <th className="pb-2 font-normal ">Date of Birth</th>
                  <th className="pb-2 font-normal ">Verification Status</th>
                  <th className="pb-2 font-normal ">Offer 1</th>
                  <th className="pb-2 font-normal ">Referral Status</th>
                  <th className="pb-2 font-normal ">Offer 2</th>
                </tr>
              </thead>

              <tbody>
                {users?.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b-[1px] last:border-none text-center"
                  >
                    <td>{20 * (currentPage - 1) + index + 1}</td>

                    <td
                      className={`py-5 text-[#515ADA] ${
                        user.name ? "" : "py-7"
                      }`}
                    >
                      <Link to={`/user_profile/${user._id}`}>{user.name}</Link>
                    </td>

                    <td>
                      <Link
                        to={`/user_profile/${user._id}?page=${currentPage}`}
                      >
                        {formatDate(new Date(user.createdAt))}
                      </Link>
                    </td>
                    <td>{user.gender}</td>
                    <td>
                      <Link to={`/user_profile/${user._id}`}>
                        {user.contactNumber}
                      </Link>
                    </td>
                    <td>{user.dob}</td>
                    <td className="text-center">
                      <div className=" text-center flex justify-center items-center py-4">
                        <span
                          className={`  bg-blue-600 text-white items-center px-4 py-1 rounded-lg  ${
                            user.verified
                              ? "bg-green-500"
                              : user.verificationDenied
                              ? "bg-red-500"
                              : ""
                          }`}
                        >
                          {user.verified
                            ? "Verified"
                            : user.verificationDenied
                            ? "Denied"
                            : "Pending"}
                        </span>
                      </div>
                    </td>

                    <td>
                      {user.gender === "Female" ? (
                        <button
                          onClick={() => handleApproveClick(user._id)}
                          disabled={!user.verified || user.claimable}
                          className={` border-2  rounded-lg p-1 px-3 ${
                            user.verified
                              ? "border-[#515ADA] text-[#515ADA]"
                              : "border-[#646464] text-[#646464]"
                          } ${
                            user.claimable && user.verified
                              ? "bg-[#51DA77] border-none py-2  text-white"
                              : ""
                          }`}
                        >
                          {user.claimable && user.verified
                            ? "Approved"
                            : "Approve"}
                        </button>
                      ) : (
                        "No Offer"
                      )}
                    </td>
                    <td className=" text-center">
                      {user.referralStatus ? "Complete" : "Incomplete"}
                    </td>
                    <td>
                      {user.offerTwo.offerBool && user.referralStatus ? (
                        <div>{user.offerTwo.days} days Premium</div>
                      ) : user.referralStatus ? (
                        <select
                          onChange={(e) => {
                            handleSelect(e, index);
                          }}
                          className="border border-black p-2"
                        >
                          <option>Choose Offer</option>
                          <option value={2}>Two Day Premium</option>
                          <option value={7}>One Week Premium</option>
                        </select>
                      ) : (
                        "Referral Pending"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt- md:mt-4 items-center justify-center flex">
            <ReactPaginate
              className="react-paginate gap-2 p-2 items-center justify-center flex lg:text-lg md:text-base w-fit rounded-xl"
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

export default UserData;
