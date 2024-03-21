import {
  FunnelSimple,
  MagnifyingGlass,
  SealCheck,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/userActions";
import OneUserProfile from "../userProfile/OneUserProfile";
import { Link, useNavigate } from "react-router-dom";

const AllUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.getAllUsers);
  const [selectedUser, setSelectedUser] = useState(0);
  const navigate = useNavigate();

  const { users, verifiedProfiles, unVerifiedProfiles } = allUsers;

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    if (users) {
      setPageCount(Math.ceil(users.length / 20));
    }
  }, [users]);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    dispatch(getAllUsers(currentPage, searchInput));
  }, [dispatch, currentPage, searchInput]);

  const handleProfileOpen = (userId, index) => {
    setShowProfile(true);
    setSelectedUser(index);
  };

  const handleProfileClose = () => {
    setShowProfile(false);
  };

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => navigate("/verifiedUsers")}
          className="flex flex-col py-3 px-8 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] items-center bg-white rounded-md justify-center "
        >
          <span>Profiles Verified</span>
          <span>{verifiedProfiles}</span>
        </button>

        <button
          onClick={() => navigate("/unverifiedUsers")}
          className="flex flex-col py-3 px-8 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] bg-white rounded-md justify-center items-center"
        >
          <span>Profiles Unverified</span>
          <span>{unVerifiedProfiles}</span>
        </button>
      </div>

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
      <div className="bg-white p-4 mt-5 rounded-lg flex flex-col gap-10 items-center">
        <table className="min-w-full">
          <thead className="border-b-2">
            <tr className="text-[#646464]">
              <th className="pb-2  font-normal">User Name</th>
              <th className="pb-2 font-normal ">Contact Number</th>
              <th className="pb-2 font-normal ">User Email</th>
              <th className="pb-2 font-normal ">Location</th>
              <th className="pb-2 font-normal ">City</th>
              <th className="pb-2 font-normal "></th>
            </tr>
          </thead>

          <tbody>
            {users?.map((user, index) =>
              user.completed ? (
                <tr
                  key={index}
                  className="border-b-[1px] last:border-none text-center"
                >
                  <td className="py-5 text-[#515ADA]">
                    <Link to={`/userProfile/${user._id}`}>{user.name}</Link>
                    <span>
                      {user.verified ? (
                        <SealCheck size={20} fill="black" />
                      ) : (
                        ""
                      )}
                    </span>
                  </td>
                  <td>+912345643</td>

                  <td>{user.email}</td>
                  <td style={{width: "30%"}}>{user.location}</td>
                  <td>{user.city}</td>
                  <td>
                    <Link
                      className=" text-[#515ada] underline "
                      to={`/userProfile/${user._id}`}
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ) : (
                ""
              )
            )}
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

      {showProfile && (
        <div
          className="overlay-container"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backdropFilter: "blur(3px)",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "999",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <OneUserProfile
            userId={users[selectedUser]._id}
            handleProfileClose={handleProfileClose}
          />
        </div>
      )}
    </div>
  );
};

export default AllUsers;
