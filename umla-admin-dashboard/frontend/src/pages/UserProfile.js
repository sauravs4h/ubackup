import React, { useEffect } from "react";
import { denyUserVerification, getUsersData, verifyProfile } from "../redux/actions/adminActions";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/loader/Loader";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userProfileData = useSelector((state) => state.getUsersData);

  const { user, loading } = userProfileData;

  useEffect(() => {
    dispatch(getUsersData(id));
  }, [id, dispatch]);

  const handleClickBack = () => {
    navigate("/early_bird");
  };

  const handleVerifyProfile = () => {
    dispatch(verifyProfile({ userId: id }));
    dispatch(getUsersData(id));
  };
  
  const handleDenyVerification = () => {
    const isSelected = window.confirm(
      `Are you sure you want to deny ${user?.name}'s Verification?`
    );

    if (isSelected) {
      dispatch(denyUserVerification({ userId: id }));

      setTimeout(() => {
        dispatch(getUsersData(id));
      }, 500);
    }
  };

  if (loading) {
    return <Loader />
  }
  return (
    <div>
    <div className=" my-[10px] mx-5 overflow-y-auto sm:max-h-[80vh]">
      <div className="border rounded-[40px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] bg-white p-5">
        <div className="mx-2 my-2 flex justify-between  flex-col md:flex-row  md:justify-between">
          <div className="flex flex-col md:flex-row items-center gap-5 md:gap-20">
            <div className= {`h-[220px] w-[210px] lg:w-[230px] lg:h-[240px] md:w-[210px] md:h-[200px] rounded-full ${!user?.verificationImage ? "" : "overflow-hidden"}`}>
              {!user?.verificationImage ? "Verification Image not Uploaded" : <img
                src={user?.verificationImage}
                alt="profile"
                className="w-full h-full "
              />}
             
            </div>
            <div className="">
              <ul className="list-none">
                <li className="py-2 text-[#252525] tracking-wider font-medium text-lg">
                  Name: {user?.name}
                </li>
                <li className="py-2 text-[#252525] tracking-wider font-medium text-lg">
                  Email: {user?.email}
                </li>
                <li className="py-2 text-[#252525] tracking-wider font-medium text-lg">
                  Gender: {user?.gender}
                </li>
                <li className="py-2 text-[#252525] tracking-wider font-medium text-lg">
                  DOB: {user?.dob}
                </li>
                <li className="py-2 text-[#252525] tracking-wider font-medium text-lg">
                  Contact No.:{user?.contactNumber}
                </li>
                <li className="py-2 text-[#252525] tracking-wider font-medium text-lg">
                  Location: {user?.location}
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-auto md:flex gap-5">
            <div>
            <button
              onClick={handleVerifyProfile}
              disabled={user?.verified}
              className={`py-3 px-6 text-lg text-white font-semibold rounded-lg ${
                user?.verified ? "bg-[#51DA77]" : "bg-[#515ADA]"
              }`}
            >
              {user?.verified ? "Verified" : "Verify Profile"}
            </button>
            </div>
            <div>
            {!user?.verified ? <button
            onClick={handleDenyVerification}
            disabled={user?.verified || user?.verificationDenied}
            className={` py-[10px] px-6 text-lg text-red-600  font-semibold rounded-lg border-2 border-red-600`}
          >
            {user?.verificationDenied ? "Denied" : "Deny"}
            </button> : 
            ""}
            
          </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold py-4">Verification Photo</h1>
          {!user?.verificationImage ? "Verification Image not Uploaded" : <img
            src={user?.verificationImage}
            alt=""
            className="h-[250px] w-[200px] rounded-xl"
          ></img>}
          
        </div>

        <div>
          <h1 className="text-2xl font-semibold py-4">Uploaded Photo</h1>
          <div className="flex flex-wrap gap-5">
            {!user?.image ? <p> Images not Uploaded</p> : user?.image?.map((item, index) => (
              <img
                key={index}
                src={item}
                alt="profile"
                className="h-[250px] w-[230px] rounded-xl"
              />
            )) }
          </div>
        </div>
      </div>
      
    </div>
    <div className="p-5 text-right">
        <button
          onClick={handleClickBack}
          className="border-2 p-2 px-6 border-[#515ADA] rounded-lg font-bold tracking-wider text-lg"
        >
          {" "}
          Back
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
