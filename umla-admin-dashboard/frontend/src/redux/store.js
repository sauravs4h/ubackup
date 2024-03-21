import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { approveVerificationReducer, blockUserReducer, coffeeGivenReducer, denyUserVerificationReducer, getUsersDataReducer, getUsersReducer, loginRequestReducer, secondOfferReducer, verifyProfileReducer } from "./reducers/adminReducers";
import { getAllUsersReducer, getBookingsReducer, getOutletCityReducer, getOutletsReducer, getUnVerifiedUsersReducer, getUserDataMeetupReducer, getUserDealsReducer, getUserMatchesReducer, getUserMeetupsReducer, getUserProfileReducer, getUserPurchasesReducer, getUserTrafficReducer, getVerifiedUsersReducer, getWeeklyBookingsReducer } from "./reducers/userReducers";
import { addUserQueryReplyReducer, getCreditAmountReducer, getDashboardAlertsReducer, getDashboardNewMatchReducer, getDashboardNewReportsReducer, getDashboardNewUsersReducer, getDashboardOfferingItemsReducer, getDashboardRevenueReducer, getDashboardTrafficReducer, getDashboardUpperFiguresReducer, getDebitAmountReducer, getFloatingOffersReducer, getMatchedReducer, getMenuItemsReducer, getOfferCreationReducer, getOfferExpiredReducer, getPartnerDetailsReducer, getPartnerMeetupHistoryReducer, getPartnerMenuReducer, getPartnersCityDetailsReducer, getPartnersDataReducer, getPartnersTransactionsReducer, getRefundRequestReducer, getRestaurantsReducer, getUserAlertReducer, getUserFeedbackReducer, getUserOffersReducer, getUserQueryReducer, getUserReportReducer, submitClaimOfferReducer } from "./reducers/partnerReducers";



const adminInfoFromStorage = localStorage.getItem('admin')
	? JSON.parse(localStorage.getItem('admin'))
	: null;

const reducer = combineReducers({
    loginRequest: loginRequestReducer,
    getUsers: getUsersReducer,
    getUsersData: getUsersDataReducer,
    verifyProfile: verifyProfileReducer,
    blockUser: blockUserReducer,
    approveVerification: approveVerificationReducer,
    secondOffer: secondOfferReducer,
    denyUserVerification: denyUserVerificationReducer,
    coffeeGiven: coffeeGivenReducer,
    getAllUsers: getAllUsersReducer,
    getUserProfile: getUserProfileReducer,
    getBookings: getBookingsReducer,
    getOutlets: getOutletsReducer,
    getOutletCity: getOutletCityReducer,
    getWeeklyBookings: getWeeklyBookingsReducer,
    getUserTraffic: getUserTrafficReducer,
    getUserPurchases: getUserPurchasesReducer,
    getPartnerMeetupHistory: getPartnerMeetupHistoryReducer,
    getPartnersData: getPartnersDataReducer,
    getPartnersTransactions: getPartnersTransactionsReducer,
    getPartnerCityDetails: getPartnersCityDetailsReducer,
    getOfferCreation: getOfferCreationReducer,
    getMatched: getMatchedReducer,
    getOfferExpired: getOfferExpiredReducer,
    getCreditAmount: getCreditAmountReducer,
    getDebitAmount: getDebitAmountReducer,
    getUserQuery: getUserQueryReducer,
    getUserMeetups: getUserMeetupsReducer,
    getUserMatches: getUserMatchesReducer,
    getUserDeals: getUserDealsReducer,
    getVerifiedUsers: getVerifiedUsersReducer,
    getUnVerifiedUsers: getUnVerifiedUsersReducer,
    getUserDataMeetup: getUserDataMeetupReducer,
    addUserQueryReply: addUserQueryReplyReducer,
    getRefundRequest: getRefundRequestReducer,
    getRestaurants: getRestaurantsReducer,
    getMenuItems: getMenuItemsReducer,
    submitClaimOffer: submitClaimOfferReducer,
    getPartnerDetails: getPartnerDetailsReducer,
    getPartnerMenu: getPartnerMenuReducer,
    getUserAlert: getUserAlertReducer,
    getUserReport: getUserReportReducer,
    getFloatingOffers: getFloatingOffersReducer,
    getUserOffers:getUserOffersReducer,
    getUserFeedbacks: getUserFeedbackReducer,
    getDashboardUpperFigures: getDashboardUpperFiguresReducer,
    getDashboardNewUsers: getDashboardNewUsersReducer,
    getDashboardNewReports: getDashboardNewReportsReducer,
    getDashboardNewMatch: getDashboardNewMatchReducer,
    getDashboardOfferingItems: getDashboardOfferingItemsReducer,
    getDashboardAlerts: getDashboardAlertsReducer,
    getDashboardRevenue: getDashboardRevenueReducer,
    getDashboardTraffic: getDashboardTrafficReducer,

})

const initialState = {
	loginRequest: { loginInfo: adminInfoFromStorage },
};

const middleware = [thunk]

const store = configureStore({
  reducer,
  middleware,
  preloadedState:{},
})
export default store;