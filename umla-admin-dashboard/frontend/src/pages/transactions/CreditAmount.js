import {
  DotOutline,
  DotsThreeVertical,
  DownloadSimple,
  FunnelSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getCreditAmount } from "../../redux/actions/partnerActions";
import Loader from "../../components/loader/Loader";
import dropdown from "../../assets/images/dropdown.png";
import Slider from "react-slider";
import { CSVLink } from "react-csv";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
const MIN = 0;
const MAX = 5000;

const CreditAmount = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [rangeValue, setRangeValue] = useState([MIN, MAX]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [showDate, setShowDate] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const dispatch = useDispatch();
  const [csvData, setCsvData] = useState([]);
  const [openDropdown, setOpenDropdown] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const [options, setOptions] = useState([
    {
      name: "Transaction ID",
      isActive: true,
    },
    {
      name: "Name",
      isActive: true,
    },
    {
      name: "Item",
      isActive: true,
    },
    {
      name: "Restaurant",
      isActive: false,
    },
    {
      name: "Date",
      isActive: true,
    },
    {
      name: "Time",
      isActive: true,
    },
    {
      name: "Invoice No.",
      isActive: true,
    },
    {
      name: "Taxable Value",
      isActive: true,
    },
    {
      name: "GST %",
      isActive: true,
    },
    {
      name: "SGST Tax",
      isActive: true,
    },
    {
      name: "CGST Tax",
      isActive: true,
    },
    {
      name: "Quantity",
      isActive: false,
    },
    {
      name: "Amount",
      isActive: false,
    },
    {
      name: "Platform fee",
      isActive: true,
    },
    {
      name: "Platform fee (GST)",
      isActive: true,
    },
    {
      name: "Total",
      isActive: true,
    },
    {
      name: "Status",
      isActive: true,
    },
  ]);

  const [selectedOptions, setSelectedOptions] = useState(options);
  const [selectAll, setSelectAll] = useState(false);

  const creditData = useSelector((state) => state.getCreditAmount);
  const { responseData } = creditData;
  

  const formatDate = (inputDate) => {
    const formattedDay = String(inputDate.getDate()).padStart(2, '0');
    const formattedMonth = String(inputDate.getMonth() + 1).padStart(2, '0');
    const formattedYear = inputDate.getFullYear();
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  }

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    if (responseData) {
      setPageCount(Math.ceil(responseData.length / 30));
    }
  }, [responseData]);

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setSelectedStatus(selectedStatus);
  };

  const handleOptions = (index) => {
    const updatedOptions = [...options];
    updatedOptions[index].isActive = !updatedOptions[index].isActive;
    setOptions(updatedOptions);
  };

  const handleDropDown = (index) => {
    const updatedOpenDropdown = [...openDropdown];
    updatedOpenDropdown[index] = !updatedOpenDropdown[index];
    setOpenDropdown(updatedOpenDropdown);
  };

  const handleCheckboxChange = (transactionID) => {
    const isSelected = selectedTransactions.includes(transactionID);

    if (isSelected) {
      setSelectedTransactions((prevSelected) =>
        prevSelected.filter((id) => id !== transactionID)
      );
    } else {
      setSelectedTransactions((prevSelected) => [
        ...prevSelected,
        transactionID,
      ]);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedTransactions(
      selectAll ? [] : responseData?.map((response) => response.transactionID)
    );
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    if (responseData) {
      const csvDataTemp = responseData.map((response, index) => ({
        transactionID: response.transactionID,
        name: response.name,
        item: response.item,
        restaurant: response.restaurant,
        date: response.date,
        time: response.time,
        invoiceNo: response.invoiveNo,
        taxableValue: response.taxableValue,
        gst: response.GST,
        sgst: response.sgst,
        cgst: response.cgst,
        quantity: response.quantity,
        amount: response.amount,
        platformfee: response.platformfee,
        platformfeeGst: response.platformfeeGst,
        total: response.total,
        status: response.status,
      }));
      setCsvData(csvDataTemp);
    }
  }, [responseData]);

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handleDateSelect = (date) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    console.log(date);
  };

  useEffect(() => {
    const formateedStartDate = formatDate(startDate);
    const formateedEndDate = formatDate(endDate);

    dispatch(
      getCreditAmount(
        currentPage,
        searchInput,
        selectedStatus,
        rangeValue[0],
        rangeValue[1],
        formateedStartDate,
        formateedEndDate
      )
    );
  }, [currentPage, dispatch, rangeValue, searchInput, selectedStatus, startDate, endDate]);

  return (
    <div style={{ width: "calc(100vw - 370px)" }}>
      <div className="bg-white p-3 flex rounded-lg items-center justify-between">
        <div className="flex items-center gap-4 ">
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

          <div className=" relative w-32">
            <select
              onChange={(e) => {
                handleStatusChange(e);
              }}
              className="w-full py-2 px-3 bg-[#F7F9FB] border border-gray-400 rounded shadow-md appearance-none"
            >
              <option value="">Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <img
              src={dropdown}
              alt=""
              className=" absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
          </div>

          <div className="relative flex justify-center ">
            <button
              onClick={() => setShowPriceRange(!showPriceRange)}
              className="p-2 px-4 bg-[#F7F9FB] border border-gray-400 rounded shadow-md flex gap-3 items-center"
              style={{ zIndex: showPriceRange ? 1 : "auto" }}
            >
              <span>Transaction</span>
              <img src={dropdown} alt="" />
            </button>

            {showPriceRange && (
              <div className="absolute z-20 mt-2 top-10 ">
                <div className="bg-white p-4 rounded-lg border border-gray-400">
                  <span>Amount: </span>
                  <Slider
                    className="slider mt-3"
                    onChange={setRangeValue}
                    value={rangeValue}
                    min={MIN}
                    max={MAX}
                  />
                  <div className="mt-4 flex justify-center items-center gap-5">
                    <input
                      className="w-28 border border-black text-center"
                      type="number"
                      value={rangeValue[0]}
                      onChange={(e) =>
                        setRangeValue([+e.target.value, rangeValue[1]])
                      }
                    />
                    <input
                      className="w-28 border border-black text-center"
                      type="number"
                      value={rangeValue[1]}
                      onChange={(e) =>
                        setRangeValue([rangeValue[0], +e.target.value])
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className=" relative flex justify-center w-48 ">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 px-4 bg-[#F7F9FB] border border-gray-400 rounded shadow-md flex gap-3 items-center"
            >
              <span>View Tabs</span>
              <img src={dropdown} alt="" />
            </button>

            {showOptions && (
              <div className=" bg-[#d6d6d6] rounded-md absolute top-full left-0 mt-2 w-full p-3  ">
                <ul>
                  {options?.map((item, index) => (
                    <li key={index}>
                      <label className="flex gap-2">
                        <input
                          type="checkbox"
                          className="border border-black"
                          checked={item.isActive}
                          onChange={() => handleOptions(index)}
                        />
                        <span>{item.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="relative flex justify-center w-48">
          <CSVLink
            className="downloadbtn"
            data={
              selectedTransactions.length === 0
                ? csvData
                : csvData.filter((transaction) =>
                    selectedTransactions.includes(transaction.transactionID)
                  )
            }
            filename={"transactions.csv"}
          >
            <button className="flex items-center rounded shadow-md border border-gray-400 ">
              <span className="p-2 px-4 bg-[#F7F9FB] font-semibold  ">
                Download
              </span>
              <span className="py-[10px] px-4 bg-black  ">
                <DownloadSimple size={20} fill="white" />
              </span>
            </button>
          </CSVLink>
        </div>
      </div>

      <div className="overflow-x-auto bg-white p-4 mt-3 rounded-lg flex flex-col gap-10 items-center">
        {/* {loading ? (
    <Loader />
  ) : ( */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b-2">
              <tr className="text-[#646464] font-normal text-base items-center">
                <th
                  style={{ minWidth: "80px" }}
                  className="pb-2 font-normal my-2"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 mt-2"
                    onChange={handleSelectAll}
                    checked={selectAll}
                  />
                </th>

                {selectedOptions.map((item, index) => {
                  if (item.isActive) {
                    return (
                      <th
                        style={{ minWidth: "220px" }}
                        className="pb-2 font-normal my-2"
                        key={index}
                      >
                        {item.name}
                      </th>
                    );
                  }
                  return null;
                })}
                <th
                  style={{ minWidth: "2px" }}
                  className="pb-2 font-normal my-2"
                ></th>
              </tr>
            </thead>

            <tbody>
              {responseData?.map((response, index) => (
                <tr key={index} className="border-b-[1px] text-center">
                  <td className="py-[13px] ">
                    <input
                      type="checkbox"
                      className="h-4 w-4 mt-2"
                      onChange={() =>
                        handleCheckboxChange(response?.transactionID)
                      }
                      checked={selectedTransactions.includes(
                        response?.transactionID
                      )}
                    />
                  </td>

                  {selectedOptions.map((option, index) => {
                    if (option.isActive) {
                      if (option.name === "Transaction ID") {
                        return <td key={index}>{response?.transactionID}</td>;
                      } else if (option.name === "Name") {
                        return <td key={index}>{response?.name}</td>;
                      } else if (option.name === "Item") {
                        return (
                          <td>
                            {response?.item?.map((item, itemIndex) => (
                              <span key={itemIndex} className="flex flex-col">
                                {item}
                              </span>
                            ))}
                          </td>
                        );
                      } else if (option.name === "Restaurant") {
                        return <td key={index}>{response?.restaurant}</td>;
                      } else if (option.name === "Date") {
                        return <td key={index}>{response.date}</td>;
                      } else if (option.name === "Time") {
                        return <td key={index}>{response.time}</td>;
                      } else if (option.name === "Invoice No.") {
                        return <td key={index}>{response?.invoiveNo}</td>;
                      } else if (option.name === "Taxable Value") {
                        return <td key={index}>{response?.taxableValue}</td>;
                      } else if (option.name === "GST %") {
                        return <td key={index}>{response?.GST}</td>;
                      } else if (option.name === "SGST Tax") {
                        return <td key={index}>{response?.sgst}</td>;
                      } else if (option.name === "CGST Tax") {
                        return <td key={index}>{response.cgst}</td>;
                      } else if (option.name === "Quantity") {
                        return <td key={index}>{response?.quantity}</td>;
                      } else if (option.name === "Amount") {
                        return <td key={index}>{response?.amount}</td>;
                      } else if (option.name === "Platform fee") {
                        return <td key={index}>{response?.platformfee}</td>;
                      } else if (option.name === "Platform fee (GST)") {
                        return <td key={index}>{response?.platformfeeGst}</td>;
                      } else if (option.name === "Total") {
                        return <td key={index}>{response?.total}</td>;
                      } else if (option.name === "Status") {
                        return (
                          <td
                            className="items-center flex py-3 justify-center "
                            key={index}
                          >
                            <span>
                              <DotOutline
                                size={36}
                                weight="fill"
                                fill={`${
                                  response?.status === "success"
                                    ? "#0EB300"
                                    : response?.status === "pending"
                                    ? "#515ada"
                                    : "red"
                                }`}
                              />
                            </span>
                            <span
                              className={`${
                                response?.status === "success"
                                  ? "text-[#0EB300]"
                                  : response?.status === "pending"
                                  ? "text-[#515ada]"
                                  : "text-red-600"
                              }`}
                            >
                              {response?.status}
                            </span>
                          </td>
                        );
                      }
                    }
                    return null;
                  })}
                  <td>
                    {openDropdown[index] && (
                      <button className="absolute right-14 bg-[#d2d2d2] mt-7 p-2 rounded-lg flex items-center gap-4 ">
                        <span>Dowload Invoice</span>
                        <DownloadSimple size={20} />
                      </button>
                    )}

                    <button
                      className="relative z-10"
                      onClick={() => handleDropDown(index)}
                    >
                      <DotsThreeVertical size={32} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* )} */}

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

export default CreditAmount;
