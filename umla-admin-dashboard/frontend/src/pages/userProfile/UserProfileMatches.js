import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getUserMatches } from "../../redux/actions/userActions";


const UserProfileMatches = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageCount, setPageCount] = useState(1);

  const dispatch = useDispatch();

  const meetupData = useSelector((state) => state.getUserMatches);
  const { matches } = meetupData;

  useEffect(() => {
    dispatch(getUserMatches());
  }, [dispatch]);

  // const handlePageClick = ({ selected: selectedPage }) => {
  //   setCurrentPage(selectedPage + 1);
  // }; // changing page number

  // useEffect(() => {
  //   if (dummyArr) {
  //     setPageCount(Math.ceil(dummyArr.length / 20));
  //   }
  // }, [dummyArr]); 

  return (
    <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
      <div className="  overflow-y-auto  ">

      <div className=" flex flex-col gap-20 items-center">
        <table className="min-w-full" style={{ tableLayout: "fixed" }}>
          <thead className="">
            <tr className=" font-normal text-base ">
              <th className="pb-2 font-normal my-2">Date</th>
              <th className="pb-2 font-normal ">Match Name</th>
              <th className="pb-2 font-normal">Gender</th>
              <th className="pb-2 font-normal">Offer Status</th>
              <th className="pb-2 font-normal">Offer Item</th>
              <th className="pb-2 font-normal ">Cafe</th>
              <th className="pb-2 font-normal ">Offer Date</th>
              <th className="pb-2 font-normal ">Offer Time</th>
            </tr>
          </thead>

          <tbody>
            {matches?.map((match, index) => (
              <tr key={index} className=" text-center">
                <td className="py-[13px] scroller ">{match?.date}</td>
                <td>{match?.partner}</td>
                <td>{match?.gender}</td>
                <td>{match?.offerStatus}</td>
                <td>{match?.offerItem}</td>
                <td>{match?.cafe}</td>
                <td>{match?.offerDate}</td>
                <td>{match?.offerTime}</td>
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
    </div>
  );
};

export default UserProfileMatches;
