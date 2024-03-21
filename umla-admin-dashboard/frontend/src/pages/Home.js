import {
  FunnelSimple,
  TrendUp,
  ArrowCircleRight,
  CaretLeft,
  CaretRight,
  DotOutline,
  ArrowRight,
  WarningCircle,
  PhoneOutgoing,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import dropdown from "../assets/images/dropdown.png";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

import {
  getDashboardAlerts,
  getDashboardNewMatch,
  getDashboardNewReports,
  getDashboardNewUsers,
  getDashboardOfferingItems,
  getDashboardRevenue,
  getDashboardTraffic,
  getDashboardUpperFigures,
} from "../redux/actions/partnerActions";


const HomePage = () => {
  const [userPageNumber, setUserPageNumber] = useState(1);
  const [reportPageNumber, setReportPageNumber] = useState(1);
  const [alertPageNumber, setAlertPageNumber] = useState(1);

  const [showDate, setShowDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const navigate = useNavigate();


  const upperBoxData = useSelector((state) => state.getDashboardUpperFigures);
  const newUserData = useSelector((state) => state.getDashboardNewUsers);
  const newReportData = useSelector((state) => state.getDashboardNewReports);
  const newMatchData = useSelector((state) => state.getDashboardNewMatch);
  const offeringItemsData = useSelector(
    (state) => state.getDashboardOfferingItems
  );

  const alertData = useSelector((state) => state.getDashboardAlerts);
  const revenueData = useSelector((state) => state.getDashboardRevenue);
  const trafficData = useSelector((state) => state.getDashboardTraffic);

  const {
    totalUsers,
    currentActiveUsers,
    currentOfferSent,
    todaySwipes,
    downloadCount,
    TotalMeetupCreated,
    cafePartners,
    totalQueries,
    paidUsersCount,
    unPaidUsersCount,
  } = upperBoxData;

  const { newUserResponce } = newUserData;
  const { newReportResponce } = newReportData;
  const { newMatchResponce } = newMatchData;
  const { responseData } = alertData;
  const { firstOfferingItem, secondOfferingItem, thirdOfferingItem } =
    offeringItemsData;

  const { revenueAmount, transitionResponce } = revenueData;
  const { userTraffic } = trafficData;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardNewMatch());
    dispatch(getDashboardTraffic());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDashboardNewUsers(userPageNumber));
  }, [dispatch, userPageNumber]);

  useEffect(() => {
    dispatch(getDashboardNewReports(reportPageNumber));
  }, [dispatch, reportPageNumber]);

  useEffect(() => {
    dispatch(getDashboardAlerts(alertPageNumber));
  }, [dispatch, alertPageNumber]);

  useEffect(() => {
    const formateedStartDate = formatDate(startDate);
    const formateedEndDate = formatDate(endDate);

    dispatch(getDashboardUpperFigures(formateedStartDate, formateedEndDate));
    dispatch(getDashboardRevenue(formateedStartDate, formateedEndDate));
    dispatch(getDashboardOfferingItems(formateedStartDate, formateedEndDate));
  }, [dispatch, endDate, startDate]);

  const activityData = [
    {
      name: "Users",
      Free: unPaidUsersCount,
      Premium: paidUsersCount,
    },
  ];

  const offeringData = [
    {
      name: firstOfferingItem?.name,
      sold: firstOfferingItem?.count,
    },
    {
      name: secondOfferingItem?.name,
      sold: secondOfferingItem?.count,
    },
    {
      name: thirdOfferingItem?.name,
      sold: thirdOfferingItem?.count,
    },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#653CA0",
    "#DA0037",
    "#32a852",
  ];

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handleDateSelect = (date) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
  };

  const formatDate = (inputDate) => {
    const formattedDay = String(inputDate.getDate()).padStart(2, "0");
    const formattedMonth = String(inputDate.getMonth() + 1).padStart(2, "0");
    const formattedYear = inputDate.getFullYear();
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  };

  return (
    <div className="home-pg">
     
      <div className="bg-white p-3 flex rounded-lg items-center gap-4 ">
        <FunnelSimple size={30} />

        <div>
          <button
            onClick={() => setShowDate(!showDate)}
            className="p-2 px-4 bg-[#F7F9FB] border border-gray-400 rounded shadow-md flex gap-3 items-center"
          >
            <span>Date</span>
            <img src={dropdown} alt="" />
          </button>

          {showDate && (
            <div className="absolute mt-2">
              <DateRangePicker
                ranges={[selectionRange]}
                onChange={handleDateSelect}
              />
            </div>
          )}
        </div>
      </div>

      <div className=" my-4 flex gap-4 items-center">
        <span className=" flex flex-col justify-center text-center py-4 gap-2 w-[210px] bg-white border border-[#ACACAC] rounded-lg ">
          <h1 className="text-lg">Total Users: {totalUsers?.totalUser}</h1>
          <span className=" flex gap-4 justify-center">
            <span className="text-blue-500">
              M: {totalUsers?.totalMaleUsers}
            </span>
            <span className=" text-pink-500">
              F: {totalUsers?.totalFemaleUsers}
            </span>
          </span>
        </span>

        <span className=" flex flex-col justify-center text-center py-5 gap-2 w-[210px] bg-white border border-[#ACACAC] rounded-lg ">
          <h1 className="">
            Current Active Users: {currentActiveUsers?.currentActiveUser}
          </h1>

          <span className=" flex gap-4 justify-center">
            <span className="text-blue-500">
              M: {currentActiveUsers?.currentActiveMale}
            </span>
            <span className=" text-pink-500">
              F: {currentActiveUsers?.currentActiveFemale}
            </span>
          </span>
          {/* <span>
              <TrendUp size={32} />
            </span> */}
        </span>

        <span className=" flex flex-col justify-center text-center py-6 w-[210px] bg-white border border-[#ACACAC] rounded-lg ">
          <h1>Today's Swipes</h1>
          <span>
            {todaySwipes}
            {/* <span>
              <TrendUp size={32} />
            </span> */}
          </span>
        </span>

        <span className=" flex flex-col justify-center text-center py-6  w-[210px] bg-white border border-[#ACACAC] rounded-lg ">
          <h1>Today's Offer Sent</h1>
          <span>
            {currentOfferSent}
            {/* <span>
              <TrendUp size={32} />
            </span> */}
          </span>
        </span>

        <span className=" flex flex-col justify-center text-center py-6 w-[210px] bg-white border border-[#ACACAC] rounded-lg ">
          <h1>Total Meetup Created</h1>
          <span>
            {TotalMeetupCreated}
            {/* <span>
              <TrendUp size={32} />
            </span> */}
          </span>
        </span>

        <span className=" flex flex-col justify-center text-center py-6 w-[210px] bg-white border border-[#ACACAC] rounded-lg ">
          <h1>Live Download Count</h1>
          <span>
            {downloadCount}
            {/* <span>
              <TrendUp size={32} />
            </span> */}
          </span>
        </span>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <div className="flex gap-2 text-center">
            <span className="w-1/2 bg-[#F3C82D] py-5 px-4 rounded-lg flex justify-between items-center">
              <span>
                <p className="font-bold text-lg my-1">{cafePartners}</p>
                <p>Cafe Partners</p>
              </span>

              <Link
                to="/partners"
                className="flex flex-col gap-1  items-center"
              >
                <ArrowCircleRight size={34} />
                <p className="text-sm">View Details</p>
              </Link>
            </span>

            <span className="w-1/2 bg-[#F3C82D] py-5 px-4 rounded-lg flex justify-between items-center">
              <span>
                <p className="font-bold text-lg my-1">{totalQueries}</p>
                <p>Queries</p>
              </span>

              <Link to="/queries" className="flex flex-col gap-1  items-center">
                <ArrowCircleRight size={34} />
                <p className="text-sm">View Details</p>
              </Link>
            </span>
          </div>

          <div className="flex gap-2 my-3">
            <div className="w-1/2 bg-white py-5 px-4 rounded-lg  items-center">
              <span className="flex justify-between">
                <h1 className="font-semibold">New Users</h1>
                <span className="flex">
                  <button
                    onClick={() => {
                      if (userPageNumber > 1) {
                        setUserPageNumber(userPageNumber - 1);
                      }
                    }}
                  >
                    <CaretLeft size={20} />
                  </button>
                  <button onClick={() => setUserPageNumber(userPageNumber + 1)}>
                    <CaretRight size={20} />
                  </button>
                </span>
              </span>

              {newUserResponce?.slice(0, 6)?.map((user, index) => (
                <div key={index} className="flex justify-between">
                  <span className="flex items-center gap-3 mt-5 ">
                    <img
                      src={user?.userImage}
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />
                    <span className="flex flex-col ">
                      <Link to={`/userProfile/${user.userId}`}>
                        {user?.userName}
                      </Link>
                      <span className="text-[10px] text-[#00000066]">
                        {user?.timeDiff}
                      </span>
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div className="w-1/2 bg-white py-5 px-4 rounded-lg  items-center">
              <span className="flex justify-between">
                <h1 className="font-semibold">Reports</h1>
                <span className="flex">
                  <button
                    onClick={() => {
                      if (reportPageNumber > 1) {
                        setReportPageNumber(reportPageNumber - 1);
                      }
                    }}
                  >
                    <CaretLeft size={20} />
                  </button>
                  <button
                    onClick={() => setReportPageNumber(reportPageNumber + 1)}
                  >
                    <CaretRight size={20} />
                  </button>
                </span>
              </span>

              {newReportResponce?.slice(0, 3)?.map((user, index) => (
                <div key={index}>
                  <span className="flex items-center gap-3 mt-5 mb-2 ">
                    <img
                      src={user?.userImage}
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />
                    <span className="flex flex-col ">
                      <Link>{user?.userName}</Link>
                      <span className="text-[10px] text-[#00000066]">
                        {user?.timeDiff}
                      </span>
                    </span>
                  </span>

                  <span className=" text-sm">{user?.report}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white py-5 px-4 rounded-lg  items-center">
            <span className="flex justify-between">
              <h1 className="font-semibold">New Matches</h1>
              <button
                onClick={() => navigate("/matchings")}
                className=" text-sm flex gap-1 items-center underline "
              >
                View All
                <ArrowRight size={18} />
              </button>
            </span>
            {newMatchResponce?.slice(0, 3).map((match, index) => (
              <div key={index} className="flex gap-6 mt-5 items-center  ">
                <img
                  src={match?.firstUserimage}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />

                <span className="flex flex-col ">
                  <span>{match?.firstUser}</span>
                  <span className=" text-[10px] text-[#00000066]">
                    {match?.timeDiff}
                  </span>
                </span>

                <span className="px-4 py-1 rounded-md text-white bg-[#515ada] ">
                  MATCH
                </span>

                <span className="flex flex-col text-xs ">
                  <span>Offer - {match?.restaurant}</span>
                  <span>({match?.offerDate})</span>
                </span>

                <img
                  src={match?.secondUserimage}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />

                <span>{match?.secondUser}</span>
              </div>
            ))}
          </div>

          <div className="my-3 bg-white py-5 px-4 rounded-lg  items-center">
            <h1 className="font-semibold">Most Offering Items</h1>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                layout="vertical"
                data={offeringData}
                margin={{
                  top: 20,
                  right: 10,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="sold" fill="#515ada" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-1/2 flex flex-col gap-2">
          <div className="flex gap-2 ">
            <div className=" traffic-location w-50 bg-white py-5 px-4 rounded-lg  items-center ">
              <h1 className="font-semibold">Traffic By Location</h1>

              <PieChart width={320} height={450}>
                <Pie
                  data={userTraffic}
                  cx={150}
                  cy={100}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                >
                  {userTraffic?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend/>
              </PieChart>
            </div>

            <div className="w-1/2 bg-white py-5 px-4 rounded-lg">
              <span className="flex justify-between mb-2">
                <h1 className="font-semibold">Revenue</h1>
                <button
                  onClick={() => navigate("/transactions")}
                  className=" text-sm flex gap-1 items-center underline "
                >
                  View All
                </button>
              </span>
              <span className="font-semibold text-xl">₹{revenueAmount}</span>

              <span className="flex flex-col gap-4 mt-4">
                {transitionResponce?.slice(0, 5).map((response, index) => (
                  <span key={index} className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <img
                        src={response?.image}
                        alt=""
                        className="h-10 w-10 rounded-full"
                      />
                      <span className="flex flex-col">
                        <span>{response?.name}</span>
                        <span className="text-xs text-[#00000066]">
                          {response?.date} at {response?.time}{" "}
                        </span>
                      </span>
                    </span>

                    <span className="text-lg">₹{response?.amount} </span>
                  </span>
                ))}
                
              </span>
            </div>
          </div>

          <div className="flex gap-2 ">
            <div className="w-1/2 bg-white py-5 px-4 rounded-lg  items-center">
              <h1 className="font-semibold mb-4">User Activity</h1>

              <BarChart
                width={260}
                height={440}
                data={activityData}
                margin={{
                  top: 30,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Free" fill="#515ada" width={50} />
                <Bar dataKey="Premium" fill="#D0B0FF" width={50} />
              </BarChart>
            </div>

            <div
              className="w-1/2 bg-white py-5 px-4 rounded-lg  items-center"
            >
              <span className="flex justify-between">
                <h1 className="font-semibold ">Alert Raised</h1>
                <span className="flex">
                  <button
                    onClick={() => {
                      if (alertPageNumber > 1) {
                        setAlertPageNumber(alertPageNumber - 1);
                      }
                    }}
                  >
                    <CaretLeft size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setAlertPageNumber(alertPageNumber + 1);
                    }}
                  >
                    <CaretRight size={20} />
                  </button>
                </span>
              </span>
              {responseData?.map((response, index) => (
                <div key={index}>
                  <span className=" my-2 flex text-[#000000B2] text-sm items-center ">
                    {response?.date}
                    <DotOutline size={24} weight="fill" color="#000000B2" />
                    {response?.time}
                  </span>

                  <span className=" mb-6 flex text-[#000000B2] text-sm items-center ">
                    {response?.restaurantName}
                  </span>

                  <span className="flex gap-5 items-center">
                    <img
                      src={response?.hostImage}
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />
                    <span className="flex flex-col">
                      <Link to={`/userProfile/${response.hostid}`}>
                        {response?.hostName}
                      </Link>
                      <span className="text-[#000000B2] text-sm">HOST</span>
                    </span>
                  </span>

                  <span className="flex gap-5 my-4 items-center">
                    <img
                      src={response?.guestImage}
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />
                    <Link to={`/userProfile/${response.guestid}`}>
                      {response?.guestName}
                    </Link>
                  </span>

                  <span className="flex gap-2 font-bold items-center justify-center text-white bg-[#F32D2D] px-6 py-1 rounded-lg">
                    <WarningCircle size={18} weight="fill" color="white" />
                    ALERT
                  </span>

                  <div className="flex gap-2 my-6">
                    <span className="bg-[#515ada] flex justify-center items-center text-white rounded-md px-4 py-1">
                      {response?.alertStatus === "resolved"
                        ? "Resolved"
                        : "Unresolved"}
                    </span>

                    <span className="bg-[#F5F5F5] flex justify-center text-xs items-center w-full rounded-md px-2 py-2">
                      {response?.alertReason}
                    </span>
                  </div>

                  <div className="flex ">
                    <span className="w-5/12 flex flex-col gap-4">
                      <span>{response?.restaurantName}</span>
                      <span>{response?.hostName}</span>
                      <span>{response?.guestName}</span>
                    </span>

                    <span className="w-7/12 flex flex-col gap-4">
                      <span className="px-4 py-1 border border-[#646464] border-opacity-30 items-center flex justify-center gap-2 rounded-md bg-[#F5F5F5] ">
                        <PhoneOutgoing size={18} weight="fill" />
                        {response?.restaurantNumber}
                      </span>

                      <span className="px-4 py-1 border border-[#646464] border-opacity-30 items-center flex justify-center gap-2 rounded-md bg-[#F5F5F5] ">
                        <PhoneOutgoing size={18} weight="fill" />
                        {response?.hostNumber}
                      </span>

                      <span className="px-4 py-1 border border-[#646464] border-opacity-30 items-center flex justify-center gap-2 rounded-md bg-[#F5F5F5] ">
                        <PhoneOutgoing size={18} weight="fill" />
                        {response?.guestNumber}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 ">
            <div className="w-1/2 bg-white py-5 px-4 rounded-lg text-center items-center">
              <h1 className="font-semibold">Weekly Reservation Number</h1>

              <button
                onClick={() => navigate("/bookings")}
                className="mt-6 bg-[#515ada] px-6 py-1 text-white rounded-lg "
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
