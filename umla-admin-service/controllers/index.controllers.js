const { login, register, logout,changeAdminPassword } = require("./admin/auth.controllers");
const { registerAdmin } = require("./admin/partner.controllers");
const { createPrompt } = require("./admin/prompt.controllers");
const {
    updateSubscription,
    addSubscription,
    getAllSubscriptions,
} = require("./admin/subscription.controllers");
const {
    createOnboardRequest,
    getOnboardRequests,
    handleOnboardRequest,
} = require("./admin/onboard.controllers");
const {
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
   // addUserQuery,
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
    homeTraffic
} = require("./admin/user.controller");
module.exports = {
    login,
    register,
    logout,
    registerAdmin,
    changeAdminPassword,
    updateSubscription,
    addSubscription,
    createPrompt,
    getAllSubscriptions,
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
    homeTraffic
};