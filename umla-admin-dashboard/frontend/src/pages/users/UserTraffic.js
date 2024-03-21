import { MagnifyingGlass} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getUserTraffic } from "../../redux/actions/userActions";

const UserTraffic = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();

  const userTrafficData = useSelector((state)=> state.getUserTraffic)
  const { userTraffic } = userTrafficData;

  useEffect(()=> {
    dispatch(getUserTraffic(searchInput));
  }, [dispatch, searchInput]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  }
  // const handlePageClick = ({ selected: selectedPage }) => {
  //   setCurrentPage(selectedPage + 1);
  // };

  // useEffect(() => {
  //   if (userTraffic) {
  //     setPageCount(Math.ceil(userTraffic.length / 20));
  //   }
  // }, [userTraffic]);

  return (
    <div>
        <div className="bg-white p-4 flex rounded-lg items-center gap-4 ">
          <div className="border border-gray-300 rounded-lg p-2 px-10 flex items-center gap-2">
            <MagnifyingGlass size={20} />
            <input type="text" placeholder="Search city" className=" outline-none" onChange={handleSearchChange}/>
          </div>
        </div>
        <div className="bg-white p-4 mt-5 rounded-lg flex flex-col gap-10 items-center">
          <table className="min-w-full ">
            <colgroup>
            <col style={{ width: "30%" }} />
            </colgroup>
            <thead className="border-b-2">
              <tr className="text-[#646464] font-normal text-base">
                <th className="pb-2 font-normal my-2">Location</th>
                <th className="pb-2 font-normal ">Total Users</th>
                <th className="pb-2 font-normal ">Male Users</th>
                <th className="pb-2 font-normal ">Female Users</th>


              </tr>
            </thead>

            <tbody>
              {userTraffic?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b-[1px] last:border-none text-center"
                >
                  <td className="py-[13px]">{item._id}</td>
                  <td>{item.count}</td>
                  <td>{item.male}</td>
                  <td>{item.female}</td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* <ReactPaginate
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
          /> */}
        </div>

    </div>
  );
};

export default UserTraffic;
