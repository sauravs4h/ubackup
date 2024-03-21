const express = require("express");
const cron = require("node-cron");
const axios = require("axios");
const {
  User,
  UserSubscription,
  SubscriptionChecks,
  Arrival,
  Offer,
  Coupon,
  UserCheck,
  UserSlot,
  Swipe,
  GroupMeet,
} = require("./models/index.models");
const connectDB = require("./utils/db/connectdb.utils");
require("dotenv").config();
const app = express();

const data = { page: 0 };
// let task = cron.schedule('*/10 * * * * *', async () => {
let task = cron.schedule("*/2 * * * *", async () => {
  try {
    const response = await axios.post(
      `${process.env.SWIPE_SERVICE}/api/v1/umla/swipe/cron`,
      {
        page: data.page,
      }
    );
    data.page = response.data.count < 100 ? 0 : data.page + 1;

    console.log("---------- Swipe Reset ---------");
    console.log(response.data.count);
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    console.log("---------- ----------- ---------");
  } catch (err) {
    console.log("---------- Swipe Reset ---------");
    console.log(err);
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    console.log("---------- error T_T ---------");
  }
});
task.start();
let count = 0;
let task2 = cron.schedule("*/1 * * * *", async () => {
  try {
    // Find all users with subscription: true
    const users = await User.find({ subscription: true })
      .sort({ createdAt: 1 })
      .skip(count * 20)
      .limit(20);
    if (users.length < 20) {
      count = 0;
    } else {
      count = count + 1;
    }
    //
    // Get an array of user IDs
    const userIds = users.map((user) => user._id);

    // Find all subscriptions for these users with name 'Referral Bonus'
    const subscriptions = await UserSubscription.find({
      userId: { $in: userIds },
      name: "Referral Bonus",
    });

    // Get current date
    let currentDate = new Date();

    // Filter out subscriptions that have expired
    const expiredSubscriptions = subscriptions.filter(
      (subscription) => subscription.validity.till <= currentDate
    );

    // Get an array of user IDs with expired subscriptions
    const expiredUserIds = expiredSubscriptions.map(
      (subscription) => subscription.userId
    );

    // Update all users with expired subscriptions
    await User.updateMany(
      { _id: { $in: expiredUserIds } },
      { $set: { subscription: false } }
    );

    console.log("---------- Subscription Reset ---------");
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    console.log("---------- ----------- ---------");
  } catch (err) {
    console.log("---------- Subscription Reset ---------");
    console.log(err);
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    console.log("---------- error T_T ---------");
  }
});
task2.start();

let task3 = cron.schedule("0 0 * * *", async () => {
  // let task3 = cron.schedule('*/5 * * * *', async () => {
  try {
    console.log("---------- SubscriptionChecks Reset ---------");
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    await SubscriptionChecks.updateMany(
      {},
      { profileLimit: false, profileCount: 0 }
    );
    console.log("---------- ----------- ---------");
  } catch (err) {
    console.log("---------- SubscriptionChecks Reset ---------");
    console.log(err);
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    console.log("---------- error T_T ---------");
  }
});
task3.start();

let task4 = cron.schedule("*/1 * * * *", async () => {
  // let task3 = cron.schedule('*/5 * * * *', async () => {
  try {
    console.log("---------- arrival check ---------");
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const newDate = new Date();
    // add 5hr and 45 minutes to it
    // Get current hours and minutes
    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();

    // Add 5 hours and 45 minutes
    newDate.setHours(hours + 5);
    newDate.setMinutes(minutes + 15);
    console.log(newDate);

    await Arrival.updateMany(
      { status: "upcoming", time: { $lte: newDate } },
      { status: "expired" }
    );
    console.log("---------- ----------- ---------");
  } catch (err) {
    console.log("----------  arrival check ---------");
    console.log(err);
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    console.log("---------- error T_T ---------");
  }
});
task4.start();

let task5 = cron.schedule("*/1 * * * *", async () => {
  // let task3 = cron.schedule('*/5 * * * *', async () => {
  try {
    console.log("---------- offer check ---------");
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const newDate = new Date();
    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();

    newDate.setHours(hours + 5);
    newDate.setMinutes(minutes + 1);
    console.log(newDate);

    const offers1 = await Offer.find({
      status: { $in: ["active", "shared"] },
      timeDate: { $lte: newDate },
    });
    const offerId = offers1.map((ele) => {
      return ele._id;
    });
    await Offer.updateMany(
      {
        status: { $in: ["shared", "paymentPending"] },
        timeDate: { $lte: newDate },
      },
      { status: "expired" }
    );
    await Coupon.updateMany(
      {
        offer: { $in: offerId },
        status: { $nin: ["consumed"] },
      },
      { status: "expired" }
    );

    await Coupon.updateMany(
      {
        status: { $in: ["active"] },
        timeDate: { $lte: newDate },
      },
      {
        status: "expired",
      }
    );
    // First, get the offers that match your criteria
    const offers = await Offer.find({
      status: { $in: ["floating"] },
      timeDate: { $lte: newDate },
    });

    // Then, update those offers

    // Now, you can map over the offers and find the user for each one
    await Promise.all(
      offers.map((offer) => {
        return User.findByIdAndUpdate(offer.owner, { offer: null });
      })
    );
    await Offer.updateMany(
      {
        status: { $in: ["floating"] },
        timeDate: { $lte: newDate },
      },
      { status: "archived" }
    );
    const offerList = await UserCheck.find({
      floatCount: { $gte: 2 },
    }).select("offerId");
    const offerListId = offerList.map((ele) => {
      return ele.offerId;
    });
    if (offerListId.length > 0) {
      await Offer.updateMany(
        {
          status: { $in: ["archived"] },
          _id: { $in: offerListId },
        },
        { status: "expired" }
      );
    }

    const users = await User.find({ completed: true }).select("image");
    const userId = users.map((user) => {
      if (user.image.length < 1) {
        return user._id;
      }
    });
    await User.updateMany(
      { _id: { $in: userId } },
      { $set: { completed: false } }
    );
    //!expire offer who have usercheck =2 and is archived
    console.log("---------- ----------- ---------");
  } catch (err) {
    console.log("----------  offer check ---------");
    console.log(err);
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    console.log("---------- error T_T ---------");
  }
});
task5.start();

let task6 = cron.schedule("*/1 * * * *", async () => {
  // let task6 = cron.schedule('*/5 * * * *', async () => {
  try {
    console.log("---------- Offer Reset ---------");
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const usersWithOffers = await User.find({
      offer: { $exists: true, $ne: null },
    }).select("offer");
    const userOfferIdArray = usersWithOffers.map((user) => user.offer);
    await Offer.updateMany(
      {
        _id: { $nin: userOfferIdArray },
        status: "floating",
      },
      { status: "archived" }
    );

    console.log("---------- ----------- ---------");
  } catch (err) {
    console.log("---------- Offer Reset ---------");
    console.log(err);
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    console.log("---------- error T_T ---------");
  }
});
task6.start();

let x = 0;

let task7 = cron.schedule("*/30 * * * * *", async () => {
  // let task6 = cron.schedule('*/5 * * * *', async () => {
  try {
    console.log("---------- User update Reset ---------");
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    let userrr = await User.find()
      .limit(10)
      .skip(x * 10);

    userrr.forEach(async (user) => {
      // make your changes to the user document here
      user.notification = true;
      await user.save(); // this will trigger the pre save middleware
    });

    if (userrr.length < 10) {
      x = 0;
      task7.stop();
    } else {
      x++;
    }

    console.log("---------- ----------- ---------");
  } catch (err) {
    console.log("---------- User update Reset ---------");
    console.log(err);
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    console.log("---------- error T_T ---------");
  }
});
task7.start();

// let task8= cron.schedule("0 23 */2 * *", async ()=>{

//   try {
//     console.log("---------- making userSlot documents ---------");
//       // get all users

//       let x=0;

//       while(1){

//         const users= await User.find()
//                     .limit(10)
//                     .skip(x * 10);

//         // Calculate dates for the next two days
//         const currentDate = new Date();
//         const nextDate = new Date(currentDate);
//         nextDate.setDate(currentDate.getDate() + 1);
//         const dayAfterNextDate = new Date(nextDate);
//         dayAfterNextDate.setDate(nextDate.getDate() + 1);

//         users.forEach(async(user)=>{
//             await UserSlot.create({
//               userId: user._id,
//               date: new Date(nextDate),
//             })
//         })

//         users.forEach(async(user)=>{
//           await UserSlot.create({
//             userId: user._id,
//             date: new Date(dayAfterNextDate),
//           })
//         })

//         if(users.length<10){
//           x=0;
//           break;
//         }else{
//           x++;
//         }

//       }

      

//   } catch (error) {

//     console.log("---------- making userSlot documents ---------");
//     console.log(err);
//     console.log(
//       new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//     );
//     console.log("---------- error T_T ---------");
//   }
// })
// task8.start();

let task9 = cron.schedule("0 23 * * *", async () => {
  try {
    console.log("---------- making userSlot documents ---------");
    // get all users

    let x=0;

    while(1){

      const users = await User.find()
                    .limit(x)
                    .skip(x*10)

      // Calculate dates for the next two days
      const currentDate = new Date();
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      const dayAfterNextDate = new Date(nextDate);
      dayAfterNextDate.setDate(nextDate.getDate() + 1);

      // users.forEach(async(user)=>{
      //     await UserSlot.create({
      //       userId: user._id,
      //       date: new Date(nextDate),
      //     })
      // })

      users.forEach(async (user) => {
        await UserSlot.create({
          userId: user._id,
          date: new Date(dayAfterNextDate),
        });
      });

      if(users.length<10){
        x=0;
        break;
      }else{
        x++;
      }

    }

    
  } catch (error) {
    console.log("---------- making userSlot documents ---------");
    console.log(err);
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    console.log("---------- error T_T ---------");
  }
});
task9.start();

// let task10= cron.schedule("16 06 * * *", async ()=>{

//   try {
//     console.log("---------- making userSlot documents ---------");
//       // get all users

//       let x=0;

//       while(1){

//         const users= await User.find()
                        // .limit(x)
                        // .skip(x*10)

//         // Calculate dates for the next two days
//         const currentDate = new Date();
//         const nextDate = new Date(currentDate);
//         nextDate.setDate(currentDate.getDate() + 1);
//         const dayAfterNextDate = new Date(nextDate);
//         dayAfterNextDate.setDate(nextDate.getDate() + 1);

//         users.forEach(async(user)=>{
//             await UserSlot.create({
//               userId: user._id,
//               date: new Date(currentDate),
//             })
//         })

//         //   users.forEach(async(user)=>{
//         //     await UserSlot.create({
//         //       userId: user._id,
//         //       date: new Date(dayAfterNextDate),
//         //     })
//         // })

//         if(users.length<10){
//           x=0
//           break;
//         }else{
//           x++;
//         }

//       }

      

//   } catch (error) {

//     console.log("---------- making userSlot documents ---------");
//     console.log(err);
//     console.log(
//       new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//     );
//     console.log("---------- error T_T ---------");
//   }
// })
// task10.start();

// to add hideTime in usermodel

// let task11= cron.schedule("25 18 * * *", async ()=>{

//   try {
//     console.log("---------- adding default hideTime to usermodel ---------");
//       // get all users

//       let x=0;

//       while(1){

//         const users= await User.find()
                        // .limit(x)
                        // .skip(x*10)

//         users.map(async(ele)=>{

//           await User.findOneAndUpdate({_id:ele._id},{"hideTime.shouldHide":false})

//         })

//         if(users.length<10){
//           x=0
//           break;
//         }else{
//           x++;
//         }

//       }


//   } catch (error) {

//     console.log("---------- adding default hideTime to usermodel---------");
//     console.log(err);
//     console.log(
//       new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//     );
//     console.log("---------- error T_T ---------");
//   }
// })
// task11.start();

let task12 = cron.schedule("32 18 * * *", async () => {
  try {
    console.log("---------- like count refresh ---------");
    
    let x=0;

    while(1){
      const swipe = await Swipe.find()
                    .limit(x)
                    .skip(x*10)

      swipe.forEach(async (swipe) => {
        await Swipe.findByIdAndUpdate(
          swipe._id,
          { likesRemaining: 4, responsesRemaining: 4 }
        );
      });

      if(swipe.length<10){
        x=0;
        break;
      }else{
        x++;
      }
    }

    
  } catch (error) {
    console.log("---------- like count refresh ---------");
    console.log(err);
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    console.log("---------- error T_T ---------");
  }
});
task12.start();

let task13 = cron.schedule("*/1 * * * *", async () => {

  try {
    console.log("---------- checking group time and change there status ---------");
    
   
    const currentDateIndia = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    const currentTime=  new Date(currentDateIndia);

    const group = await GroupMeet.updateMany({offerStatus:"pending", dateTime:{$lte:currentTime}},{offerStatus:"expired"});

      

  } catch (error) {
    console.log("---------- like count refresh ---------");
    console.log(err);
    console.log(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    console.log("---------- error T_T ---------");
  }
})
  
task13.start();

const PORT = process.env.CRON_SERVICE_PORT || 3004;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => console.log(`cron-service on port ${PORT} :)`));
  } catch (error) {
    console.log(":(", error);
  }
};
start();
