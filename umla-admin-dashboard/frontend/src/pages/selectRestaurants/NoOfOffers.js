import React, { useContext } from "react";
import RestaurantContext from "../../components/Context";


const NoOfOffers = ({ handleClose, setShowViewBox }) => {
  const { setNoOfOffers } = useContext(RestaurantContext);

  const handleChange = (e) => {
    setNoOfOffers(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowViewBox(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-lg bg-white p-10 text-center flex flex-col gap-10">
        <h1 className="text-3xl font-semibold">Number of Offers</h1>
        <input
          className="p-3 border border-[#646464] rounded-md"
          type="number"
          required
          onChange={handleChange}
        />

        <div className="flex gap-5 items-center">
          <button
            onClick={handleClose}
            className="p-3 border border-red-500 text-red-500 rounded-md w-full"
          >
            Back
          </button>

          <button
            type="submit"
            className="p-3 bg-[#515ada] rounded-md text-white w-full font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    </form>
  );
};

export default NoOfOffers;
