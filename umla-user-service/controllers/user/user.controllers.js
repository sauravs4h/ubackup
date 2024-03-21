const {
    User,
    Swipe,
    Prompt,
    Offer,
    UserPrompt,
    UserFilter,
    Report,
    OfferPreference,
    UserReferral,
    UserSubscription,
    SubscriptionChecks,
    Room,
    Chat,
    OfferResponse,
    Userquery,
    UserCheck,
    Outlet,
    UserSlot,
    Unmatch,
    GroupMeetOffer,
    GroupMeet,
} = require("../../models/index.models");
const mongoose = require("mongoose");
const { containerClient } = require("../../utils/index.utils");
const axios = require("axios");
const { AadhaarData } = require("../../models/index.models");
require("dotenv").config();
const NodeRSA = require("node-rsa");
const { blockUser, sendMailToAdmin } = require("../../utils/helper/helperFunc.utils");
const jwt = require("jsonwebtoken");
//DONE
const getUser = async (req, res) => {
    const userId = req.user.id;
    console.log(userId);
    try {
        const user = await User.findById(userId)
            .populate({
                path: "offer",
                select: "time offering purpose outlet", // Select the fields you want from the Offer model
                populate: {
                    path: "outlet",
                    model: "Outlet",
                    select: "name", // Select the fields you want from the Outlet model
                },
            })
            .exec();

        const prompts = await UserPrompt.find({ userId })
            .populate("prompt", "-createdAt -updatedAt")
            .select("-createdAt -updatedAt -userId");

        if (user) {
            let interest = user.interest;

            let totalValues = Object.values(interest).reduce(
                (total, currentArray) => {
                    return total + currentArray.length;
                },
                0
            );
            totalValues = totalValues > 6 ? 6 : totalValues;
            let profileCompletion =
                5 * user.image.length +
                5 * prompts.length +
                (user.bio ? 5 : 0) +
                3 * totalValues +
                2 *
                    (user.profession.companyName && user.profession.jobTitle
                        ? 1
                        : 0) +
                2 * (user.education.instituteName ? 1 : 0) +
                2 * (user.height ? 1 : 0) +
                2 * (user.gender ? 1 : 0) +
                2 * (user.location ? 1 : 0) +
                2 * (user.homeTown ? 1 : 0) +
                2 * (user.language.length ? 1 : 0) +
                2 * (user.starSign ? 1 : 0) +
                2 * (user.pronouns ? 1 : 0) +
                2 * (user.sexualOrientation ? 1 : 0) +
                2 * (user.drinking ? 1 : 0) +
                2 * (user.exercising ? 1 : 0) +
                2 * (user.smoking ? 1 : 0) +
                2 * (user.kids ? 1 : 0) +
                2 * (user.politicalViews ? 1 : 0) +
                2 * (user.religion ? 1 : 0);
            console.log(profileCompletion);
            if (profileCompletion > 100) {
                profileCompletion = 100;
            }

            if (
                user.name &&
                user.email &&
                user.dob &&
                user.gender &&
                user.height &&
                user.profession.jobTitle &&
                user.profession.companyName &&
                user.education.instituteName &&
                user.interest &&
                user.image.length > 2
            ) {
                user.completed = true;
            }
            console.log(profileCompletion);
            user.completionPercentage = profileCompletion;
            console.log(user.completionPercentage);
        }
        if (user.dob && !user.age) {
            const arr = user.dob.split("/");
            const newStr = arr[2] + "-" + arr[1] + "-" + arr[0];
            let birthDate = new Date(newStr);
            const dobYear = birthDate.getFullYear();
            const newDate = new Date();
            const currentYear = newDate.getFullYear();
            user.age = currentYear - dobYear;
        }
        await user.save();
        const userData = await User.findById(userId)
            .populate({
                path: "offer",
                select: "time offering purpose outlet", // Select the fields you want from the Offer model
                populate: {
                    path: "outlet",
                    model: "Outlet",
                    select: "name", // Select the fields you want from the Outlet model
                },
            })
            .lean()
            .exec();
        const userPrompt = await UserPrompt.find({ userId: user._id })
            .populate("prompt", "_id tag question")
            .select("_id prompt answer")
            .lean()
            .exec();
        userData.userPrompt = userPrompt;

        // sending remaining like and responce count:

        const userSwipeData= await Swipe.findOne({uid:userId});
        const likesRemaining=userSwipeData?.likesRemaining;

        userData.likesRemaining=likesRemaining;

        const responsesRemaining= userSwipeData?.responsesRemaining;
        userData.responsesRemaining=responsesRemaining;

        const data = await UserCheck.findOneAndUpdate(
            { uid: userId }, // search filter
            { uid: userId }, // document to insert when nothing was found
            { upsert: true, new: true, runValidators: true } // options
        );
        const checks = { popup: false, offerId: data.offerId || null };
        const result = await Outlet.aggregate([
            { $match: { earlyBird: true } },
            {
                $group: {
                    _id: null,
                    totalCouponsLeft: { $sum: "$couponsLeft" },
                },
            },
        ]);

        const count = result.length > 0 ? result[0].totalCouponsLeft : 0;
        // if (!data.freeOffer && !data.offerDenied && count > 0) {
        //     checks.popup = true;
        // }
        res.status(200).json({
            success: true,
            data: { user: userData },
            checks,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

//DONE

const getAllUsers = async (req, res,next) => {
    const userId = req.user.id;
    const { page = 0 } = req.params;

    try {
        const [currentUser, swipeData, userFilter] = await Promise.all([
            User.findById(userId),
            Swipe.findOne({ uid: userId }),
            UserFilter.findOneAndUpdate(
                { userId: userId }, // search query
                {}, // update operation (empty because we're just finding or creating)
                {
                    upsert: true, // if no details exists, create a new one
                    new: true, // return the new object if it was created
                }
            ),
        ]);

        // user unmatch with

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let userUnmatchWith= await Unmatch.find({
            userId:userId,
            createdAt:{$gte: sevenDaysAgo}
        });

        let userUnmatchWithIds= await Promise.all(userUnmatchWith.map((ele)=>{
            return ele.unmatchUserId
        }))
        

        // excluding hide profile;

        let currentTime= new Date();

        let shouldHideProfiles= await User.find({$and:[{'hideTime.shouldHide':true},{'hideTime.timeTillHide':{$gt:currentTime}}]});


        // const userLocation = currentUser.loc.coordinates;
        let arr = [];
        // if (swipeData?.swipeId) {
        //     arr = [...swipeData.swipeId];
        // }
        let idToExclude = [
            ...swipeData?.left,
            ...swipeData?.right,
            ...swipeData?.match,
            ...swipeData?.blockedUser,
            userId,
            ...userUnmatchWithIds,
            ...shouldHideProfiles
            //...arr,
        ];
        idToExclude = [...new Set(idToExclude)];
        const distance = userFilter.distance.person || 60;
        // let query = {
        //     $and: [
        //         {
        //             $or: [
        //                 {
        //                     "interest.drinks": {
        //                         $in: currentUser.interest.drinks,
        //                     },
        //                 },
        //                 { "interest.food": { $in: currentUser.interest.food } },
        //                 {
        //                     "interest.place": {
        //                         $in: currentUser.interest.place,
        //                     },
        //                 },
        //                 {
        //                     "interest.hobbies": {
        //                         $in: currentUser.interest.hobbies,
        //                     },
        //                 },
        //             ],
        //         },
        //         {
        //             _id: { $nin: idToExclude },
        //             completed: true,
        //             snoozed: false,
        //             deleted: false,
        //         },
        //     ],
        //     // "loc.coordinates": {
        //     //     $nearSphere: {
        //     //         $geometry: { type: "Point", coordinates: userLocation },
        //     //         $minDistance: 0,
        //     //         // $maxDistance: distance * 1000,
        //     //         $maxDistance: 60 * 1000,
        //     //     },
        //     // },
        //     // age: {
        //     // 	$gte:
        //     // 		userFilter && userFilter.age && userFilter.age[0]
        //     // 			? userFilter.age[0]
        //     // 			: 18,
        //     // 	$lte:
        //     // 		userFilter && userFilter.age && userFilter.age[1]
        //     // 			? userFilter.age[1]
        //     // 			: 40,
        //     // },
        // };

        const userLocation = currentUser.loc.coordinates;

        let query = {
            _id: { $nin: idToExclude },
            completed: true,
            snoozed: false,
            deleted: false,
            // "loc.coordinates": {
            //     $nearSphere: {
            //         $geometry: { type: "Point", coordinates: userLocation },
            //         $minDistance: 0,
            //         $maxDistance: 60 * 1000,
            //     },

            // $geoNear: {
            //     near: { type: "Point", coordinates: userLocation },
            //     distanceField: 60 * 1000,
            //     spherical: true
            //   },
            //   $geoWithin: {
            //     $centerSphere: [userLocation, 60 * 1000]
            //   }

            //     $near: userLocation,
            //     $maxDistance: 60 * 1000
            // },
        };

        let dollerAndQuery = [];
        // adding exclude id's to $And query
        // dollerAndQuery.push({ _id: { $nin: idToExclude } });

        if (currentUser.subscription === true) {
            const genVal =
                userFilter.gender === "Anyone"
                    ? ["Male", "Female"]
                    : userFilter.gender === "Male"
                    ? ["Male"]
                    : ["Female"];
            query = { ...query, gender: { $in: genVal } };

            // add filter

            let filterData = await UserFilter.findOne({
                userId: userId,
            }).select("gender age meetingTimeSlot distance advance");

            // If the filter data doesn't exist, create a new one
            if (!filterData) {
                filterData = new UserFilter({ userId });
            }

            let queryForFilter = [];

            // filter for age

            if (filterData.age[0] && filterData.age[1]) {
                let ageObject = {
                    $and: [
                        { age: { $gte: filterData.age[0] } },
                        { age: { $lte: filterData.age[1] } },
                    ],
                };

                dollerAndQuery.push(
                    { age: { $gte: filterData.age[0] } },
                    { age: { $lte: filterData.age[1] } }
                );

                //queryForFilter.push(ageObject);
            }
            //filter for time slot;

            let userPreference = await OfferPreference.findOne({
                userId: userId,
            });

            // if (!(userPreference.meetupSlot === "All")) {
            //     let timeSlot = userPreference.meetupSlot;
            //     let timeSlotIds = await OfferPreference.find({
            //         meetupSlot: timeSlot,
            //         _id: { $nin: idToExclude },
            //     }).select("userId");

            //     timeSlotIds = await Promise.all(
            //         timeSlotIds.map((ele) => ele.userId)
            //     );

            //     let timeSlotObject = { _id: { $in: timeSlotIds } };

            //     dollerAndQuery.push({ _id: { $in: timeSlotIds } });

            //     // queryForFilter.push(timeSlotObject);
            // }

            //Advance Filters

            let queryForAdvance = [];

            //filter for height
            // if (
            //     filterData.advance.height.min &&
            //     filterData.advance.height.max
            // ) {
            //     let minHeight = filterData.advance.height.min;
            //     let maxHeight = filterData.advance.height.max;
            //     // let heightObject = {
            //     //     $and: [
            //     //         { heightInNumber: { $gte: minHeight } },
            //     //         { heightInNumber: { $lte: maxHeight } },
            //     //     ],
            //     // };

            //     dollerAndQuery.push(
            //         { heightInNumber: { $gte: minHeight } },
            //         { heightInNumber: { $lte: maxHeight } }
            //     );
            //     // queryForAdvance.push(heightObject);
            // }

            // filter for drinking
            if (filterData.advance.drinking.length > 0) {
                let drinking = filterData.advance.drinking;
                let drinkingObject = { drinking: { $in: drinking } };

                query.drinking = { $in: drinking };
                // queryForAdvance.push(drinkingObject);
            }

            //filter for exercising
            if (filterData.advance.exercising.length > 0) {
                let exercising = filterData.advance.exercising;
                let exercisingObject = { exercising: { $in: exercising } };
                query.exercising = { $in: exercising };
                //queryForAdvance.push(exercisingObject);
            }

            // //filter for education
            // if (filterData.advance.education) {

            //     let education = filterData.advance.education;
            //     let educationObject = { education: education };
            //     queryForAdvance.push(educationObject);
            // }

            //filter for smoking
            if (filterData.advance.smoking.length > 0) {
                let smoking = filterData.advance.smoking;
                let smokingObject = { smoking: { $in: smoking } };
                query.smoking = { $in: smoking };
                //queryForAdvance.push(smokingObject);
            }

            // filter for familyplan

            if (filterData.advance.kids.length > 0) {
                let kids = filterData.advance.kids;
                let familyObject = { kids: { $in: kids } };
                query.kids = { $in: kids };
                //queryForAdvance.push(familyObject);
            }

            // filter for starSign

            if (filterData.advance.starSign.length > 0) {
                let starSign = filterData.advance.starSign;
                let starSignObject = { starSign: { $in: starSign } };

                query.starSign = { $in: starSign };
                // queryForAdvance.push(starSignObject);
            }

            // filter for politicalViews

            if (filterData.advance.politicalViews.length > 0) {
                let politicalViews = filterData.advance.politicalViews;
                let politicalViewsObject = {
                    politicalViews: { $in: politicalViews },
                };

                query.politicalViews = { $in: politicalViews };
                //queryForAdvance.push(politicalViewsObject);
            }

            // filter for religion

            if (filterData.advance.religion.length > 0) {
                let religion = filterData.advance.religion;
                let religionObject = { religion: { $in: religion } };

                query.religion = { $in: religion };
                //queryForAdvance.push(religionObject);
            }

            query["$and"] = dollerAndQuery;
            // adding filters to mainquery
            //  for advance filter using $or

            // if (queryForAdvance.length > 0) {
            //     query.$or = queryForAdvance;
            // }

            // if (queryForFilter.length > 0 || queryForAdvance.length > 0) {
            //     query.$and = [...queryForFilter,...queryForAdvance]
            // }
        }

        const subscriptionChecks = await SubscriptionChecks.findOne({
            uid: userId,
        });
        if (
            subscriptionChecks.profileLimit === true &&
            !currentUser.subscription
        ) {
            return res.status(200).json({
                success: true,
                data: { user: [] },
                message: "Daily limit exceeded",
            });
        }

        console.log("query...........,", query);
        const users = await User.find(query)
            .skip(page * 20)
            .limit(20)
            .select(
                "-__v -contactNumber -email -notification -createdAt -updatedAt -whatsappNumber"
            )
            .populate({
                path: "offer",
                match: {
                    $or: [
                        { offerType: "scheduled" },
                        { offerType: { $exists: false } },
                    ],
                },
                select: "time offering purpose outlet",
                populate: {
                    path: "outlet",
                    model: "Outlet",
                    select: "name",
                },
            })
            .lean()
            .exec();

        const data = await Promise.all(
            users.map(async (user) => {
                const userPrompt = await UserPrompt.find({ userId: user._id })
                    .populate("prompt", "_id tag question")
                    .select("_id prompt answer")
                    .lean()
                    .exec();

                // Add userPrompt key to user and return user
                user.userPrompt = userPrompt;


                // checking user is owner of any groupmeet or not

                let userGroup= await GroupMeet.findOne({owner:userId,offerStatus:"pending"});

                if(userGroup){
                    let groupOffer= await GroupMeetOffer.findOne({groupId:userGroup._id})
                                    .populate({path:"outlet",select:"name address"})

                    let groupOutlet= groupOffer.outlet.name;
                    let groupAddress= groupOffer.outlet.address;
                    let groupTime= groupOffer.outlet.time;
                    let groupOffering = groupOffer.offering;
                    let remainingSize= userGroup.remainingSize;

                    user.userGroupMeet={status:true,groupOutlet,groupAddress,groupTime,groupOffering,remainingSize}


                }else{
                    user.userGroupMeet={
                        status:false
                    }
                }

                return user;
            })
        );

        

        req.allUsers=data 
        next()
        // console.log('userId:', userId);
        // console.log('currentUser:', currentUser);
        // console.log('swipeData:', swipeData);
        // // console.log('userLocation:', userLocation);
        // console.log('idToExclude:', idToExclude);


        //res.status(200).json({ success: true, data: { user: data } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

// checking in which slot user have float offer.

const floatSlot=(floatTimes)=>{

    let data= floatTimes.map((dateTime)=>{

         //--------------checking timeslot-----------------//
         let morningSlotStart = new Date(Date.UTC(dateTime.getUTCFullYear(), dateTime.getUTCMonth(), dateTime.getUTCDate(), 8, 0, 0));
         let afternoonSlotStart = new Date(Date.UTC(dateTime.getUTCFullYear(), dateTime.getUTCMonth(), dateTime.getUTCDate(), 12, 0, 0));
         let eveningSlotStart = new Date(Date.UTC(dateTime.getUTCFullYear(), dateTime.getUTCMonth(), dateTime.getUTCDate(), 17, 0, 0));
         let eveningSlotEnd = new Date(Date.UTC(dateTime.getUTCFullYear(), dateTime.getUTCMonth(), dateTime.getUTCDate(), 23, 59, 0));
     
         let selectedSlot;

         if(dateTime>=morningSlotStart && dateTime<afternoonSlotStart){
             selectedSlot="morningSlot"
         }else if(dateTime>=afternoonSlotStart && dateTime<eveningSlotStart){
             selectedSlot="afternoonSlot"
         }else if(dateTime>=eveningSlotStart && dateTime<eveningSlotEnd){
             selectedSlot="eveningSlot"
         }

        let dayStarts=new Date(Date.UTC(dateTime.getUTCFullYear(), dateTime.getUTCMonth(), dateTime.getUTCDate(), 0, 0, 0));

        let output = `${dayStarts}${selectedSlot}`;
        //let output=dayStarts+selectedSlot;
        return output;

    })

    return data;

}

// checking user's all booked slot for next two days.

const bookedSlots=async(userId)=>{

    let todayDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    todayDate= new Date(todayDate);
    todayDate.setUTCHours(0, 0, 0, 0);

    let nextDate = new Date(todayDate);
    nextDate.setDate(todayDate.getDate() + 1);
    nextDate.setUTCHours(0, 0, 0, 0);

    let nextDateEnd=new Date(nextDate);
    nextDateEnd.setDate(nextDate.getDate() + 1);
    nextDateEnd.setUTCHours(0, 0, 0, 0);


    let currentTime=new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    currentTime= new Date(currentTime);

    let currentSlot;

    
    let morningSlotStart = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate(), 8, 0, 0));
    let afternoonSlotStart = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate(), 12, 0, 0));
    let eveningSlotStart = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate(), 17, 0, 0));
    let eveningSlotEnd = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate(), 23, 59, 0));

    if(currentTime<afternoonSlotStart){
        currentSlot="morningSlot"
    }else if(currentTime<eveningSlotStart){
        currentSlot="afternoonSlot"
    }else if(currentSlot<eveningSlotEnd){
        currentSlot="eveningSlot"
    }

     let userFilledSlot=[]

     // check for today;

     let todaySlots= await UserSlot.findOne({
        userId:userId,
        date: { $gte: todayDate, $lt: nextDate },
     })

     if(todaySlots.slot.morningSlot.isBooked==true){

        if(currentSlot!=="afternoonSlot" && currentSlot!=="eveningSlot"){
            let output = `${todayDate}morningSlot`;
            userFilledSlot.push(output)
        }
     }

     if(todaySlots.slot.afternoonSlot.isBooked==true){

        if(currentSlot!=="eveningSlot"){
            let output = `${todayDate}afternoonSlot`;
            userFilledSlot.push(output)
        }
     }

     if(todaySlots.slot.eveningSlot.isBooked==true){
            let output = `${todayDate}eveningSlot`;
            userFilledSlot.push(output)
     }

     // check for nextDay;

     let nextDaySlots= await UserSlot.findOne({
        userId:userId,
        date: { $gte: nextDate, $lt: nextDateEnd },
     });

     if(nextDaySlots.slot.morningSlot.isBooked==true){
        let output = `${nextDate}morningSlot`;
        userFilledSlot.push(output)
     }

     if(nextDaySlots.slot.afternoonSlot.isBooked==true){
        let output = `${nextDate}afternoonSlot`;
        userFilledSlot.push(output)
     }

     if(nextDaySlots.slot.eveningSlot.isBooked==true){
        let output = `${nextDate}eveningSlot`;
        userFilledSlot.push(output)
     }


     return userFilledSlot;


}

// filter all users if user have float offer .

const checkIfFloatOffer=async(req,res)=>{

    const userId=req.user.id;
    const allUsers=req.allUsers;

    try {

        // from bookedSlots function we get all the booked slot of user for next two days.
        // and the formate of element of array is `${nextDate}eveningSlot` 

        let userBookedSlots= await bookedSlots(userId);

        if(userBookedSlots.length==0){
            res.status(200).json({ success: true, data: { user: allUsers } });
            return;
        }

        // if user have floating offer and another user also have floating offer then they should not see each other profile.

        
        let userFloatingOffer= await Offer.find({owner:userId,status:"floating"});

        let todayDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        todayDate= new Date(todayDate)

        // taking floting offer date after this time.

        let userFloatSlots=[]

        if(userFloatingOffer.length>0){
            let userOfferTimes = userFloatingOffer
            .filter(offer => offer.timeDate > todayDate)
            .map(offer => offer.timeDate);

            // taking slot information in an array
            userFloatSlots= floatSlot(userOfferTimes)
        }
        

        // checking that other users also have same time or not. 
               
        let checkAllUsers= await Promise.all(allUsers.map(async(user)=>{
            let anotherUserFloatMatch=false;
            // let thisUserFloatMatch=false;
            // firstly we are checking that another user's any float offer slot not matching with main user's booked slot; 
            // so we have all the book slot of main user in userBookedSlots variable. another user's any float offer do not match these times.

            let anotherUserFloatOffer=await Offer.find({
                owner:user._id,status:"floating"
            });

            // if there is no float offer in another user then anotherUserFloatMatch is automatically false;
            if(anotherUserFloatOffer.length!==0){

                // filtering date who is after today

                let checkAnotherUserFloatTimes = anotherUserFloatOffer
                    .filter(offer => offer.timeDate > todayDate)
                    .map(offer => offer.timeDate);
                
                
                // if both user have floating offer then users should not see each other

                if(checkAnotherUserFloatTimes.length>0 && userFloatSlots.length>0 ){

                    return
                }

                
                // if there is no floating offer after today then anotherUserFloatMatch is automatically false;
                if(checkAnotherUserFloatTimes.length!==0){
        
                    let checkAnotherUserFloatSlots= floatSlot(checkAnotherUserFloatTimes);

                    // checking if usertimslot have any slot which have check user also

                    for(let i=0;i<checkAnotherUserFloatSlots.length;i++){

                        if(userBookedSlots.includes(checkAnotherUserFloatSlots[i])){
                            anotherUserFloatMatch=true;
                            break;
                        }
                    }

                    if(anotherUserFloatMatch==true){
                        return 
                    }

                }
            }

            if(anotherUserFloatMatch==false){
                    return user
            }


            // now we will check that main user's any float offer do not match with another user's any book slot

            // let anotherUserBookedSlots= await bookedSlots(user._id);
            
            // for(let i=0;i<userFloatSlots.length;i++){
            //     if(anotherUserBookedSlots.includes(userFloatSlots[i])){
            //         thisUserFloatMatch=true;
            //         break;
            //     }
            // }

            // if(thisUserFloatMatch==true){
            //     return
            // }

            // if(anotherUserFloatMatch==false && thisUserFloatMatch==false){
            //     return user
            // }

        }));

        
        // Filter out undefined values
        let filteredUsers = checkAllUsers.filter(user => user !== undefined);

        res.status(200).json({ success: true, data: { user: filteredUsers } });
        return;
        

        
        

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
}


//DONE
const addUserDetails = async (req, res) => {
    //! update needed based on model
    const userId = req.user.id;
    // const uploadedFiles = req.files;
    const {
        name,
        email,
        dob,
        jobTitle,
        companyName,
        instituteName,
        passingYear,
        drinks,
        food,
        place,
        hobbies,
        location,
        notification,
        gender,
        ethnicity,
        starSign,
        height,
        coordinates,
        drinking,
        exercising,
        smoking,
        kids,
        politicalViews,
        religion,
        hometown,
        lvl,
        sexualOrientation,
        language,
    } = req.body;
    try {
        const user = await User.findById(userId);

        if (name) user.name = name;
        if (email) user.email = email;
        if (dob) {
            user.dob = dob;
            const arr = dob.split("/");
            const newStr = arr[2] + "-" + arr[1] + "-" + arr[0];
            let birthDate = new Date(newStr);
            const dobYear = birthDate.getFullYear();
            const newDate = new Date();
            const currentYear = newDate.getFullYear();
            user.age = currentYear - dobYear;
        }
        if (jobTitle) user.profession.jobTitle = jobTitle;
        if (companyName) user.profession.companyName = companyName;
        if (instituteName) user.education.instituteName = instituteName;
        if (passingYear) user.education.year = passingYear;
        if (lvl) user.education.lvl = lvl;
        if (drinks) user.interest.drinks = drinks.split("-");
        if (food) user.interest.food = food.split("-");
        if (place) user.interest.place = place.split("-");
        if (hobbies) user.interest.hobbies = hobbies.split("-");
        if (language) user.language = language.split("-");
        if (location) user.location = location;
        if (notification) user.notification = notification;
        if (gender) user.gender = gender;
        if (ethnicity) user.ethnicity = ethnicity;
        if (starSign) user.starSign = starSign;
        if (height) user.height = height;
        if (coordinates) user.loc.coordinates = coordinates.split("%");
        if (drinking) user.drinking = drinking;
        if (exercising) user.exercising = exercising;
        if (smoking) user.smoking = smoking;
        if (kids) user.kids = kids;
        if (politicalViews) user.politicalViews = politicalViews;
        if (religion) user.religion = religion;
        if (hometown) user.homeTown = hometown;
        if (sexualOrientation) user.sexualOrientation = sexualOrientation;

        user.completed = true;
        if (!location.toLowerCase().includes("jaipur".toLowerCase())) {
            user.claimOffer = false;
            user.claimable = false;
            user.earlyBird = false;
            user.jaipur = false;
        } else {
            user.jaipur = true;
        }
        if (user.contactNumber === "+919876543210") {
            user.jaipur = true;
        }

        const result = await user.save();
        res.status(200).json({ success: true, data: { user: result } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

//DONE
const updateLocation = async (req, res) => {
    const userId = req.user.id;
    const { coordinates, location } = req.body;
    try {
        const user = await User.findById(userId);
        user.loc.coordinates = coordinates;
        user.location = location;
        user.travel = true;
        if (location.toLowerCase().includes("jaipur".toLowerCase())) {
            user.jaipur = true;
        }

        await user.save();
        res.status(200).json({ message: "updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

//DONE
const handleImageUpload = async (req, res) => {
    const userId = req.user.id;
    const image = req.file;
    try {
        const user = await User.findById(userId);
        const blobName = `${Date.now()}-${image.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadData(image.buffer, {
            blobHTTPHeaders: { blobContentType: image.mimetype },
        });
        const imageUrl = blockBlobClient.url;
        user.image.push(imageUrl);
        await user.save();
        res.status(200).json({ success: true, url: imageUrl });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

//DONE
const getPrompts = async (req, res) => {
    const userId = req.user.id;
    try {
        const prompts = await Prompt.find().select(
            "-__v -createdAt -updatedAt"
        );
        let tags = [];
        let response = prompts.reduce((acc, item) => {
            // If the tag is not in the accumulator, add it as a key and set its value to an empty array
            if (!acc[item.tag]) {
                tags.push(item.tag);
                acc[item.tag] = [];
            }
            // Push an object with _id and question to the array associated with the tag
            acc[item.tag].push({
                _id: item._id,
                question: item.question,
            });
            return acc;
        }, {});
        const userPrompt = await UserPrompt.find({ userId })
            .populate("prompt", "_id tag question")
            .select("_id prompt answer")
            .lean()
            .exec();

        const user = await User.findById(userId);
        res.status(200).json({
            prompts: response,
            tags,
            userPrompt,
            bio: user.bio ? user.bio : "",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

//DONE
const addPromptToProfile = async (req, res) => {
    const userId = req.user.id;
    const { answer, promptId, bio } = req.body;
    try {
        if (answer && promptId) {
            await UserPrompt.create({
                userId,
                prompt: promptId,
                answer,
            });
        }
        if (bio) {
            const user = await User.findById(userId);
            user.bio = bio;
            await user.save();
        }
        const userPrompt = await UserPrompt.find({ userId })
            .populate("prompt", "_id tag question")
            .select("_id prompt answer")
            .lean()
            .exec();
        const user = await User.findById(userId);
        res.status(201).json({ userPrompt, bio: user.bio ? user.bio : "" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

//! AADHAAR VERIFICATION --------------------------------------------------------------------------------------------------
const generateSignature = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const dataToEncrypt = `${process.env.x_client_id}.${timestamp}`;
    const publicKey =
        "-----BEGIN PUBLIC KEY-----\n" +
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsraf+xwXMvTDYEwG1GBn\n" +
        "rw1wAEjMtfvOUlN4G1MQLNdMWrsqsNKNg7uAVTqlXNFrXcG/mkF6pYu4/jpn02GW\n" +
        "bJAtkFMCRyGWVWWQfgLpGB508Q9/jhInvRR4h8qigWkM3MJcbKrFW95CL2GhZCIP\n" +
        "JXI9/sOW39Eg0gVp/5543VzKcCL1pELZo8bC/mfM5u16/LS+OS7BHD55SqMo2VFu\n" +
        "/Vl24tcBvyGrO0MWU144yPb7d/PS1rOXtHuBRE1a18InJQAKPezaQ/Vk+W12Ozmn\n" +
        "ehqhgpMbO8euaXR4FQbHSaipw/x9HVBKZsZrCZI+zwipdN220C6zYvpu5fvsAktw\n" +
        "1QIDAQAB\n" +
        "-----END PUBLIC KEY-----\n";

    const key = new NodeRSA();

    key.importKey(publicKey, "pkcs8-public-pem");

    const encryptedData = key.encrypt(dataToEncrypt, "base64");
    return encryptedData;
};

//DONE
const generateOtpToVerifyAadhaar = async (req, res) => {
    const userId = req.user.id;
    const { aadhaarNumber } = req.body;
    try {
        const aadhaarData = await AadhaarData.findOne({
            aadhaar: aadhaarNumber,
        });
        if (aadhaarData) {
            if (
                aadhaarData.uid !== userId &&
                aadhaarData.status === "verified"
            ) {
                res.status(401).json({
                    message: "aadhaar linked to another account",
                });
            }
        }
        const url = "https://api.cashfree.com/verification/offline-aadhaar/otp";
        const headers = {
            "x-client-id": process.env.x_client_id,
            "x-client-secret": process.env.x_client_secret,
            "X-Cf-Signature": await generateSignature(),
            "Content-Type": "application/json",
        };
        const data = {
            aadhaar_number: aadhaarNumber,
        };

        const response = await axios.post(url, data, { headers });
        console.log("response ", response.data);

        switch (response.data.message) {
            case "OTP sent successfully":
                await AadhaarData.create({
                    uid: userId,
                    ref_id: response.data.ref_id,
                    aadhaar: aadhaarNumber,
                    status: "failed",
                });
                return res.status(200).json({
                    message: response.data.message,
                    ref_id: response.data.ref_id,
                });
            case "Invalid Aadhaar Card":
                return res.status(200).json({ message: response.data.message });
            case "Aadhaar not linked to mobile number":
                return res.status(200).json({ message: response.data.message });
        }
    } catch (err) {
        console.log(err);
        console.log(err.response);
        if (err.response && err.response.status === 409) {
            return res.status(409).son({
                message:
                    "Otp generated for this aadhaar, please try after some time",
            });
        } else if (err.response && err.response.status === 422) {
            return res.status(409).son({
                message: "Insufficient balance to process this request",
            });
        } else return res.status(500).json({ message: "something went wrong" });
    }
};

//DONE
const submitOptForAadhaarVerification = async (req, res) => {
    const userId = req.user.id;
    const { otp, ref_id } = req.body;
    try {
        const url =
            "https://api.cashfree.com/verification/offline-aadhaar/verify";
        const headers = {
            "x-client-id": process.env.x_client_id,
            "x-client-secret": process.env.x_client_secret,
            "X-Cf-Signature": await generateSignature(),
            "Content-Type": "application/json",
        };
        const data = {
            ref_id,
            otp,
        };
        const response = await axios.post(url, data, { headers });
        const aadhaarData = await AadhaarData.findOne({ ref_id });
        aadhaarData.name = response.data.name;
        aadhaarData.state = response.data.split_address.state;
        aadhaarData.dob = response.data.dob;
        aadhaarData.status = "verified";
        aadhaarData.gender = response.data.gender;
        await aadhaarData.save();
        const user = await User.findById(userId);
        user.dob = aadhaarData.dob;
        //check it user.name is a substring of aadhaar.name
        if (!aadhaarData.name.includes(user.name)) {
            // If user.name is not a substring of aadhaarData.name, do something here
            const name = aadhaarData.name.split(" ");
            user.name = name[0];
        }
        if (aadhaarData.gender === "M") {
            user.gender = "male";
        }
        if (aadhaarData.gender === "F") {
            user.gender = "female";
        }
        user.verified = true;
        user.homeTown = response.data.split_address.state;
        await user.save();
        res.status(200).json({ message: "Verification successful" }); //! update response based on name conditions
    } catch (err) {
        console.log(err);
        console.log(err.response);
        if (err.response && err.response.status === 401) {
            return res.status(401).son({
                message: "Invalid OTP",
            });
        } else return res.status(500).json({ message: "something went wrong" });
    }
};

//DONE
const updateCoordinates = async (req, res) => {
    const userId = req.user.id;
    const { coordinates, location, travel, deviceId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!travel) {
            user.travel = false;
        }
        if (deviceId) {
            user.deviceId = deviceId;
        }
        if (!user.travel) {
            user.loc.coordinates = coordinates.split("%");
            user.location = location;

            let locationArray= location.split(",");
            let city= locationArray[locationArray.length-3];

            if(city==" Jaipur"){
                user.jaipur=true
            }else{
                user.jaipur=false
            }
        }

        await user.save();
        const token = jwt.sign(
            { id: userId, deviceId },
            process.env.JWT_SECRET,
            {
                expiresIn: "1y",
            }
        );
        res.status(200).json({ message: "updated", token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

//DONE
const getInstantQueueUsers = async (req, res) => {
    const userId = req.user.id;
    const { page = 0 } = req.params;
    try {
        const [currentUser, swipeData] = await Promise.all([
            User.findById(userId),
            Swipe.findOne({ uid: userId }),
        ]);

        const userLocation = currentUser.loc.coordinates;
        const idToExclude = [
            ...swipeData.left,
            ...swipeData.right,
            ...swipeData.match,
            userId,
        ];
        const instantOffers = await Offer.find({
            offerType: "instant",
            "loc.coordinates": {
                $nearSphere: {
                    $geometry: { type: "Point", coordinates: userLocation },
                    $minDistance: 0,
                    $maxDistance: 2 * 1000, //! need to make is dynamic
                },
            },
            owner: { $nin: idToExclude },
        }).select("owner");
        const userIds = instantOffers.map((offer) => offer.owner);
        const users = await User.find({
            $and: [
                {
                    _id: { $nin: idToExclude },
                },
                {
                    _id: { $in: userIds },
                },
            ],
        })
            .skip(page * 5)
            .limit(5)
            .select(
                "-__v -contactNumber -deviceId -email -notification -createdAt -updatedAt"
            )
            .populate({
                path: "offer",
                match: {
                    offerType: "instant",
                },
                select: "time offering purpose outlet",
                populate: {
                    path: "outlet",
                    model: "Outlet",
                    select: "name",
                },
            })
            .exec();

        let response = users;
        res.status(200).json({ success: true, data: { user: response } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const reportUser = async (req, res) => {
    //update postman
    const userId = req.user.id;
    const { secondUserId, reason } = req.body;
    try {
        await blockUser(userId, secondUserId, true);
        await Report.create({
            userId,
            reportedUserId: secondUserId,
            reportReason: reason,
        });
        res.status(200).json({ message: "User reported" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const blockMatchedUser = async (req, res) => {
    //update postman
    const userId = req.user.id;
    const { secondUserId } = req.body;
    try {
        await blockUser(userId, secondUserId, true);
        res.status(200).json({ message: "User blocked" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const unmatch = async (req, res) => {
    //update postman
    const userId = req.user.id;
    const { secondUserId } = req.body;
    try {
        await blockUser(userId, secondUserId, false);
        res.status(200).json({ message: "User unmatched" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const getFilterData = async (req, res) => {
    const userId = req.user.id;
    try {
        let filterData = await UserFilter.findOne({ userId });
        if (!filterData) {
            await UserFilter.create({ userId });
            filterData = await UserFilter.findOne({ userId });
        }
        res.status(200).json({ filter: filterData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const updateFilter = async (req, res) => {
    const userId = req.user.id;
    try {
        // Find the existing filter data for the user
        let filterData = await UserFilter.findOne({ userId });

        // If the filter data doesn't exist, create a new one
        if (!filterData) {
            filterData = new UserFilter({ userId });
        }

        // Update filter data based on keys and values in req.body
        if ("gender" in req.body) {
            filterData.gender = req.body.gender;
        }
        if ("age" in req.body) {
            filterData.age = req.body.age;
        }
        if ("distance" in req.body) {
            if ("person" in req.body.distance) {
                filterData.distance.person = req.body.distance.person;
            }
            if ("meetupLocation" in req.body.distance) {
                filterData.distance.meetupLocation =
                    req.body.distance.meetupLocation;
            }
        }
        if ("meetingTimeSlot" in req.body) {
            filterData.meetingTimeSlot = req.body.meetingTimeSlot;
        } else {
            filterData.meetingTimeSlot = null;
        }
        if ("advance" in req.body) {
            const data = req.body.advance;

            if ("drinking" in data) {
                filterData.advance.drinking = data.drinking;
            } else {
                filterData.advance.drinking = [];
            }

            if ("exercising" in data) {
                filterData.advance.exercising = data.exercising;
            } else {
                filterData.advance.exercising = [];
            }

            if ("smoking" in data) {
                filterData.advance.smoking = data.smoking;
            } else {
                filterData.advance.smoking = [];
            }

            if ("kids" in data) {
                filterData.advance.kids = data.kids;
            } else {
                filterData.advance.kids = [];
            }

            if ("starSign" in data) {
                filterData.advance.starSign = data.starSign;
            } else {
                filterData.advance.starSign = [];
            }

            if ("politicalViews" in data) {
                filterData.advance.politicalViews = data.politicalViews;
            } else {
                filterData.advance.politicalViews = [];
            }

            if ("religion" in data) {
                filterData.advance.religion = data.religion;
            } else {
                filterData.advance.religion = [];
            }

            if ("height" in data) {
                if ("min" in data.height) {
                    filterData.advance.height.min = data.height.min;
                } else {
                    filterData.advance.height.min = null;
                }
                if ("max" in data.height) {
                    filterData.advance.height.max = data.height.max;
                } else {
                    filterData.advance.height.max = null;
                }
            }
        }

        // Save the updated filter data
        await filterData.save();

        res.status(200).json({ filter: filterData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getPreference = async (req, res) => {
    try {
        const preference = await OfferPreference.findOne({
            userId: req.user.id,
        });
        if (!preference) {
            return res
                .status(404)
                .json({ message: "No preference found for this user" });
        }
        res.status(200).json({ preference });
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: error.message });
    }
};

const updatePreference = async (req, res) => {
    try {
        const updatedPreference = await OfferPreference.findOneAndUpdate(
            { userId: req.user.id },
            req.body,
            { new: true, upsert: true }
        );
        if (!updatedPreference) {
            return res.status(404).json({
                message: "No preference found to update for this user",
            });
        }
        res.status(200).json(updatedPreference);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: error.message });
    }
};

const handleReferral = async (req, res) => {
    const userId = req.user.id;
    const { referralCode } = req.body;
    try {
        // find the referral doc based on the userId name it currentUserReferral
        const currentUserReferral = await UserReferral.findOne({
            userId: userId,
        });
        const currentUser = await User.findById(userId);
        // find the referral doc based on the referralCode and name it referredUserReferral
        const referredUserReferral = await UserReferral.findOne({
            referralCode: referralCode,
        });
        if (currentUser.referralCode === referralCode) {
            return res.status(404).json({ message: "Invalid Referral Code" });
        }

        if (!currentUserReferral || !referredUserReferral) {
            return res.status(404).json({ message: "Invalid Referral Code" });
        }
        if (currentUserReferral.referredBy) {
            return res.status(400).json({ message: "Already referred" });
        }
        currentUser.referredBy = true;

        // add the currentUserId to referredUserReferral.referredTo
        const gender =
            currentUser.gender.toLowerCase() === "male" ? "male" : "female";
        referredUserReferral.referredTo[gender] = [
            ...new Set([...referredUserReferral.referredTo[gender], userId]),
        ];

        // add the  referredUserReferral to currentUserReferral.referredBy
        currentUserReferral.referredBy = referredUserReferral.userId;

        await currentUserReferral.save();
        await referredUserReferral.save();

        // await user.save();
        await currentUser.save();
        // return success
        res.json({ message: "Successfully updated referral information" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const getReferralStatus = async (req, res) => {
    const userId = req.user.id;
    try {
        const userReferral = await UserReferral.findOne({ userId });
        const referralCodeArray = [
            ...userReferral.referredTo.male,
            ...userReferral.referredTo.female,
        ];

        // Use Promise.all to execute all promises concurrently
        const referralStatus = await Promise.all(
            referralCodeArray.map(async (code) => {
                // const referralData = await UserReferral.findById(code);
                const userData = await User.findById(code);
                const data = {
                    id: userData._id,
                    name: userData.name,
                    img: userData.image[0],
                    verified: userData.verified,
                    profileCompletion: userData.completionPercentage,
                    referralSuccess:
                        userData.verified && userData.image.length >= 3,
                };
                return data;
            })
        );

        res.status(200).json({ referralStatus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const claimOffer = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        user.claimOffer = true;
        await user.save();
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const noReferral = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        user.referredBy = true;
        await user.save();
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const deleteSingleImage = async (req, res) => {
    const userId = req.user.id;
    const { imageUrl } = req.body;
    try {
        const user = await User.findById(userId);
        user.image.pull(imageUrl);
        await user.save();

        const parsedUrl = new URL(imageUrl);

        // Get the image name from the pathname
        const imageName = parsedUrl.pathname.split("/").pop();

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(imageName);

        // Delete the image
        await blockBlobClient.delete();

        const userData = await User.findById(userId);
        res.status(200).json({ success: true, user: userData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const handleImageUploadForVerification = async (req, res) => {
    const userId = req.user.id;
    const image = req.file;
    try {
        const user = await User.findById(userId);
        const blobName = `${Date.now()}-${image.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadData(image.buffer, {
            blobHTTPHeaders: { blobContentType: image.mimetype },
        });
        const imageUrl = blockBlobClient.url;
        user.verificationImage = imageUrl;
        if (user.contactNumber === "+919876543210") {
            user.claimable = true;
            user.earlyBird = true;
        }
        let userName= user?.name;
        let userNumber= user?.contactNumber;
        
        await user.save();

        //send email to admin 
        let emailSubject="User Verification Request for UMLA"
        let emailBody=`A user with the following details has requested verification:\n\nName: ${userName}\nNumber: ${userNumber}`

        await sendMailToAdmin(emailSubject,emailBody)
        res.status(200).json({ success: true, url: imageUrl });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const snoozeToggle = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        user.snoozed = user.snoozed === false ? true : false;
        await user.save();
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const softDeleteProfile = async (req, res) => {
    const userId = req.user.id;
    const { reason = "reason not provided" } = req.body;
    try {
        const user = await User.findById(userId);
        user.deleted = true;
        user.contactNumber = user._id;
        user.reasonToDelete = reason;
        const imageArr = user.image;
        user.image = [];
        await user.save();
        const rooms = await Room.find({
            $or: [
                { "firstUser.userId": userId },
                { "secondUser.userId": userId },
            ],
        });

        // Wait for all delete operations to complete

        const roomIdArray = rooms.map((room) => room._id);

        const offers = await Offer.find({ owner: userId });
        const offerIdArray = offers.map((offer) => offer._id);

        await Promise.all([
            Chat.deleteMany({ roomId: { $in: roomIdArray } }),
            OfferResponse.deleteMany({ offerId: { $in: offerIdArray } }),
            Room.deleteMany({ _id: { $in: roomIdArray } }),
            OfferPreference.findOneAndDelete({ userId }),
            SubscriptionChecks.findOneAndDelete({ uid: userId }),
            Swipe.findOneAndDelete({ uid: userId }),
            UserFilter.findOneAndDelete({ userId }),
            UserPrompt.findOneAndDelete({ userId }),
            UserReferral.findOneAndDelete({ userId }),
            UserSubscription.findOneAndDelete({ userId }),
        ]);

        const deletePromises = imageArr.map(async (imageUrl) => {
            const parsedUrl = new URL(imageUrl);
            const imageName = parsedUrl.pathname.split("/").pop();
            const blockBlobClient =
                containerClient.getBlockBlobClient(imageName);

            try {
                // Try to delete the blob
                return await blockBlobClient.delete();
            } catch (error) {
                // If the blob doesn't exist, handle the error here
                console.error(`Failed to delete blob: ${imageName}`, error);
                return null;
            }
        });
        await Promise.all(deletePromises);
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const deletePrompt = async (req, res) => {
    const userId = req.user.id;
    const { promptId } = req.body;
    try {
        await UserPrompt.findByIdAndDelete({ _id: promptId });
        const userPrompt = await UserPrompt.find({ userId })
            .populate("prompt", "_id tag question")
            .select("_id prompt answer")
            .lean()
            .exec();
        const user = await User.findById(userId);
        res.status(201).json({ userPrompt, bio: user.bio ? user.bio : "" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const whoLikedYou = async (req, res) => {
    const userId = req.user.id;
    try {
        const swipeData = await Swipe.findOne({ uid: userId }).populate(
            "gotRight",
            "-createdAt -updatedAt"
        );

        let userRightSwipe = swipeData.gotRight;

        let responce = userRightSwipe.filter((user) => {
            if (
                !swipeData.match.includes(user._id) &&
                !swipeData.blockedUser.includes(user._id)
            ) {
                return user;
            }
        });

        res.status(200).json({ likes: responce });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const getOtherUserPreference = async (req, res) => {
    const userId = req.body.userId;
    try {
        const preference = await OfferPreference.findOne({
            userId,
        });
        if (!preference) {
            return res
                .status(404)
                .json({ message: "No preference found for this user" });
        }
        res.status(200).json({ preference });
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: error.message });
    }
};

const getOtherUser = async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findById(userId)
            .populate({
                path: "offer",
                select: "time offering purpose outlet", // Select the fields you want from the Offer model
                populate: {
                    path: "outlet",
                    model: "Outlet",
                    select: "name", // Select the fields you want from the Outlet model
                },
            })
            .lean()
            .exec();

        const prompts = await UserPrompt.find({ userId })
            .populate("prompt", "-createdAt -updatedAt")
            .select("-createdAt -updatedAt -userId");

        // Add the prompts to the user object
        user.prompts = prompts;

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const addUserQuery = async (req, res) => {
    const userId = req.user.id;
    const { title, description } = req.body;
    const image = req.files;

    try {
        let images = await Promise.all(
            image.map(async (ele) => {
                const blobName = `${Date.now()}-${ele.originalname}`;
                const blockBlobClient =
                    containerClient.getBlockBlobClient(blobName);
                await blockBlobClient.uploadData(ele.buffer, {
                    blobHTTPHeaders: { blobContentType: ele.mimetype },
                });
                const imageUrl = blockBlobClient.url;

                return imageUrl;
            })
        );

        const query = new Userquery({
            user: userId,
            title,
            description,
            image: images,
        });
        await query.save();
        res.status(200).json({ message: "query saved", query });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
const addUserFeedback = async (req, res) => {
    const userId = req.user.id;
    const { description } = req.body;
    const image = req.files;

    try {
        let images = await Promise.all(
            image.map(async (ele) => {
                const blobName = `${Date.now()}-${ele.originalname}`;
                const blockBlobClient =
                    containerClient.getBlockBlobClient(blobName);
                await blockBlobClient.uploadData(ele.buffer, {
                    blobHTTPHeaders: { blobContentType: ele.mimetype },
                });
                const imageUrl = blockBlobClient.url;

                return imageUrl;
            })
        );

        const query = new Userquery({
            user: userId,
            title: "Feedback",
            description,
            image: images,
        });
        await query.save();
        res.status(200).json({ message: "query saved", query });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
const getUserQuery = async (req, res) => {
    const userId = req.user.id;
    try {
        const queries = await Userquery.find({
            user: userId,
            title: { $nin: ["Feedback"] },
        })
            .select("status title description resolution createdAt")
            .sort({ createdAt: -1 });

        const response = queries.map((ele) => {
            let date = new Date(ele.createdAt);
            let istDate = new Date(
                date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
            );
            let time = new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }).format(istDate);
            let newDate = new Date(ele.createdAt).toLocaleDateString();
            const newArr = newDate.split("/");
            newDate = newArr[1] + "/" + newArr[0] + "/" + newArr[2];
            const data = {
                status: ele.status,
                date: newDate,
                time: time,
                title: ele.title,
                query: ele.description,
                resolution: ele.resolution || null,
            };
            return data;
        });
        res.status(200).json({ queries: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const cancelfreeOffer = async (req, res) => {
    const userId = req.user.id;
    try {
        await UserCheck.findOneAndUpdate(
            { uid: userId },
            { offerDenied: true }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    getUser,
    getAllUsers,
    addUserDetails /*,updateUserDetails*/,
    updateLocation,
    handleImageUpload,
    getPrompts,
    addPromptToProfile,
    generateOtpToVerifyAadhaar,
    submitOptForAadhaarVerification,
    updateCoordinates,
    getInstantQueueUsers,
    reportUser,
    blockMatchedUser,
    unmatch,
    getFilterData,
    updateFilter,
    getPreference,
    updatePreference,
    handleReferral,
    getReferralStatus,
    claimOffer,
    noReferral,
    deleteSingleImage,
    handleImageUploadForVerification,
    snoozeToggle,
    softDeleteProfile,
    deletePrompt,
    whoLikedYou,
    getOtherUserPreference,
    getOtherUser,
    addUserQuery,
    getUserQuery,
    addUserFeedback,
    cancelfreeOffer,
    checkIfFloatOffer
};
//!need to add the loc logic back after integration

// const updateUserDetails = async (req, res) => {
// 	const userId = req.user.id;
// 	const { name, bio } = req.body;
// 	try {
// 		const user = await User.findById(userId);
// 		if (name) {
// 			user.name = name;
// 		}
// 		if (bio) {
// 			user.bio = bio;
// 		}
// 		const result = await user.save();
// 		res.status(200).json({ success: true, data: { user: result } });
// 	} catch (err) {
// 		console.log(err);
// 		res.status(500).json({ message: 'something went wrong' });
// 	}
// };
