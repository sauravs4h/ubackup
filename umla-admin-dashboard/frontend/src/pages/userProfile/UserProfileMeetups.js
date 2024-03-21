import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getUserMeetups } from "../../redux/actions/userActions";
import { Link } from "react-router-dom";

const UserProfileMeetups = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageCount, setPageCount] = useState(1);

  const dispatch = useDispatch();

  const meetupData = useSelector((state) => state.getUserMeetups);
  const { meetups } = meetupData;
  console.log(meetups);

  useEffect(() => {
    dispatch(getUserMeetups());
  }, [dispatch]);

  // const handlePageClick = ({ selected: selectedPage }) => {
  //   setCurrentPage(selectedPage + 1);
  // }; // changing page number

  // useEffect(() => {
  //   if (meetups) {
  //     setPageCount(Math.ceil(meetups.length / 20));
  //   }
  // }, [meetups]);

  return (
    <div>
      <div className=" flex flex-col gap-20 items-center">
        <table className="min-w-full">
          <thead>
            <tr className=" font-normal text-base">
              <th className="pb-2 font-normal my-2">Date</th>
              <th className="pb-2 font-normal ">Time</th>
              <th className="pb-2 font-normal ">Partner</th>
              <th className="pb-2 font-normal">Offer Item</th>
              <th className="pb-2 font-normal ">Cafe</th>
              <th className="pb-2 font-normal">Address</th>
              <th className="pb-2 font-normal">Offer Status</th>
              <th className="pb-2 font-normal ">Coupon Status</th>
            </tr>
          </thead>

          <tbody>
            {meetups?.map((meetup, index) => (
              <tr key={index} className=" text-center">
                <td className=" py-4 scroller ">{meetup?.date}</td>
                <td>{meetup?.time}</td>
                <td>
                <Link
                      className=" text-[#515ada]"
                      to={`/userProfile/${meetup.partnerId}`}
                    >
                      {meetup?.partner}
                    </Link>
                  </td>
                <td>{meetup?.offerItem}</td>

                <td>{meetup?.cafe}</td>
                <td style={{ width: "20%" }}>{meetup?.address}</td>
                <td>{meetup?.offerStatus}</td>

                <td>{meetup?.couponStatus}</td>
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

export default UserProfileMeetups;
