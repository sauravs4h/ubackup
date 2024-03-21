import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { coffeeGiven } from "../redux/actions/adminActions";
import { Link } from "react-router-dom";

const CouponDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const dispatch = useDispatch();

  const coffeeData = useSelector((state) => state.coffeeGiven);
  //   console.log(coffeeData);

  const { coupons, total } = coffeeData;

  useEffect(() => {
    dispatch(coffeeGiven(currentPage));
  }, [dispatch, currentPage]);

  //   {pagination}
  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    setPageCount(Math.ceil((total || 0) / 20));
  }, [total]);

  const formatDate = (time) => {
    let date = new Date(time);

    let day = ("0" + date.getUTCDate()).slice(-2);
    let month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    let year = date.getUTCFullYear();

    let hours = ("0" + date.getUTCHours()).slice(-2);
    let minutes = ("0" + date.getUTCMinutes()).slice(-2);

    let formattedDate = `${day}/${month}/${year}`;
    let formattedTime = `${hours}:${minutes}`;

    return (
      <>
        <td>{formattedDate}</td>
        <td>{formattedTime}</td>
      </>
    );
  };

  return (
    <div>
      <div className="border rounded-[40px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] bg-white p-4 md:p-5 my-2 md:my-4 mx-4 md:mx-5">
        <table className="min-w-full">
          <thead className="border-b-2">
            <tr className="text-[#646464] font-normal text-base ">
              <th className="pb-2 font-normal my-2">S.No</th>
              <th className="pb-2 font-normal">Name</th>
              <th className="pb-2 font-normal">Cafe</th>
              <th className="pb-2 font-normal ">Item</th>
              <th className="pb-2 font-normal">Date</th>
              <th className="pb-2 font-normal ">Time Slot</th>
              <th className="pb-2 font-normal ">Whatsapp Number</th>
            </tr>
          </thead>

          <tbody>
            {coupons?.map((coupon, index) => (
              <tr
                key={coupon._id}
                className="border-b-[1px] last:border-none text-center"
              >
                <td className="py-2">{20 * (currentPage - 1) + index + 1}</td>

                <td
                  className={`py-5 text-[#515ADA] ${
                    coupon?.owner?.name ? "" : "py-7"
                  }`}
                >
                  <Link to={`/user_profile/${coupon.owner?._id}`}>
                    {coupon?.owner?.name}
                  </Link>
                </td>

                <td>{coupon?.outlet?.name}</td>
                <td>{coupon?.item?.name}</td>
                {formatDate(new Date(coupon?.time))}
                <td>
                  <Link to={`/user_profile/${coupon.owner?._id}`}>
                    {coupon?.owner?.whatsappNumber}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 md:mt-4 items-center justify-center flex">
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
  );
};

export default CouponDetails;
