import {
  DotOutline,
  FunnelSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPartnersData } from "../../redux/actions/partnerActions";
import { getOutletCity } from "../../redux/actions/userActions";
import dropdown from "../../assets/images/dropdown.png";

const PartnersData = () => {
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [citySelected, setCitySelected] = useState("");

  const dispatch = useDispatch();

  const partnersData = useSelector((state) => state.getPartnersData);
  const { result } = partnersData;

  const outletcityData = useSelector((state) => state.getOutletCity);
  const { city } = outletcityData;

  useEffect(() => {
    dispatch(getPartnersData(currentPage, searchInput, citySelected));
  }, [citySelected, currentPage, dispatch, searchInput]);

  useEffect(() => {
    dispatch(getOutletCity());
  }, [dispatch]); // get city

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    if (result) {
      setPageCount(Math.ceil(result.length / 20));
    }
  }, [result]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSelect = (e) => {
    const citySelected = e.target.value;
    setCitySelected(citySelected);
  };

  return (
    <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }} className="partners-Datas">
      <div className="  overflow-y-auto  ">
        <div className="bg-white p-3 flex rounded-lg items-center gap-4 ">
          <FunnelSimple size={30} />
          <div className="border border-gray-300 rounded-lg p-2 px-8 flex items-center gap-2">
            <MagnifyingGlass size={20} />
            <input
              placeholder="Search"
              className=" outline-none"
              type="text"
              onChange={handleSearchChange}
            />
          </div>
          <div className="custom-select relative w-32">
            <select
              onChange={(e) => {
                handleSelect(e);
              }}
              className="w-full py-2 px-3 bg-[#F7F9FB] border border-gray-400 rounded shadow-md appearance-none"
            >
              <option value="">City</option>
              {city?.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
            <img
              src={dropdown}
              alt=""
              className=" absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>
        <div className="bg-white p-4 mt-5 rounded-lg flex flex-col gap-10 items-center">
          <table className="min-w-full ">
            <thead className="border-b-2">
              <tr className="text-[#646464] font-normal text-base">
                <th className="pb-2 font-normal my-2">Place Id</th>
                <th className="pb-2 font-normal">Name</th>
                <th className="pb-2 font-normal">Address</th>
                <th className="pb-2 font-normal ">City</th>
                <th className="pb-2 font-normal">Supervisor Name</th>
                <th className="pb-2 font-normal ">User Email</th>
                <th className="pb-2 font-normal ">Bookings</th>
                <th className="pb-2 font-normal ">Activity Status</th>
              </tr>
            </thead>

            <tbody>
              {result?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b-[1px] last:border-none text-center"
                >
                  <td
                    className="py-[13px] scroller "
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      maxWidth: "0",
                    }}
                  >
                    <div
                      style={{
                        animation: "scroll 7s linear infinite",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item?.id}
                    </div>
                  </td>

                  <style>{`
                      @keyframes scroll {
                        0% {
                          transform: translateX(100%);
                        }
                        100% {
                          transform: translateX(-100%);
                        }
                      }
                      .scroller {
                        width: 5%;
                      }
                    `}</style>
                  <td className="text-[#515ada]"><Link to={`/partnerDetails/${item?.id}`}>{item?.name}</Link></td>


                  <td style={{width: "20%"}}>{item?.address}</td>
                  <td>{item?.city}</td>
                  <td>{item?.managerName}</td>

                  <td>{item?.email}</td>
                  <td>{item?.bookingsCount}</td>

                  <td className="items-center flex py-[13px] justify-center">
                    <span>
                      <DotOutline
                        size={20}
                        fill={`${item?.status === "open" ? "#0EB300" : "red"}`}
                      />
                    </span>
                    <span
                      className={`${
                        item?.status === "open"
                          ? "text-[#0EB300]"
                          : "text-red-500"
                      }`}
                    >
                      {item?.status}
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
  );
};

export default PartnersData;
