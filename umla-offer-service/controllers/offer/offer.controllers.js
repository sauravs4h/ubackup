const {
    User,
    Room,
    Swipe,
    Offer,
    Outlet,
    OutletMenu,
    OfferResponse,
    Coupon,
    TimeSlot,
    Arrival,
    Chat,
    UserCheck,
    OfferNotification,
    UserSlot,
    GroupMeet,
    GroupMeetOffer,
    GroupMeetRoom
} = require("../../models/index.models");
const { getFinalTime } = require("../../utils/helperFunctions.utils");
const { sendPushNotification } = require("../../utils/notification.utils");
require("dotenv").config();
const axios = require("axios");
// const cron = require('node-cron');
const {
    handleOfferCreationInChatRoom,
    handleMatchViaOfferResponse,
} = require("../../utils/offer.utils");
const schedule = require("node-schedule");
const io = require("socket.io-client");
const socket = io(process.env.PARTNER_DASHBOARD_SERVICE, {
    path: "/partnerSocket",
});

//DONE
const getAllOutlet = async (req, res) => {
    const userId = req.user.id;
    const { page } = req.params;
    try {
        const currentUser = await User.findById(userId);
        const userContact = [
            "+917209123567",
            "+918927610922",
            "+919340979681",
            "+917896065393",
            "+919588973492",
        ];
        // const userLocation = currentUser.loc.coordinates;
        const pageNumber = page || 0;
        // const update = {
        // 	$set: {
        // 		'loc.type': 'Point',
        // 		'loc.coordinates': [25.087626, 55.151134],
        // 	},
        // };

        // await Outlet.updateOne({}, update);
        // 	{
        // 	'loc.coordinates': {
        // 		$nearSphere: {
        // 			$geometry: { type: 'Point', coordinates: userLocation },
        // 			$minDistance: 0,
        // 			$maxDistance: 10 * 1000,
        // 		},
        // 	},
        // }
        // ()
        // .skip(pageNumber * 15)
        // .limit(15)
        if (userContact.includes(currentUser.contactNumber)) {
            const outlets = await Outlet.find().select(
                "-__v -createdAt -updatedAt -pid"
            );
            return res.status(200).json({ outlets });
        }
        const outlets = await Outlet.find({
            "info.timing.status": "open",
        }).select("-__v -createdAt -updatedAt -pid");
        res.status(200).json({ outlets });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

//DONE
const getMenu = async (req, res) => {
    const { outletId } = req.params;
    try {
        const menu = await OutletMenu.find({
            outletId: outletId,
            price: { $gte: 5 },
            status: "active",
        })
            .select("-__v -createdAt -updatedAt -outletId")
            .lean();
        const outlet = await Outlet.findById(outletId).select("menuTitles");
        res.status(200).json({
            menu: menu,
            menuTags: outlet.menuTitle,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// function for checking slotavailable

const slotBooking=async(date1,time1,userId)=>{


     // Convert them into a Date object
     let dateTime = new Date(date1 + " " + time1 + " GMT+0000");

    //  let todayDate = new Date();
    //  todayDate.setUTCHours(0, 0, 0, 0);

     let presentDateTime=new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

     let todayDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
     todayDate = new Date(todayDate);
     todayDate.setUTCHours(0, 0, 0, 0);
     
     // Calculate the difference in milliseconds
     let timeDifference = dateTime.getTime() - todayDate.getTime();

     // Calculate the difference in days
     let daysDifference = timeDifference / (1000 * 60 * 60 * 24);

     // if anyone try to book after twodays or any past date
     if(daysDifference>2 || dateTime<presentDateTime){
         //res.status(200).json({message: 'Invalid date for slot booking.'})

         return {
            shouldBook:false,
            message:"Invalid date for slot booking.",
            invalidDate:true,
            invalidTime:false,
            slotBooked:false,
            inTwoHour:false
         }
     }
     
    //--------------checking timeslot-----------------//
     const morningSlotStart = new Date(date1 + " " + "08:00 AM" + " GMT+0000");
     const afternoonSlotStart = new Date(date1 + " " + "12:00 PM" + " GMT+0000");
     const eveningSlotStart = new Date(date1 + " " + "05:00 PM" + " GMT+0000");
     const eveningSlotEnd = new Date(date1 + " " + "11:59 PM" + " GMT+0000");


     let selectedSlot;

     if(dateTime>=morningSlotStart && dateTime<afternoonSlotStart){
         selectedSlot="morningSlot"
     }else if(dateTime>=afternoonSlotStart && dateTime<eveningSlotStart){
         selectedSlot="afternoonSlot"
     }else if(dateTime>=eveningSlotStart && dateTime<eveningSlotEnd){
         selectedSlot="eveningSlot"
     }else{
         selectedSlot="InvalidTime";
         //return res.status(200).json({ message: 'Invalid time for slot booking.' });
         return {
            shouldBook:false,
            message:"Invalid time for slot booking.",
            invalidDate:false,
            invalidTime:true,
            slotBooked:false,
            inTwoHour:false
        
         }
     }

     let dayStarts = new Date(date1 + " " + "00:00 AM" + " GMT+0000");
     dayStarts.setUTCHours(0, 0, 0, 0);
     

     let nextDayStart = new Date(dayStarts);
     nextDayStart.setDate(dayStarts.getDate() + 1);
     nextDayStart.setUTCHours(0, 0, 0, 0);

     

      // Check if the selected time slot is available for the user
      const userSlot = await UserSlot.findOne({
         userId: userId,
         date: { $gte: dayStarts, $lt: nextDayStart },
         [`slot.${selectedSlot}.isBooked`]: false,
     });

    //  console.log(".........userID",userId);
     if (!userSlot) {
        // return res.status(200).json({ message: 'The selected time slot is already booked.' });
        return {
            shouldBook:false,
            message:"The selected time slot is already booked.",
            invalidDate:false,
            invalidTime:false,
            slotBooked:true,
            inTwoHour:false
        
         }

     }

     // checking another booked slot

     const anotherSlot= await UserSlot.findOne({
         userId: userId,
         date: { $gte: dayStarts, $lt: nextDayStart },
     });

     let slotsDetails=anotherSlot.slot;

     if(slotsDetails.morningSlot.isBooked==true){
         let timeofslot=slotsDetails.morningSlot.timing;
         // Calculate the absolute difference in milliseconds
         let timeDifferenceInMilliseconds = Math.abs(dateTime.getTime() - timeofslot.getTime());

         // Calculate the absolute difference in hours
         let timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

         // Check if the absolute difference is less than 2 hours
         if (timeDifferenceInHours < 2) {
            // return res.status(200).json({ message: 'You cannot book a slot with less than 2 hours gap.' });
            return {
                shouldBook:false,
                message:"You cannot book a slot with less than 2 hours gap.",
                invalidDate:false,
                invalidTime:false,
                slotBooked:false,
                inTwoHour:true
            
             }
         }

     }

     if(slotsDetails.afternoonSlot.isBooked==true){
         let timeofslot=slotsDetails.afternoonSlot.timing;
         // Calculate the absolute difference in milliseconds
         let timeDifferenceInMilliseconds = Math.abs(dateTime.getTime() - timeofslot.getTime());

         // Calculate the absolute difference in hours
         let timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

         // Check if the absolute difference is less than 2 hours
         if (timeDifferenceInHours < 2) {
             //return res.status(200).json({ message: 'You cannot book a slot with less than 2 hours gap.' });
             return {
                shouldBook:false,
                message:"You cannot book a slot with less than 2 hours gap.",
                invalidDate:false,
                invalidTime:false,
                slotBooked:false,
                inTwoHour:true
            
             }
         }

     }

     if(slotsDetails.eveningSlot.isBooked==true){
         let timeofslot=slotsDetails.eveningSlot.timing;
         // Calculate the absolute difference in milliseconds
         let timeDifferenceInMilliseconds = Math.abs(dateTime.getTime() - timeofslot.getTime());

         // Calculate the absolute difference in hours
         let timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

         // Check if the absolute difference is less than 2 hours
         if (timeDifferenceInHours < 2) {
            // return res.status(200).json({ message: 'You cannot book a slot with less than 2 hours gap.' });
            return {
                shouldBook:false,
                message:"You cannot book a slot with less than 2 hours gap.",
                invalidDate:false,
                invalidTime:false,
                slotBooked:false,
                inTwoHour:true
            
             }
         }

     }


     let bookingData={
        shouldBook:true,
        selectedSlot:selectedSlot,
        slotId:userSlot._id,
        slotTime:dateTime
     }

     return bookingData



}

// checking guest availability for plus owner

const guestAvailableForPLus=async(date1,time1,userId)=>{

    
     // Convert them into a Date object
     let dateTime = new Date(date1 + " " + time1 + " GMT+0000");

     let dayStarts = new Date(date1 + " " + "00:00 AM" + " GMT+0000");
     dayStarts.setUTCHours(0, 0, 0, 0);
     

     let nextDayStart = new Date(dayStarts);
     nextDayStart.setDate(dayStarts.getDate() + 1);
     nextDayStart.setUTCHours(0, 0, 0, 0);

     // Check if the selected time slot is available for the user
     const userSlot = await UserSlot.findOne({
        userId: userId,
        date: { $gte: dayStarts, $lt: nextDayStart },
    });

    let slotsDetails=userSlot.slot;

    
    if(slotsDetails.morningSlot.isBooked==true){
        let timeofslot=slotsDetails.morningSlot.timing;
        // Calculate the absolute difference in milliseconds
        let timeDifferenceInMilliseconds = Math.abs(dateTime.getTime() - timeofslot.getTime());

        // Calculate the absolute difference in hours
        let timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

        // Check if the absolute difference is less than 2 hours
        if (timeDifferenceInHours < 2) {
           
           return {
              guestAvailable:false
           
            }
        }

    }

    if(slotsDetails.afternoonSlot.isBooked==true){
        let timeofslot=slotsDetails.afternoonSlot.timing;
        // Calculate the absolute difference in milliseconds
        let timeDifferenceInMilliseconds = Math.abs(dateTime.getTime() - timeofslot.getTime());

        // Calculate the absolute difference in hours
        let timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

        // Check if the absolute difference is less than 2 hours
        if (timeDifferenceInHours < 2) {
           
            return {
                guestAvailable:false
             
              }
        }

    }

    if(slotsDetails.eveningSlot.isBooked==true){
        let timeofslot=slotsDetails.eveningSlot.timing;
        // Calculate the absolute difference in milliseconds
        let timeDifferenceInMilliseconds = Math.abs(dateTime.getTime() - timeofslot.getTime());

        // Calculate the absolute difference in hours
        let timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

        // Check if the absolute difference is less than 2 hours
        if (timeDifferenceInHours < 2) {
           
           return {
            guestAvailable:false
         
          }
        }

    }

    return {
        guestAvailable:true
     
      }


}

//DONE
const createOffer = async (req, res) => {
    const {
        date,
        time,
        offering,
        purpose,
        outletId,
        orderDetails,
        // {
        // 	forMe: {
        // 		item: { type: mongoose.Types.ObjectId, ref: 'OutletMenu' },
        // 	},
        // 	forYou: {
        // 		item: { type: mongoose.Types.ObjectId, ref: 'OutletMenu' },
        // 	},
        // }
        type, // instant or scheduled
        guestId, //optional
        check = false,
    } = req.body;
    const userId = req.user.id;
    try {
        
        let date1 = date;
        let time1 = time;

       // Convert them into a Date object
        let dateTime = new Date(date1 + " " + time1 + " GMT+0000");

        // slotBooking function take (date1,time1,userId)
        // slotBooking return shouldBook key shouldBook => true or false
        // if false then receive message otherwise receive shouldBook:true,selectedSlot:selectedSlot, slotId:userSlot._id,slotTime:dateTime

        let checkUserSlot= await slotBooking(date1,time1,userId);

        if(checkUserSlot.shouldBook==false ){
            res.status(400).json({message:`${checkUserSlot.message} from your side`,reason:"thisUser"});
            return;
        }

        if(guestId){
            let checkGuestSlot= await slotBooking(date1,time1,guestId);

            if(checkUserSlot.shouldBook==true && checkGuestSlot.shouldBook==true){
                // Update user slot

                await UserSlot.findByIdAndUpdate(
                        { _id: checkUserSlot.slotId },
                        {
                            $set: {
                                [`slot.${checkUserSlot.selectedSlot}.isBooked`]: true,
                                [`slot.${checkUserSlot.selectedSlot}.timing`]: checkUserSlot.slotTime,
                            },
                        }
                );

                // Update guest slot
                await UserSlot.findByIdAndUpdate(
                        { _id: checkGuestSlot.slotId },
                        {
                            $set: {
                                [`slot.${checkGuestSlot.selectedSlot}.isBooked`]: true,
                                [`slot.${checkGuestSlot.selectedSlot}.timing`]: checkGuestSlot.slotTime,
                            },
                        }
                );

            }else if(checkUserSlot.shouldBook==true && checkGuestSlot.shouldBook==false){

                let ownerUser= await User.findOne({_id:userId});

                if(ownerUser.subscription==true){

                    if(checkGuestSlot.inTwoHour==true || checkGuestSlot.invalidDate==true || checkGuestSlot.invalidTime==true){
                        res.status(400).json({message:`${checkGuestSlot.message} from Guest side`,reason:"anotherUser"});
                        return;
                    }else if(checkGuestSlot.slotBooked==true ){
                        // guestAvailableForPLus function return guestAvailable as boolean;
                       let isAvailable= await guestAvailableForPLus(date1,time1,guestId)
                       if(isAvailable.guestAvailable==false){
                        res.status(400).json({message:`${checkGuestSlot.message} from Guest side`,reason:"anotherUser"});
                        return;
                       }
                    }

                    
                }else{
                    res.status(400).json({message:`${checkGuestSlot.message} from Guest side`,reason:"anotherUser"});
                    return;
                }

            }else{

                
                res.status(400).json({message:`${checkGuestSlot.message} from Guest side`,reason:"anotherUser"});
                return;
                
                
            }

        }

        // Update user slot
        await UserSlot.findByIdAndUpdate(
            { _id: checkUserSlot.slotId },
            {
                $set: {
                    [`slot.${checkUserSlot.selectedSlot}.isBooked`]: true,
                    [`slot.${checkUserSlot.selectedSlot}.timing`]: checkUserSlot.slotTime,
                },
            }
        );       
        
        // Create a string in the desired format
        let output = dateTime
            .toUTCString()
            .replace("GMT", "GMT+0000 (Coordinated Universal Time)");

        console.log(".....output",output);
        let str = output;

        // Remove the comma
        let newStr = str.replace(",", "");

        console.log(newStr);
        function swapDateMonth(dateString) {
            // Split the string by space
            var dateParts = dateString.split(" ");

            // Swap the position of the month and date
            var temp = dateParts[1];
            dateParts[1] = dateParts[2];
            dateParts[2] = temp;

            // Join the parts back together with spaces
            var newDateString = dateParts.join(" ");
            return newDateString;
        }

        // Convert date from d/m/y to MM/DD/YYYY format
        const parts = date1.match(/(\w{3}) (\d{1,2}), (\d{4})/);
        if (parts) {
            let [, month, day, year] = parts;
            if (year.length === 2) {
                year = "20" + year;
            }
            const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1; // Convert month to a number
            date1 = `${monthNumber.toString().padStart(2, "0")}/${day.padStart(
                2,
                "0"
            )}/${year}`;
            console.log(date1);
        } else {
            console.log("Invalid date format");
        }

        let dateTime1 = swapDateMonth(newStr);

        console.log("..dateTime1",dateTime1);
        console.log("..")


        const items = [];
        if (orderDetails.forMe) {
            const item = await OutletMenu.findById(
                orderDetails.forMe.item
            ).select("price");
            items.push(item.price);
        }
        if (orderDetails.forYou) {
            const item = await OutletMenu.findById(
                orderDetails.forYou.item
            ).select("price");
            items.push(item.price);
        }
        let total = items.reduce((sum, item) => sum + item, 0);
        total = parseFloat(total.toFixed(2));
        const user = await User.findById(userId);
        const check = user.subscription;
        let tax = total * 0.05;
        const platformCharge = check ? 0.0 : 5.0;
        //-------------change here later
        tax = 0;
        //------------
        // const platformTax = check ? 0.0 : 0.9;
        // tax = tax + platformTax;
        const billTotal = total + tax + platformCharge;
        const bill = {
            itemTotal: total.toFixed(2),
            tax: tax.toFixed(2),
            platformCharge: platformCharge.toFixed(2),
            total: billTotal.toFixed(2),
        };

        const bodyData = {
            owner: userId,
            guest: guestId ? guestId : null,
            time: dateTime1,
            offering: offering,
            purpose: purpose,
            status: "paymentPending",
            outlet: outletId,
            orderDetails: orderDetails,
            bill: bill,
            offerType: type,
        };

        const offer = await Offer.create(bodyData);
        const myOffer = await Offer.findById(offer._id)
            .populate([
                "orderDetails.forMe.item",
                "orderDetails.forYou.item",
                "outlet",
            ])
            .exec();

        if (guestId) {
            await handleOfferCreationInChatRoom(offer._id, check);
        }
        await OfferResponse.create({ offerId: offer._id });
        res.status(200).json({ offer: myOffer });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const sendData = async (req, res) => {
    const { offerId } = req.params;
    try {
        const myOffer = await Offer.findById(offerId)
            .populate([
                "orderDetails.forMe.item",
                "orderDetails.forYou.item",
                "outlet",
            ])
            .exec();
        res.status(200).json({ offer: myOffer });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

//DONE
const floatOffer = async (req, res) => {
    //!------
    // TODO: need to modify it to handle scheduled and instant offers
    //!------
    const userId = req.user.id;
    const { offerId, date, time } = req.body;
    try {

        //chacking user have empty slot or not
        let checkUserSlot= await slotBooking(date,time,userId);

        if(checkUserSlot.shouldBook==false ){
            res.status(400).json({message:`${checkUserSlot.message} from your side`,reason:"thisUser"});
            return;
        }


        // Update user slot
        await UserSlot.findByIdAndUpdate(
            { _id: checkUserSlot.slotId },
            {
                $set: {
                    [`slot.${checkUserSlot.selectedSlot}.isBooked`]: true,
                    [`slot.${checkUserSlot.selectedSlot}.timing`]: checkUserSlot.slotTime,
                },
            }
        ); 



        const data = await UserCheck.findOne({ uid: userId });
        if (data && data.offerId && data.offerId === offerId) {
            data.floatCount += 1;
        }
        const offer = await Offer.findById(offerId);
        if (date && time) {
            let date1 = date;
            let time1 = time;

            // Convert them into a Date object
            let dateTime = new Date(date1 + " " + time1 + " GMT+0000");

            // Create a string in the desired format
            let output = dateTime
                .toUTCString()
                .replace("GMT", "GMT+0000 (Coordinated Universal Time)");

            console.log(output);
            let str = output;

            // Remove the comma
            let newStr = str.replace(",", "");

            console.log(newStr);
            function swapDateMonth(dateString) {
                // Split the string by space
                var dateParts = dateString.split(" ");

                // Swap the position of the month and date
                var temp = dateParts[1];
                dateParts[1] = dateParts[2];
                dateParts[2] = temp;

                // Join the parts back together with spaces
                var newDateString = dateParts.join(" ");
                return newDateString;
            }

            // Convert date from d/m/y to MM/DD/YYYY format
            const parts = date1.match(/(\w{3}) (\d{1,2}), (\d{4})/);
            if (parts) {
                let [, month, day, year] = parts;
                if (year.length === 2) {
                    year = "20" + year;
                }
                const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1; // Convert month to a number
                date1 = `${monthNumber
                    .toString()
                    .padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
                console.log(date1);
            } else {
                console.log("Invalid date format");
            }

            let dateTime1 = swapDateMonth(newStr);
            offer.time = dateTime1;
        }
        const user = await User.findById(userId);
        offer.status = "floating";
        user.offer = offerId;
        await offer.save();
        await user.save();

        // update offer responce
        let offerResponseObject=await OfferResponse.findOne({offerId});

        offerResponseObject.users=[];
        await offerResponseObject.save();

        res.status(200).json({ success: true });
        // Schedule to update the offer status after 24 hours
        // setTimeout(async () => {
        //     const updatedOffer = await Offer.findById(offerId);
        //     if (updatedOffer.status === "floating") {
        //         updatedOffer.status = "archived";
        //         await updatedOffer.save();
        //     }
        // }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// SCAN //TODO: NEED TO rewrite this to integrate coupons  //DONE
const useOffer = async (req, res) => {
    const userId = req.user.id;
    const { outletId, couponId } = req.body;
    try {
        if (!outletId || !couponId || outletId === "-1") {
            return res
                .status(400)
                .json({ success: false, message: "Incomplete data" });
        }
        const coupon = await Coupon.findById(couponId);
        const offer = await Offer.findOne({
            _id: coupon.offer,
        })
            .populate("owner")
            .populate("guest")
            .populate("outlet")
            .populate("orderDetails.forMe.item")
            .populate("orderDetails.forYou.item");
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 5);
        currentTime.setMinutes(currentTime.getMinutes() + 30);
        const finalTime = new Date(offer.timeDate);
        console.log(currentTime);
        console.log(finalTime);
        if (currentTime < finalTime) {
            return res
                .status(400)
                .json({ message: "cannot redeem before time" });
        }
        finalTime.setMinutes(finalTime.getMinutes() + 15); //! need to make it dynamic +10

        if (offer.earlyBird) {
            offer.status = "consumed";
            coupon.status = "consumed";
            const data = {
                targetId: outletId,
                sourceId: userId,
                couponId,
            };
            await coupon.save();
            await offer.save();

            socket.emit("arrival", data);
            socket.emit("processOrder", data);
            return res.status(200).json({
                success: true,
                orderStatus: "Order Processed",
                text: "Please collect your order from the counter",
            });
        }
        console.log("Coupon Owner:", coupon.owner.toString());
        console.log("Offer Owner:", offer.owner.toString());
        let userType = "guest";
        let check1 = "host";
        let check2 = offer.owner._id;
        if (coupon.owner.toString() === offer.owner._id.toString()) {
            userType = "host";
            check1 = "guest";
            check2 = offer.guest._id;
        }
        let flow = 1;
        if (offer.arrivalStatus[check1] === true) {
            flow = 2;
        }
        const otherUserCoupon = await Coupon.findOne({
            owner: check2,
            offer: offer._id,
        });

        const data = {
            targetId: outletId,
            sourceId: userId,
            couponId,
        };

        socket.emit("arrival", data);
        // Create a Date object for the current time
        let cronTime = new Date();

        // Add 15 minutes to it
        cronTime.setMinutes(cronTime.getMinutes() + 15);

        switch (userType) {
            case "guest":
                switch (flow) {
                    case 1:
                        offer.status = "active";
                        offer.arrivalStatus[userType] = true;
                        coupon.status = "active";

                        await sendPushNotification(
                            offer.owner.deviceId,
                            `${offer.guest.name} has arrived`,
                            `Please reach ${
                                offer.outlet.name
                            } before ${getFinalTime(offer.time, 15)}`
                        );
                        console.log("guset arrived first");
                        async function handleCron(
                            offerId,
                            couponId,
                            otherCouponId,
                            outletId
                        ) {
                            console.log("guest func after 15 min");
                            console.log(`offerId: ${offerId}`);
                            console.log(`couponId: ${couponId}`);
                            console.log(`otherCouponId: ${otherCouponId}`);
                            console.log(`outletId: ${outletId}`);

                            const offer = await Offer.findById(offerId)
                                .populate("owner")
                                .populate("guest")
                                .exec();

                            if (!offer.arrivalStatus.host) {
                                // Expire host coupon and guest coupon

                                await Coupon.findOneAndUpdate(
                                    { _id: otherCouponId },
                                    { $set: { status: "expired" } }
                                );
                                await Coupon.findOneAndUpdate(
                                    { _id: couponId },
                                    { $set: { status: "consumed" } }
                                );

                                // Process order for guest coupon
                                const data = {
                                    targetId: outletId,
                                    sourceId: offer.guest._id.toString(),
                                    couponId,
                                };
                                socket.emit("processOrder", data);
                                // Expire offer
                                offer.status = "expired";

                                // If host item is available, create a new offer and set its status to archive
                                if (offer.orderDetails.forMe) {
                                    const newOffer = new Offer({
                                        owner: offer.owner._id,
                                        offering: offer.offering,
                                        purpose: offer.purpose,
                                        time: offer.time,
                                        status: "archived",
                                        outlet: offer.outlet,
                                        loc: offer.loc,
                                        orderDetails: {
                                            forYou: offer.orderDetails.forMe,
                                        },
                                        bill: {
                                            itemTotal: 0,
                                            tax: 0,
                                            discount: 0,
                                            total: 0,
                                        },
                                        billStatus: "success",
                                    });

                                    await newOffer.save();
                                }

                                // Notify both users

                                await Promise.all([
                                    sendPushNotification(
                                        offer.owner.deviceId,
                                        `You missed a meet with ${offer.guest.name}`,
                                        `Your offer has been moved to archive`
                                    ),
                                    sendPushNotification(
                                        offer.guest.deviceId,
                                        `Sorry to keep you waiting`,
                                        `looks like ${offer.owner.name} is unable to make it, enjoy your order`
                                    ),
                                    offer.save(),
                                ]);
                            }
                        }
                        schedule.scheduleJob(cronTime, async () => {
                            try {
                                await handleCron(
                                    offer._id,
                                    coupon._id,
                                    otherUserCoupon._id,
                                    outletId
                                );
                            } catch (err) {
                                console.error(err);
                            }
                        });

                        await Promise.all([
                            offer.save(),
                            coupon.save(),
                            otherUserCoupon.save(),
                        ]);
                        break;

                    case 2:
                        //both arrived
                        console.log("guest arrived second");
                        //set both coupon to consumed
                        coupon.status = "consumed";
                        otherUserCoupon.status = "consumed";
                        offer.arrivalStatus[userType] = true;

                        // set offer to consumed
                        offer.status = "consumed";

                        // notify user
                        await sendPushNotification(
                            offer.guest.deviceId,
                            `${offer.owner.name} is here`,
                            `Enjoy your meet`
                        );
                        await Promise.all([
                            offer.save(),
                            coupon.save(),
                            otherUserCoupon.save(),
                        ]);
                        // process order
                        const data = {
                            targetId: outletId,
                            sourceId: offer.guest._id.toString(),
                            couponId,
                        };
                        socket.emit("processOrder", data);
                        break;
                }
                break;
            case "host":
                switch (flow) {
                    case 1:
                        offer.status = "active";
                        offer.arrivalStatus[userType] = true;
                        coupon.status = "active";
                        console.log("host arrived first");
                        await sendPushNotification(
                            offer.guest.deviceId,
                            `${offer.owner.name} has arrived`,
                            `Please reach ${
                                offer.outlet.name
                            } before ${getFinalTime(offer.time, 15)}` //! need to make it dynamic +10
                        );
                        async function handleCron(
                            offerId,
                            couponId,
                            otherCouponId
                        ) {
                            console.log("host func after 15 min");
                            console.log(`offerId: ${offerId}`);
                            console.log(`couponId: ${couponId}`);
                            console.log(`otherCouponId: ${otherCouponId}`);
                            console.log(`outletId: ${outletId}`);
                            const offer = await Offer.findById(offerId)
                                .populate("owner")
                                .populate("guest")
                                .exec();

                            if (!offer.arrivalStatus.guest) {
                                //expire guest coupon
                                //host coupon status = actionNeeded

                                // Expire host coupon and guest coupon
                                await Promise.all([
                                    Coupon.findOneAndUpdate(
                                        { _id: couponId },
                                        { $set: { status: "actionNeed" } }
                                    ),
                                    Coupon.findOneAndUpdate(
                                        { _id: otherCouponId },
                                        { $set: { status: "expired" } }
                                    ),
                                    Offer.findByIdAndUpdate(offerId, {
                                        $unset: { guest: 1 },
                                        $set: { status: "actionNeed" },
                                    }),
                                    sendPushNotification(
                                        offer.guest.deviceId,
                                        `You missed a meet with ${offer.owner.name}`,
                                        `Your offer has been moved to archive`
                                    ),
                                    sendPushNotification(
                                        offer.owner.deviceId,
                                        `Sorry to keep you waiting`,
                                        `looks like  ${offer.guest.name} is unable to make it, Manage you Offer`
                                    ),
                                    //// offer.save(),
                                ]);
                            }
                        }

                        schedule.scheduleJob(cronTime, () => {
                            handleCron(
                                offer._id,
                                coupon._id,
                                otherUserCoupon._id
                            ).catch((err) => console.error(err));
                        });
                        await Promise.all([
                            offer.save(),
                            coupon.save(),
                            otherUserCoupon.save(),
                        ]);
                        break;
                    case 2:
                        //both user arrived
                        console.log("host arrived second");
                        coupon.status = "consumed";
                        otherUserCoupon.status = "consumed";
                        offer.arrivalStatus[userType] = true;

                        // set offer to consumed
                        offer.status = "consumed";

                        await Promise.all([
                            // sendPushNotification(
                            //     offer.owner.deviceId,
                            //     `${offer.guest.name} is here`,
                            //     `Enjoy your meet`
                            // ),
                            offer.save(),
                            coupon.save(),
                            otherUserCoupon.save(),
                        ]);
                        // process order
                        const data = {
                            targetId: outletId,
                            sourceId: offer.owner._id.toString(),
                            couponId,
                        };
                        socket.emit("processOrder", data);
                        // notify user

                        break;
                }
                break;
        }
        const arrivalData = await Arrival.findOne({ offer: coupon.offer });

        res.status(200).json({
            success: true,
            orderStatus:
                flow === 1
                    ? `Waiting for ${userType === "host" ? "guest" : "host"}`
                    : "Order Processed",
            text:
                flow === 1
                    ? `Your guest has already been notified upon your arrival`
                    : `Your Guest is waiting for you at Table ${
                          arrivalData.table === "unassigned"
                              ? "!"
                              : "No." + arrivalData.table
                      }`,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

//DONE
const getOfferDetails = async (req, res) => {
    // const userId = req.user.id;
    const { offerId } = req.params;
    try {
        const offer = await Offer.findById(offerId)
            .select("-__v -createdAt -updatedAt")
            .populate("owner")
            .populate("guest")
            .populate("outlet")
            .populate("orderDetails.forMe.item")
            .populate("orderDetails.forYou.item")
            .exec();

        res.status(200).json({ offer });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

//DONE
const getOfferResponse = async (req, res) => {
    const userId = req.user.id;
    const { offerId } = req.params;
    try {
        const data = await OfferResponse.findOne({ offerId });
        if (!data) {
            await OfferResponse.create({
                offerId,
            });
        }
        const offerResponse = await OfferResponse.findOne({ offerId }).populate(
            "users"
        );
        const swipe = await Swipe.findOne({ uid: userId });
        const response = offerResponse.users.filter(
            (user) => !swipe.match.includes(user._id)
        );
        res.status(200).json({ users: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

//DONE
const handleOfferResponse = async (req, res) => {
    ///// TODO: NEED TO rewrite this to integrate coupons
    const userId = req.user.id;
    const { offerId,groupOfferId, selectedUserId, actionType } = req.body;
    try {
  
      const [user, secondUser, offer, userSwipeData, secondUserSwipeData] =
      await Promise.all([
          User.findById(userId),
          User.findById(selectedUserId),
          Offer.findById(offerId),
          Swipe.findOne({ uid: userId }),
          Swipe.findOne({
          uid: selectedUserId,
          }),
      ]);
  
      userSwipeData.responsesRemaining=userSwipeData.responsesRemaining-1;
      
  
      if(actionType=="right"){
  
          offer.guest = selectedUserId;
          offer.status = "shared";
  
          userSwipeData.match.push(selectedUserId);
          userSwipeData.gotRight.pull(selectedUserId);
          secondUserSwipeData.right.pull(userId);
          secondUserSwipeData.match.push(userId);
  
          await Promise.all([
          offer.save(),
          User.findOneAndUpdate({ _id: userId }, { $unset: { offer: 1 } }),
          OfferResponse.findOneAndDelete({ offerId }),
          userSwipeData.save(),
          secondUserSwipeData.save(),
          ]);
          const { guestOfferId, ownerOfferId } = await handleMatchViaOfferResponse(
          offerId
          );
          const room = await Room.create({
          firstUser: {
              userId,
              name: user.name,
              image: user.image[0],
              coupon: ownerOfferId,
          },
          secondUser: {
              userId: selectedUserId,
              name: secondUser.name,
              image: secondUser.image[0],
              coupon: guestOfferId,
          },
          offer: offerId,
          offerStatus: "shared",
          });
          const roomData = await Room.findOne({ _id: room._id })
          .select("-__v -createdAt -updatedAt")
          .populate("offer", "-createdAt -updatedAt")
          .populate("firstUser.coupon", "-createdAt -updatedAt")
          .populate("secondUser.coupon", "-createdAt -updatedAt");
          res.status(200).json({ room: roomData });
  
      }else if(actionType=="left"){
          userSwipeData.left.push(selectedUserId);
          userSwipeData.gotRight.pull(selectedUserId)
          await userSwipeData.save();
          return res.status(200).json({ success: true, matched: [] });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  };

//DONE
const activeDeals = async (req, res) => {
    //! MY COUPONS
    const userId = req.user.id;
    try {
        const coupons = await Coupon.find({
            owner: userId,
            status: { $nin: ["consumed", "expired","actionNeed"] },
        })
            .populate("offer")
            .populate("item")
            .populate("outlet")
            .populate("owner")
            .populate("meetingWith")
            .exec();
        res.status(200).json({ coupons });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

//DONE
const myOffers = async (req, res) => {
    const userId = req.user.id;
    try {
        const myOffers = await Offer.find({
            owner: userId,
            earlyBird: false,
            status: {
                $in: [
                    "active",
                    "floating",
                    "shared",
                    "consumed",
                    "expired",
                    "archived",
                    "refunded",
                    "paymentPending",
                    "actionNeed",
                ],
            },
        })
            .populate([
                "outlet",
                "orderDetails.forMe.item",
                "orderDetails.forYou.item",
            ])
            .select("-timeDate")
            .exec();
        const offers = myOffers.reduce(
            (result, offer) => {
                if (
                    offer.status === "consumed" ||
                    offer.status === "expired" ||
                    offer.status === "refunded"
                ) {
                    result.completed.push(offer);
                } else if (
                    offer.status === "floating" ||
                    offer.status === "shared" ||
                    offer.status === "active"
                ) {
                    result.inprogress.push(offer);
                } else if (
                    offer.status === "archived" ||
                    offer.status === "paymentPending" ||
                    offer.status === "actionNeed"
                ) {
                    result.archived.push(offer);
                }
                return result;
            },
            { completed: [], inprogress: [], archived: [] }
        );
        res.status(200).json({ offers });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const takeActionAgainstOffer = async (req, res) => {
    const userId = req.user.id;
    const { offerId, action } = req.body; //floating //consumed
    try {
        const offer = await Offer.findByIdAndUpdate(
            offerId,
            {
                $set: { status: action },
            },
            { new: true }
        );
        const currentDate = new Date();
        const setupDate = new Date(offer.time);
        setupDate.setHours(currentDate.getHours());
        setupDate.setMinutes(currentDate.getMinutes() + 30);
        setupDate.setMonth(currentDate.getMonth());
        setupDate.setDate(currentDate.getDate());

        const coupon = await Coupon.findOne({ offer: offer._id });
        if (action === "floating") {
            offer.responseCount = 0;
            offer.time = setupDate;
            offer.offerType = "instant";
            await offer.save();
            await Arrival.findOneAndDelete({ offer: offer._id });
            const user = await User.findById(userId);
            user.offer = offer._id;
            await user.save();
            coupon.status = "expired";
            await coupon.save();
        }
        if (action === "consumed") {
            if (offer.orderDetails.forMe) {
                const data = {
                    targetId: offer.outlet.toString(),
                    sourceId: offer.host.toString(),
                    couponId: coupon._id,
                };
                socket.emit("processOrder", data);
                coupon.status = "consumed";
                await coupon.save();
                await Offer.create({
                    owner: userId,
                    time: offer.time,
                    offering: offer.offering,
                    purpose: offer.purpose,
                    status: "archived",
                    outlet: offer.outlet,
                    loc: offer.loc,
                    orderDetails: {
                        forYou: {
                            item: offer.orderDetails.forYou.item,
                        },
                    },
                    bill: offer.bill,
                    billStatus: "success",
                    offerType: "scheduled",
                });
            } else {
                coupon.status = "consumed";
                coupon.item = offer.orderDetails.forYou.item;
                await coupon.save();
                const data = {
                    targetId: offer.outlet.toString(),
                    sourceId: offer.owner.toString(),
                    couponId: coupon._id,
                };
                socket.emit("processOrder", data);
                offer.status = "consumed";
            }
            await offer.save();
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}; // archive, float, revoke, reschedule offer

const getEarlyBirdOutlet = async (req, res) => {
    const userId = req.user.id;
    try {
        const outlets = await Outlet.find({
            earlyBird: true,
            couponsLeft: { $gte: 1 },
        }).select("name");
        res.status(200).json({ outlets });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const getEarlyBirdOutletItem = async (req, res) => {
    // const userId = req.user.id;
    const { outletId } = req.params;
    try {
        const outletMenu = await OutletMenu.find({
            outletId,
            earlyBird: true, //!add coupon count
        }).select("name");
        console.log({
            outletId,
            earlyBird: true,
        });
        console.log(outletMenu);
        const timeSlot = await TimeSlot.findOne({ outletId });
        res.status(200).json({ outletMenu, timeSlot });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const confirmOffer = async (req, res) => {
    const userId = req.user.id;
    const { outletId, itemId, date, time, timeSlot, whatsappNumber } = req.body;
    try {
        const timeSlotData = await TimeSlot.findOne({ outletId });
        console.log(timeSlotData);
        let timeAdd = 0;
        timeSlotData.slots.map((slot) => {
            if (slot.date === date) {
                slot.time.map((time_1hr) => {
                    if (time_1hr.timing === time) {
                        time_1hr.timeSlots.map((ele, index) => {
                            if (ele.slotTime === timeSlot) {
                                ele.slotLeft -= 1; // Decrease the slotLeft by 1
                                timeAdd = index;
                            }
                        });
                    }
                });
            }
        });

        let newOffer = await Offer.create({
            owner: userId,
            status: "shared",
            outlet: outletId,
            billStatus: "success",
            earlyBird: true,
        });
        let date1 = date;
        let time1 = time;

        // Convert date from d/m/y to MM/DD/YYYY format
        let [day, month, year] = date1.split("/");
        if (year.length === 2) {
            year = "20" + year;
        }
        date1 = `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;

        let dateTime = new Date(date1 + " " + time1);
        timeAdjust = timeAdd * 10;
        dateTime.setMinutes(dateTime.getMinutes() + timeAdjust);
        console.log(timeAdd);
        const coupon = await Coupon.create({
            offer: newOffer._id,
            item: itemId,
            outlet: outletId,
            time: dateTime,
            owner: userId,
            status: "claimable",
        });
        await timeSlotData.save();

        const newCoupon = await Coupon.findById(coupon._id).populate(
            "item outlet owner"
        );
        const user = await User.findById(userId);
        console.log(userId);
        console.log(user);
        user.whatsappNumber = whatsappNumber;
        user.earlyBirdCouponClaimed = true;
        if (user.contactNumber === "+919876543210") {
            user.offerTwo.days = 2;
            user.offerTwo.offerBool = true;
        }
        await user.save();
        await Arrival.create({
            offer: newOffer._id,
            time: dateTime,
            status: "upcoming",
            outlet: newOffer.outlet,
        });
        const outlet = await Outlet.findById(newOffer.outlet);
        outlet.couponsLeft -= 1;
        await outlet.save();
        res.status(200).json({ coupon: newCoupon });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const sendAlert = async (req, res) => {
    const userId = req.user.id;
    const { couponId } = req.params;
    try {
        const coupon = await Coupon.findById(couponId);
        const data = {
            targetId: coupon.outlet.toString(),
            sourceId: userId,
            couponId,
        };
        socket.emit("alert", data);
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
const blockUser = async (currentUserId, blockUserId, block) => {
    try {
        console.log(currentUserId, blockUserId);
        const currentUserSwipe = await Swipe.findOne({ uid: currentUserId });
        const blockUserSwipe = await Swipe.findOne({ uid: blockUserId });
        const room = await Room.findOne({
            $and: [
                {
                    $or: [
                        { "firstUser.userId": currentUserId },
                        { "firstUser.userId": blockUserId },
                    ],
                },
                {
                    $or: [
                        { "secondUser.userId": currentUserId },
                        { "secondUser.userId": blockUserId },
                    ],
                },
            ],
        });

        // if (room.offer) {
        //     const offer = await Offer.findById(room.offer);
        //     if (offer) {
        //         if ((offer.status = "shared")) {
        //             if (offer.owner === currentUserId) {
        //                 await Coupon.deleteMany({
        //                     offer: room.offer,
        //                     owner: currentUserId,
        //                 });
        //                 if (offer.orderDetails.forMe.item) {
        //                     const data = await Offer.create({
        //                         owner: currentUserId,
        //                         time: offer.time,
        //                         offering: offer.offering,
        //                         purpose: offer.purpose,
        //                         status: "archived",
        //                         outlet: offer.outlet,
        //                         loc: offer.loc,
        //                         bill: offer.bill,
        //                         billStatus: "success",
        //                         offerType: "scheduled",
        //                         orderDetails: {
        //                             forYou: {
        //                                 item: offer.orderDetails.forMe.item,
        //                             },
        //                         },
        //                     });
        //                     const item = await OutletMenu.findById(
        //                         offer.orderDetails.forMe.item
        //                     );
        //                     await Ledger.findOneAndUpdate(
        //                         { offerId: room.offer }, // filter
        //                         {
        //                             $set: {
        //                                 offerId: data._id,
        //                                 price: item.price,
        //                             },
        //                         }, // update
        //                         { new: true, useFindAndModify: false } // options
        //                     );
        //                 }
        //             } else {
        //                 await Coupon.deleteMany({ offer: room.offer });
        //                 offer.status = "archived";
        //                 offer.guest = null;
        //                 await offer.save();
        //                 await Arrival.deleteMany({ offer: room.offer });
        //             }
        //         }
        //     }
        // }

        //console.log(currentUserSwipe, blockUserSwipe, room);
        currentUserSwipe.match.pull(blockUserId);
        blockUserSwipe.match.pull(currentUserId);
        currentUserSwipe.swipeId.pull(blockUserId);
        blockUserSwipe.swipeId.pull(currentUserId);
        if (block) {
            currentUserSwipe.blockedUser.push(blockUserId);
            blockUserSwipe.blockedUser.push(currentUserId);
        }
        await Room.findOneAndDelete({
            $and: [
                {
                    $or: [
                        { "firstUser.userId": currentUserId },
                        { "firstUser.userId": blockUserId },
                    ],
                },
                {
                    $or: [
                        { "secondUser.userId": currentUserId },
                        { "secondUser.userId": blockUserId },
                    ],
                },
            ],
        }),
            Chat.deleteMany({
                roomId: room._id,
            });
        await Promise.all([currentUserSwipe.save(), blockUserSwipe.save()]);
    } catch (err) {
        throw new Error(err);
    }
};

//for reopen slot need id || day=> useDate datetime of offermodel || timing => time datetime of offermodel

const makeReopenSlot=async(offerId)=>{

    let offerData= await Offer.findOne({_id:offerId});

    let ownerId= offerData.owner;
    let guestId= offerData.guest;
    let dateTime= offerData.timeDate;

    let offerDate= offerData.timeDate;
    offerDate.setUTCHours(0, 0, 0, 0);

    // let  = new Date(timeDate.getFullYear(), timeDate.getMonth(), timeDate.getDate(), 8, 0, 0);
    // let afternoonSlotStart = new Date(timeDate.getFullYear(), timeDate.getMonth(), timeDate.getDate(), 12, 0, 0);
    // let eveningSlotStart = new Date(timeDate.getFullYear(), timeDate.getMonth(), timeDate.getDate(), 17, 0, 0);
    // let eveningSlotEnd = new Date(timeDate.getFullYear(), timeDate.getMonth(), timeDate.getDate(), 23, 59, 0);

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
    let nextDayStart=new Date(dayStarts);
    nextDayStart.setUTCDate(nextDayStart.getUTCDate() + 1);

    // Update owner slot

    let ownerSlot= await UserSlot.findOne(
        { userId: ownerId,date: { $gte: dayStarts, $lt: nextDayStart } },      
    );

    ownerSlot.slot[selectedSlot].isBooked=false;

    await ownerSlot.save();

    console.log("ownerSlot.slot[selectedSlot].isBooked",ownerSlot.slot[selectedSlot].isBooked)

    console.log("ownerSlot...",ownerSlot)

    // Update guest slot

    let GuestSlot= await UserSlot.findOne(
        { userId: guestId,date: { $gte: dayStarts, $lt: nextDayStart } },      
    );

    GuestSlot.slot[selectedSlot].isBooked=false;

    await GuestSlot.save();

    // await UserSlot.findOneAndUpdate(
    //     { userId: guestId,
    //         date: { $gte: dayStarts, $lt: nextDayStart }, },
        
    // );

}

const acceptRejectOffer = async (req, res) => {
    const { action, offerId, roomId } = req.body;
    const userId = req.user.id;
    try {
        const offer = await Offer.findById(offerId);
        const room = await Room.findById(roomId);
        const currentUser = await User.findById(userId);
        const ownerUser = await User.findById(offer.owner);
        const offerNotification = await OfferNotification.findOne({
            room: roomId,
        });
        offerNotification.status = "Completed";
        if (action === "accept") {

            if(offer.status=="floating" && room.superOffer==true){

                console.log("accept floating offer.........")
                room.offerStatus = "shared";
                offer.guest = userId;
                offer.status="shared"
                await offer.save();

                // making coupons

                let offerOutlet= offer.outlet;
                let offertime= offer.time;
                let offerOwner= offer.owner;
                let offerTimeDate= offer.timeDate;
                let itemForYou= offer.orderDetails.forYou;
                let itemForMe= offer.orderDetails.forMe?offer.orderDetails.forMe:null 

                let couponForGuest= await Coupon.create({
                    offer:offer._id,
                    item:itemForYou,
                    outlet:offerOutlet,
                    time:offertime,
                    owner:userId,
                    status:"claimable",
                    meetingWith:offerOwner,
                    timeDate:offerTimeDate

                })

                couponForGuest= await Coupon.findOne({offer:offer._id,owner:userId})

                let couponForHost= await Coupon.create({
                    offer:offer._id,
                    item:itemForMe,
                    outlet:offerOutlet,
                    time:offertime,
                    owner:offerOwner,
                    status:"claimable",
                    meetingWith:userId,
                    timeDate:offerTimeDate

                })

                couponForHost= await Coupon.findOne({offer:offer._id,owner:offerOwner})

                if(room.firstUser.userId== userId){

                    room.firstUser.coupon=couponForGuest._id;
                    room.secondUser.coupon= couponForHost._id;
                }else{
                    room.firstUser.coupon= couponForHost._id ;
                    room.secondUser.coupon= couponForGuest._id;
                }

                await room.save();


            }else{

                room.offerStatus = "accepted";
                offer.guest = userId;
                await offer.save();
                await room.save();
                // Schedule a function to run after 30mins

                console.log("........ nonfloating offer accepted")

                let timeee= new Date();
                let endTime= new Date(timeee.getTime()+30*60000);
                //timeee=timeee.setMinutes(timeee.getMinutes()+1)
                schedule.scheduleJob(endTime,async () => {
                    try {
                        console.log("This will run after 30 minutes");
                        const offerData = await Offer.findById(offerId);
                        const roomData = await Room.findById(roomId);

                        console.log(".....roomdata",roomData)
                        if (roomData.offerStatus !== "shared") {

                            console.log("payment is not done till after time.......")

                            await blockUser(
                                offerData.guest.toString(),
                                offerData.owner.toString(),
                                false
                            );

                            offer.status = "expired";
                            await offerData.save();
                            await makeReopenSlot(offerId)
                            console.log("user is blocked.......k")

                        }

                        console.log("now it should refresh......")
                        socket.emit("chatRefresh",roomId)
                    } catch (error) {
                        console.error(`Error occurred: ${error}`);
                        // Handle error as needed
                    }
                });

                await sendPushNotification(
                    ownerUser.deviceId,
                    `${currentUser.name} accepted your offer`,
                    "Complete your payment to proceed"
                );

            }

            
        } else {

            // function for reopen slot for respected time.
            await makeReopenSlot(offerId)
            await blockUser(userId, offer.owner.toString(), false);
            await sendPushNotification(
                ownerUser.deviceId,
                `${currentUser.name} has declined your offer`,
                "Your offer has been removed"
            );
        }
        await offerNotification.save();
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const confirmFreeDeal = async (req, res) => {
    const { date, time, outletId, itemId, whatsappNumber } = req.body;
    const offering = "A drink";
    const purpose = "Want a date";
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        const userChecks = await UserCheck.findOne({ uid: userId });

        if (!userChecks.offerId) {
            const bill = {
                itemTotal: 0,
                tax: 0,
                platformCharge: 0,
                total: 0,
            };

            let date1 = date;
            let time1 = time;

            // Convert them into a Date object
            let dateTime = new Date(date1 + " " + time1 + " GMT+0000");

            // Create a string in the desired format
            let output = dateTime
                .toUTCString()
                .replace("GMT", "GMT+0000 (Coordinated Universal Time)");

            console.log(output);
            let str = output;

            // Remove the comma
            let newStr = str.replace(",", "");

            console.log(newStr);
            function swapDateMonth(dateString) {
                // Split the string by space
                var dateParts = dateString.split(" ");

                // Swap the position of the month and date
                var temp = dateParts[1];
                dateParts[1] = dateParts[2];
                dateParts[2] = temp;

                // Join the parts back together with spaces
                var newDateString = dateParts.join(" ");
                return newDateString;
            }

            // Convert date from d/m/y to MM/DD/YYYY format
            const parts = date1.match(/(\w{3}) (\d{1,2}), (\d{4})/);
            if (parts) {
                let [, month, day, year] = parts;
                if (year.length === 2) {
                    year = "20" + year;
                }
                const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1; // Convert month to a number
                date1 = `${monthNumber
                    .toString()
                    .padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
                console.log(date1);
            } else {
                console.log("Invalid date format");
            }

            let dateTime1 = swapDateMonth(newStr);
            const bodyData = {
                owner: userId,
                time: dateTime1,
                offering: offering,
                purpose: purpose,
                status: "archived",
                outlet: outletId,
                orderDetails: {
                    forYou: { item: itemId },
                },
                bill: bill,
                billStatus: "success",
                offerType: "scheduled",
            };

            const offer = await Offer.create(bodyData);
            const myOffer = await Offer.findById(offer._id)
                .populate([
                    "orderDetails.forMe.item",
                    "orderDetails.forYou.item",
                    "outlet",
                ])
                .exec();
            userChecks.freeOffer = true;
            userChecks.offerId = myOffer._id;
            await OfferResponse.create({ offerId: offer._id });
            if (user.verified) {
                myOffer.status = "floating";
                user.offer = myOffer._id;
                await myOffer.save();
                userChecks.floatCount += 1;
            }
            await userChecks.save();
            user.whatsappNumber = whatsappNumber;
            await user.save();
            const outlet = await Outlet.findById(outletId);
            outlet.couponsLeft -= 1;
            if (outlet.couponsLeft < 0) {
                outlet.couponsLeft = 0;
            }
            await outlet.save();
            res.status(200).json({ offer: myOffer });
        } else {
            const myOffer = await Offer.findById(userChecks.offerId)
                .populate([
                    "orderDetails.forMe.item",
                    "orderDetails.forYou.item",
                    "outlet",
                ])
                .exec();
            res.status(200).json({ offer: myOffer });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getOfferNotification = async (req, res) => {
    const userId = req.user.id;
    try {
        const notifications = await OfferNotification.find({
            userId,
            status: "Pending",
        })
            .select("-__v -createdAt -updatedAt")
            .lean();

        const response = await Promise.all(
            notifications.map(async (notification) => {
                const ele = await Room.findById(notification.room)
                    .select("-__v -createdAt -updatedAt")
                    .populate({
                        path: "offer",
                        select: "-createdAt -updatedAt",
                        populate: [
                            { path: "owner", model: "User" },
                            { path: "guest", model: "User" },
                            { path: "outlet", model: "Outlet" },
                            {
                                path: "orderDetails.forMe.item",
                                model: "OutletMenu",
                            },
                            {
                                path: "orderDetails.forYou.item",
                                model: "OutletMenu",
                            },
                        ],
                    })
                    .populate({
                        path: "firstUser.coupon",
                        model: "Coupon",
                        select: "-createdAt -updatedAt",
                        populate: [
                            { path: "offer", model: "Offer" },
                            { path: "item", model: "OutletMenu" },
                            { path: "outlet", model: "Outlet" },
                            { path: "owner", model: "User" },
                            { path: "meetingWith", model: "User" },
                        ],
                    })
                    .populate({
                        path: "secondUser.coupon",
                        model: "Coupon",
                        select: "-createdAt -updatedAt",
                        populate: [
                            { path: "offer", model: "Offer" },
                            { path: "item", model: "OutletMenu" },
                            { path: "outlet", model: "Outlet" },
                            { path: "owner", model: "User" },
                            { path: "meetingWith", model: "User" },
                        ],
                    })
                    .sort({ updatedAt: -1 })
                    .lean();

                const room = {
                    _id: ele._id,
                    firstUser: {
                        userId: ele.firstUser.userId,
                        name: ele.firstUser.name,
                        image: ele.firstUser.image,
                        coupon: ele.firstUser.coupon?._id || null,
                    },
                    secondUser: {
                        userId: ele.secondUser.userId,
                        name: ele.secondUser.name,
                        image: ele.secondUser.image,
                        coupon: ele.secondUser.coupon?._id || null,
                    },
                    lastMessage: ele.lastMessage,
                    offerStatus: ele.offerStatus || null,
                };

                if (ele.offer) {
                    room.offer = {
                        _id: ele.offer?._id || null,
                        outletName: ele.offer?.outlet?.name || null,
                        address: ele.offer?.address || "-",
                        orderDetails: {
                            forMe: {
                                item: {
                                    name:
                                        ele.offer?.orderDetails?.forMe?.item
                                            ?.name || null,
                                },
                            },
                            forYou: {
                                item: {
                                    name:
                                        ele.offer?.orderDetails?.forYou?.item
                                            ?.name || null,
                                },
                            },
                        },
                        owner: ele.offer?.owner?._id || null,
                        time: ele.offer?.time || null,
                    };
                }

                notification.room = room;
                return notification;
            })
        );

        res.status(200).json({ notifications: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const superOffer = async (req, res) => {
    const userId = req.user.id;
    const {
        selectedUserId,
        date,
        time,
        offering,
        purpose,
        outletId,
        orderDetails,
        // {
        // 	forMe: {
        // 		item: { type: mongoose.Types.ObjectId, ref: 'OutletMenu' },
        // 	},
        // 	forYou: {
        // 		item: { type: mongoose.Types.ObjectId, ref: 'OutletMenu' },
        // 	},
        // }
    } = req.body;
    const authHeader = req.headers.authorization;
    try {
        const user = await User.findById(userId);
        const selectedUser = await User.findById(selectedUserId);
        const userSwipe = await Swipe.findOne({ uid: userId });
        const selectedUserSwipe = await Swipe.findOne({ uid: selectedUserId });
        if (user.subscription) {
            userSwipe.match.push(selectedUserId);
            selectedUserSwipe.match.push(userId);

            //let room= await Room.findOne({"firstUser.userId":userId,"secondUser.userId":selectedUserId});

            let room = await Room.findOne({
                $and: [
                    {
                        $or: [
                            { "firstUser.userId": userId },
                            { "firstUser.userId": selectedUserId },
                        ],
                    },
                    {
                        $or: [
                            { "secondUser.userId": userId },
                            { "secondUser.userId": selectedUserId },
                        ],
                    },
                ],
            });

            if(!room){
                room = await Room.create({
                    firstUser: {
                        userId: userId,
                        name: user.name,
                        image: user.image[0],
                    },
                    secondUser: {
                        userId: selectedUserId,
                        name: selectedUser.name,
                        image: selectedUser.image[0],
                    },
                });
            } 
            
            if(room){
                room.superOffer =true
                await room.save()
            }

            // Define the API endpoint URL
            const apiUrl = `${process.env.OFFER_SERVICE}/api/v1/umla/offer/create`;

            // Define the body parameters
            const requestBody = {
                date,
                time,
                offering,
                purpose,
                outletId,
                orderDetails,
                type: "scheduled",
                guestId: selectedUserId,
                check: true,
                // Add other parameters as needed
            };

            // Make the Axios POST request
                let resData=await axios.post(apiUrl, requestBody, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authHeader, // Include the authorization token in the header
            },
            });
            console.log("resData......",resData.data.offer);
            let payApiId=resData.data.offer._id  ;

            let offer=resData.data.offer

            // Update the user data and save
            await user.save();

            // Update the selected user data and save
            await selectedUser.save();

            // Update the user swipe data and save
            await userSwipe.save();

            // Update the selected user swipe data and save
            await selectedUserSwipe.save();
            const updatedRoom = await Room.findById(room._id);

            // let payApiUrl=`${process.env.OFFER_SERVICE}/api/v1/umla/payment/payApi`
            // let payApiBody={"offerId":payApiId}
            // let payApiRes= await axios.post(payApiUrl,payApiBody,{
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: authHeader, // Include the authorization token in the header
            // },
            // })

            //let responce=payApiRes.data;
            // console.log("....responce....",responce)
            return res.status(200).json({offer});
        }
        res.status(200).json({
            success: false,
            message: "need umla plus",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


const superOfferWithFloatingOffer = async (req, res) => {
    const userId = req.user.id;
    const {
        selectedUserId,
        
    } = req.body;
    const authHeader = req.headers.authorization;
    try {
        const user = await User.findById(userId);
        const selectedUser = await User.findById(selectedUserId);
        const userSwipe = await Swipe.findOne({ uid: userId });
        const selectedUserSwipe = await Swipe.findOne({ uid: selectedUserId });
        if (user.subscription) {
            userSwipe.match.push(selectedUserId);
            selectedUserSwipe.match.push(userId);

            let room = await Room.findOne({
                $and: [
                    {
                        $or: [
                            { "firstUser.userId": userId },
                            { "firstUser.userId": selectedUserId },
                        ],
                    },
                    {
                        $or: [
                            { "secondUser.userId": userId },
                            { "secondUser.userId": selectedUserId },
                        ],
                    },
                ],
            });

            if(!room){
                room = await Room.create({
                    firstUser: {
                        userId: userId,
                        name: user.name,
                        image: user.image[0],
                    },
                    secondUser: {
                        userId: selectedUserId,
                        name: selectedUser.name,
                        image: selectedUser.image[0],
                    },
                });
            } 
            
            if(room){
                room.superOffer =true
                
            }


            let userFloatingOffer= await Offer.findOne({owner:userId,status:"floating"});

            console.log("user's floating offer...",userFloatingOffer._id)
            //userFloatingOffer.offerType="scheduled";
            //userFloatingOffer.status="shared";
            userFloatingOffer.guest=selectedUserId;

            await userFloatingOffer.save();
            
            //updating room data 
            room.offer=userFloatingOffer._id;
            room.offerStatus="pending"

            
            await room.save();


            // user should hide for 1 hour;

            let currentTime= new Date();
            let timeAfterOneHour= new Date(currentTime.getTime() + 60*60*1000 );

            if(user.hideTime.shouldHide==false){
                user.hideTime.shouldHide=true
                user.hideTime.timeTillHide=timeAfterOneHour
            }else if(user.hideTime.shouldHide==false){
                if(user.hideTime.timeTillHide<timeAfterOneHour){
                    user.hideTime.timeTillHide=timeAfterOneHour
                }
            }

            // Update the user data and save
            await user.save();

            // Update the selected user data and save
            await selectedUser.save();

            // Update the user swipe data and save
            await userSwipe.save();

            // Update the selected user swipe data and save
            await selectedUserSwipe.save();
            const updatedRoom = await Room.findById(room._id);

            return res.status(200).json({success:true,room:updatedRoom._id});
        }
        res.status(200).json({
            success: false,
            message: "need umla plus",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const createGroup=async(req,res)=>{
    const userId=req.user.id;
    const {
        purpose,
        category,
        date,
        time,
        meetingType, //flaxible, fix
        groupSize //optional
    }= req.body;

    try {

        // todo
            //- check owner slot is available or not

        let checkUserSlot= await slotBooking(date,time,userId);
        
        if(checkUserSlot.shouldBook==false ){
            res.status(400).json({message:`${checkUserSlot.message}`});
            return;
        }

        const currentDateIndia = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
        const currentTime=  new Date(currentDateIndia);    

        let allReadyHaveGroup= await GroupMeet.findOne({dateTime:{$gte:currentTime}});

        if(allReadyHaveGroup){
            res.status(400).json({message:`You already have a scheduled group meeting.`});
            return;
        }

        // Update user slot
        await UserSlot.findByIdAndUpdate(
            { _id: checkUserSlot.slotId },
            {
                $set: {
                    [`slot.${checkUserSlot.selectedSlot}.isBooked`]: true,
                    [`slot.${checkUserSlot.selectedSlot}.timing`]: checkUserSlot.slotTime,
                },
            }
        );  



        let sizeOfGroup

        if(meetingType=="fixed"){
            sizeOfGroup=10
        }else if(meetingType=="flexible"){
            sizeOfGroup=groupSize
        }

        let dateTime= new Date(date + " " + time + " GMT+0000")

        const groupMeet= await GroupMeet.create({
            owner:userId,
            purpose,
            category,
            meetingType,
            groupSize:sizeOfGroup,
            dateTime
        })

        return res.status(200).json({success:true,group:groupMeet._id});    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

}

const createGroupOffer=async(req,res)=>{

    const {
        groupId,
        offering,
        outletId,
        orderDetails,
        // {
        //     item:{type: mongoose.Types.ObjectId, ref: 'OutletMenu'} .
        //     quantity:Number;
        // }
        // orderItem,
        // orderItemQuantity

    }=req.body;

    const userId=req.user.id;

    try {

        let group= await GroupMeet.findOne({_id:groupId});

        let dateTime= group.dateTime;
        //let owner= group.owner;
        let meetingType= group.meetingType;
        let purpose= group.purpose
        // Create a string in the desired format
        let output = dateTime
        .toUTCString()
        .replace("GMT", "GMT+0000 (Coordinated Universal Time)");

        console.log(".....output",output);
        let str = output;

        // Remove the comma
        let newStr = str.replace(",", "");

        console.log(newStr);
        function swapDateMonth(dateString) {
            // Split the string by space
            var dateParts = dateString.split(" ");

            // Swap the position of the month and date
            var temp = dateParts[1];
            dateParts[1] = dateParts[2];
            dateParts[2] = temp;

            // Join the parts back together with spaces
            var newDateString = dateParts.join(" ");
            return newDateString;
        }

        // Convert date from d/m/y to MM/DD/YYYY format
        const parts = date1.match(/(\w{3}) (\d{1,2}), (\d{4})/);
        if (parts) {

            let [, month, day, year] = parts;
            if (year.length === 2) {
               year = "20" + year;
            }
            const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1; // Convert month to a number
            date1 = `${monthNumber.toString().padStart(2, "0")}/${day.padStart(
                2,
                "0"
            )}/${year}`;
            console.log(date1);
        } else {
            console.log("Invalid date format");
        }

        let dateTime1 = swapDateMonth(newStr);

        console.log("..dateTime1",dateTime1);
        console.log("..")


        //const items = [];

        const item = await OutletMenu.findById(
            orderDetails.item
        ).select("price");
        //items.push(item.price);
        const itemPrice= item.price
       
       let total = itemPrice*orderDetails.quantity
       //items.reduce((sum, item) => sum + item, 0);
       total = parseFloat(total.toFixed(2));
       const user = await User.findById(userId);
       const check = user.subscription;
       let tax = total * 0.05;
       const platformCharge = check ? 0.0 : 5.0;
       //-------------change here later
       tax = 0;
       //------------
       // const platformTax = check ? 0.0 : 0.9;
       // tax = tax + platformTax;
       const billTotal = total + tax + platformCharge;
       const bill = {
           itemTotal: total.toFixed(2),
           tax: tax.toFixed(2),
           platformCharge: platformCharge.toFixed(2),
           total: billTotal.toFixed(2),
       };

       const bodyData = {
           owner: userId,
           time: dateTime1,
           offering: offering,
           purpose: purpose,
           status: "paymentPending",
           outlet: outletId,
           orderDetails: orderDetails,
           bill: bill,
           meetingType
           //offerType: type, group meet
       };

       const offer = await GroupMeetOffer.create(bodyData);

       const user1= await User.find({_id:userId});
       user1.groupOffer=offer._id
       await user1.save()
       const myOffer = await GroupMeetOffer.findById(offer._id)
           .populate([
               "orderDetails.item",
               "outlet",
           ])
           .exec();

        // creating room for group

        const groupRoom= await GroupMeetRoom.create({
            owner:{
                userId:userId,
                name:user.name,
                image:user.image[0],
            },
            offer:myOffer,
            offerStatus:"pending"
        })

    //    if (guestId) {
    //        await handleOfferCreationInChatRoom(offer._id, check);
    //    }

    //   await OfferResponse.create({ offerId: offer._id });
       res.status(200).json({ offer: myOffer ,groupRoom});

        
    } catch (error) {

        console.log(error);
        res.status(500).json({ message: error.message });
        
        // will check on that  time slot is available or not.
        // show guest only who is available on that time slot.

    }

}

module.exports = {
    getAllOutlet,
    getMenu,
    createOffer,
    floatOffer,
    useOffer,
    getOfferDetails,
    getOfferResponse,
    handleOfferResponse,
    activeDeals,
    myOffers,
    getEarlyBirdOutlet,
    getEarlyBirdOutletItem,
    confirmOffer,
    takeActionAgainstOffer,
    sendAlert,
    acceptRejectOffer,
    sendData,
    confirmFreeDeal,
    getOfferNotification,
    superOffer,
    superOfferWithFloatingOffer,
    createGroup,
    createGroupOffer
};
