import React, { useEffect } from "react";
import profilePicture from "../../assets/images/profilePicture.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/actions/userActions";
import { useParams } from "react-router-dom";

const UserProfileInfo = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.getUserProfile);
  const { profileInfo } = userData;

  useEffect(() => {
    dispatch(getUserProfile(id));
  }, [id, dispatch]);

  return (
    <div className="overflow-y-auto">
      <div className="border border-[#5E5E5E]  border-opacity-50 rounded-xl p-4 text-center flex flex-col gap-4 justify-center">
        <span className=" text-[#646464] text-left">User Details</span>

        <div className="grid grid-cols-4 gap-20">
          <div className="flex flex-col gap-4 text-left break-words ">
            <span>
              <span className="text-[#5E5E5E] mr-2">Height:</span>
              <span>{profileInfo?.height}</span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2">Gender:</span>
              <span>{profileInfo?.gender}</span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2  ">Location:</span>
              <span>{profileInfo?.location}</span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2">Hometown:</span>
              <span>{profileInfo?.hometown}</span>
            </span>
          </div>

          <div className="flex flex-col gap-4 text-left">
            <span>
              <span className="text-[#5E5E5E] mr-2">Languages:</span>
              <span>
                {profileInfo?.languages?.map((language, index) => (
                  <span key={index}>{language} </span>
                ))}
              </span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2">Star Sign:</span>
              <span>{profileInfo?.starSign}</span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2">Pronouns:</span>
              <span>{profileInfo?.pronouns}</span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2">Sexual Orientation:</span>
              <span>{profileInfo?.sexualOrientation}</span>
            </span>
          </div>

          <div className="flex flex-col gap-4 text-left">
            <span>
              <span className="text-[#5E5E5E] mr-2">Exercise:</span>
              <span>{profileInfo?.exercise}</span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2">Drinking:</span>
              <span>{profileInfo?.drinking}</span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2">Smoking:</span>
              <span>{profileInfo?.smoking}</span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2">Family:</span>
              <span>{profileInfo?.family}</span>
            </span>
          </div>

          <div className="flex flex-col gap-4 text-left">
            <span>
              <span className="text-[#5E5E5E] mr-2">Politics:</span>
              <span>{profileInfo?.politics}</span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2">Religion:</span>
              <span>{profileInfo?.religion}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex mt-6 gap-10">
        <div className="border border-[#5E5E5E]  border-opacity-50 rounded-xl p-4 text-center flex flex-col gap-2 justify-center w-1/2">
          <span className=" text-[#5E5E5E] text-left">Educational Details</span>
          <div className=" flex justify-between">
            <span>
              <span className="text-[#5E5E5E] mr-2">Institute Name:</span>
              <span>{profileInfo?.educationDetails?.instituteName}</span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2">Graudation Year:</span>
              <span>{profileInfo?.educationDetails?.graduationYear}</span>
            </span>
          </div>
        </div>

        <div className="border border-[#5E5E5E]  border-opacity-50 rounded-xl p-4 text-center flex flex-col gap-2 justify-center w-1/2">
          <span className=" text-[#5E5E5E] text-left">
            Professional Details
          </span>
          <div className=" flex gap-20">
            <span>
              <span className="text-[#5E5E5E] mr-2">Company Name:</span>
              <span>{profileInfo?.professionalDetails?.companyName}</span>
            </span>
            <span>
              <span className="text-[#5E5E5E] mr-2">Role:</span>
              <span>{profileInfo?.professionalDetails?.role}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 ml-1">
        <h3 className="text-[#5E5E5E] mb-2 ">Images</h3>

       
        <span className=" flex gap-5">

        {profileInfo?.images?.map((image, index)=> (
          <img key={index} src={image} height={200}
          width={200} alt=""/>
        ))}
         
        </span>
      </div>
    </div>
  );
};

export default UserProfileInfo;
