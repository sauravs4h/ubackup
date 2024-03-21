const express = require("express");
const {
    login,
    register,
    logout,
    registerAdmin,
    updateSubscription,
    addSubscription,
    getAllSubscriptions,
    createPrompt,
    createOnboardRequest,
    getOnboardRequests,
    handleOnboardRequest,
    approveStatusForCoupon,
    getEarlyBirdUserData,
    getEarlyBirdUsers,
    getUsers,
    secondOffer,
    verifyProfile,
    denyUserVerification,
    getCoffeeClaimed,
    getAllUsers,
    getUser,
    bookingHistory,
    getOutlets,
    weeklyReservation,
    userTraffic,
    getCafeCity,
    purchase,
    getUserCity,
    userProfiles,
    meetupshistory,
    cityDetails,
    partnerData,
    offerCreation,
    matched,
    offerExpired,
    creditAmount,
    //addUserQuery,
    userQuery,
    addResolutionquery,
    userMatches,
    userMeetups,
    userDeals,
    usersDataMeetups,
    verifiedUsers,
    unVerifiedUsers,
    refundRequest,
    selectRestaurants,
    menuItems,
    claimOfferSubmit,
    blockUser,
    partnerDataById,
    partnerMenuItems,
    userAlert,
    userReport,
    forUpperBoxs,
    homeNewUser,
    homeNewReport,
    homeNewMatch,
    homeMostOfferingItem,
    homeAlertRaised,
    homeRevenue,
    homeTraffic,
    changeAdminPassword

} = require("../../controllers/index.controllers");
const {
    authorizeRequest,
} = require("../../middleware/auth/authorizeRequest.middleware");
const multer = require("multer");
const { sendPushNotification } = require("../../utils/notification.utils");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
});
// login/register
router.route("/login").post(login);
router.route("/register").post(register);

// register partner admin
router.route("/registerPartner").post(authorizeRequest, registerAdmin);

// change admin password
router.route("/changeAdminPassword").post(changeAdminPassword);

// subscription
router.route("/subscriptions").get(authorizeRequest, getAllSubscriptions);
router.route("/addSubscription").post(authorizeRequest, addSubscription);
router
    .route("/update/subscription/:subscriptionId/:name/:validity/:price")
    .put(authorizeRequest, updateSubscription);
router.route("/createPrompt").post(authorizeRequest, createPrompt);
router
    .route("/createOnboardRequest")
    .post(upload.array("images", 10), createOnboardRequest);

//router.use(authorizeRequest);

router.route("/getOnboardRequests").get(getOnboardRequests);
router.route("/handleOnboardRequest").put(handleOnboardRequest);
router.get("/getUsers", getUsers);
router.get("/getEarlyBirdUsers", getEarlyBirdUsers);
router.get("/getUserData/:userId", getEarlyBirdUserData);
router.post("/approveVerificationForCoupon", approveStatusForCoupon);
router.post("/secondOffer", secondOffer);
router.post("/verifyProfile", verifyProfile);
router.put("/denyUserVerification", denyUserVerification);
router.get("/getCoffeeClaimed", getCoffeeClaimed);
router.get("/getAllUser", getAllUsers);
router.get("/getUser", getUser);
router.get("/getBookings", bookingHistory);
router.get("/filter/outlets", getOutlets);
router.get("/filter/outlets/city", getCafeCity);
router.get("/filter/user/city", getUserCity);
router.get("/weeklyBooking", weeklyReservation);
router.get("/userTraffic", userTraffic);
router.get("/userData/purchase", purchase);
router.get("/userProfile", userProfiles);
router.get("/partner/meetupHistory",meetupshistory);
router.get("/partner/cityDetails",cityDetails);
router.get("/partner/partnerData",partnerData);
router.get("/partner/partnerDataById",partnerDataById);
router.get("/partner/partnerMenuItems",partnerMenuItems);
router.get("/partner/offerCreation",offerCreation);
router.get("/partner/matched",matched);
router.get("/partner/offerExpired",offerExpired);
router.get("/partner/creditAmount",creditAmount);
//router.post("/partner/adduserquery",addUserQuery);
router.get("/partner/userQuery",userQuery);
router.patch("/partner/addResolutionquery",addResolutionquery);
router.get("/partner/userMatches",userMatches);
router.get("/partner/userMeetups",userMeetups);
router.get("/partner/userDeals",userDeals);
router.get("/partner/usersDataMeetups",usersDataMeetups);
router.get("/partner/verifiedUsers",verifiedUsers);
router.get("/partner/unVerifiedUsers",unVerifiedUsers);
router.get("/partner/refundRequest",refundRequest);
router.get("/partner/selectRestaurants",selectRestaurants);
router.get("/partner/menuItems",menuItems);
router.patch("/partner/claimOfferSubmit",claimOfferSubmit);
router.patch("/partner/blockUser",blockUser);
router.get("/partner/userAlert",userAlert);
router.get("/partner/userReport",userReport);
router.get("/partner/forUpperBoxs",forUpperBoxs)
router.get("/partner/homeNewUser",homeNewUser);
router.get("/partner/homeNewReport",homeNewReport);
router.get("/partner/homeNewMatch",homeNewMatch);
router.get("/partner/homeMostOfferingItem",homeMostOfferingItem);
router.get("/partner/homeAlertRaised",homeAlertRaised);
router.get("/partner/homeRevenue",homeRevenue);
router.get("/partner/homeTraffic",homeTraffic);
router.get("/test", async (req, res) => {
    try {
        const response = await sendPushNotification(
            "fK1_Q7nRRceVGS2eUbeD3Q:APA91bEY7IPfmd67nSmYzuuaC7ajMl5XIkCcj5Qweaa1QZJmVjwRMagfqJDC58Q9eFpbSmnc1iJ6zgV93yPrLdZ47EXnROzWj7VLmtIJ3kq6vdMQ7i7HnaHar-kMpsUjIHLIQsVz1pfs",
            "Hello",
            "Hello"
        );
        console.log(response.data);
        res.send("Done");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router;
