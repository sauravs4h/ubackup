export const getPartnerMeetupHistoryReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_PARTNER_MEETUP_HISTORY_REQUEST":
      return { ...state, loading: true };

    case "GET_PARTNER_MEETUP_HISTORY_SUCCESS":
      return {
        loading: false,
        meetups: action.payload.meetups,
        todaysMeetups: action.payload.todaysMeetups,
        newSechedule: action.payload.newSechedule,
        totalPartner: action.payload.totalPartner,
        newPartner: action.payload.newPartner,
      };

    case "GET_PARTNER_MEETUP_HISTORY_FAILURE":
      return { loading: false, meetups: [], error: action.payload };

    default:
      return state;
  }
};

export const getPartnersDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_PARTNERS_DATA_REQUEST":
      return { ...state, loading: true };

    case "GET_PARTNERS_DATA_SUCCESS":
      return {
        loading: false,
        result: action.payload.result,
      };

    case "GET_result_DATA_FAILURE":
      return { loading: false, partners: [], error: action.payload };

    default:
      return state;
  }
};

export const getPartnersTransactionsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_PARTNERS_TRANSACTIONS_REQUEST":
      return { ...state, loading: true };

    case "GET_PARTNERS_TRANSACTIONS_SUCCESS":
      return {
        loading: false,
        transactions: action.payload.transactions,
      };

    case "GET_PARTNERS_TRANSACTIONS_FAILURE":
      return { loading: false, transactions: [], error: action.payload };

    default:
      return state;
  }
};
export const getPartnersCityDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_PARTNER_CITY_DETAILS_REQUEST":
      return { ...state, loading: true };

    case "GET_PARTNER_CITY_DETAILS_SUCCESS":
      return {
        loading: false,
        cityDetials: action.payload.cityDetials,
        totalBooking: action.payload.totalBooking,
        totalOutlet: action.payload.totalOutlet,
      };

    case "GET_PARTNER_CITY_DETAILS_FAILURE":
      return { loading: false, cityDetials: [], error: action.payload };

    default:
      return state;
  }
};

export const getOfferCreationReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_OFFER_CREATION_REQUEST":
      return { ...state, loading: true };

    case "GET_OFFER_CREATION_SUCCESS":
      return {
        loading: false,
        offerCreation: action.payload.offerCreation,
        offerCreated: action.payload.offerCreated,
        offerMatched: action.payload.offerMatched,
        offerExpire: action.payload.offerExpire,

      };

    case "GET_OFFER_CREATION_FAILURE":
      return { loading: false, offerCreation: [], error: action.payload };

    default:
      return state;
  }
};

export const getMatchedReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_MATCHED_REQUEST":
      return { ...state, loading: true };

    case "GET_MATCHED_SUCCESS":
      return {
        loading: false,
        matched: action.payload.matched,
      };

    case "GET_MATCHED_FAILURE":
      return { loading: false, matched: [], error: action.payload };

    default:
      return state;
  }
};

export const getOfferExpiredReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_OFFER_EXPIRED_REQUEST":
      return { ...state, loading: true };

    case "GET_OFFER_EXPIRED_SUCCESS":
      return {
        loading: false,
        matched: action.payload.matched,
      };

    case "GET_OFFER_EXPIRED_FAILURE":
      return { loading: false, matched: [], error: action.payload };

    default:
      return state;
  }
};

export const getCreditAmountReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_CREDIT_AMOUNT_REQUEST":
      return { ...state, loading: true };

    case "GET_CREDIT_AMOUNT_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
        totalTransaction: action.payload.totalTransaction,
        totalTransactionInRuppee: action.payload.totalTransactionInRuppee,
      };

    case "GET_CREDIT_AMOUNT_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getDebitAmountReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_DEBIT_AMOUNT_REQUEST":
      return { ...state, loading: true };

    case "GET_DEBIT_AMOUNT_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "GET_DEBIT_AMOUNT_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};


export const getUserQueryReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_QUERY_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_QUERY_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "GET_USER_QUERY_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};


export const addUserQueryReplyReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_QUERY_REPLY_REQUEST":
      return { ...state, loading: true };

    case "ADD_QUERY_REPLY_SUCCESS":
      return {
        loading: false,
        reply: action.payload.reply,
      };

    case "ADD_QUERY_REPLY_FAILURE":
      return { loading: false, reply: [], error: action.payload };

    default:
      return state;
  }
};


export const getRefundRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_REFUND_REQUEST":
      return { ...state, loading: true };

    case "GET_REFUND_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
        refundedAmount: action.payload.refundedAmount,
        refundApproved: action.payload.refundApproved,
        refundDeclined: action.payload.refundDeclined,
      };

    case "GET_REFUND_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getRestaurantsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_RESTAURANTS_REQUEST":
      return { ...state, loading: true };

    case "GET_RESTAURANTS_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
        
      };

    case "GET_RESTAURANTS_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getMenuItemsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_MENU_ITEMS_REQUEST":
      return { ...state, loading: true };

    case "GET_MENU_ITEMS_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
        restaurantName: action.payload.restaurantName,
      };

    case "GET_MENU_ITEMS_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const submitClaimOfferReducer = (state = {}, action) => {
  switch (action.type) {
    case "CLAIM_OFFER_SUBMIT_REQUEST":
      return { ...state, loading: true };

    case "CLAIM_OFFER_SUBMIT_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "CLAIM_OFFER_SUBMIT_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getPartnerDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_PARTNER_DETAILS_REQUEST":
      return { ...state, loading: true };

    case "GET_PARTNER_DETAILS_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "GET_PARTNER_DETAILS_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getPartnerMenuReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_PARTNER_MENU_REQUEST":
      return { ...state, loading: true };

    case "GET_PARTNER_MENU_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
        restaurantName: action.payload.restaurantName,
      };

    case "GET_PARTNER_MENU_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getUserAlertReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_ALERT_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_ALERT_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "GET_USER_ALERT_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getUserReportReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_REPORT_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_REPORT_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "GET_USER_REPORT_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getFloatingOffersReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_FLOATING_OFFERS_REQUEST":
      return { ...state, loading: true };

    case "GET_FLOATING_OFFERS_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "GET_FLOATING_OFFERS_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getUserOffersReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_OFFERS_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_OFFERS_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "GET_USER_OFFERS_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getUserFeedbackReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_FEEDBACK_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_FEEDBACK_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "GET_USER_FEEDBACK_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getDashboardUpperFiguresReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_DASHBOARD_UPPER_FIGURES_REQUEST":
      return { ...state, loading: true };

    case "GET_DASHBOARD_UPPER_FIGURES_SUCCESS":
      return {
        loading: false,
        totalUsers: action.payload.totalUsers,
        currentActiveUsers: action.payload.currentActiveUsers,
        currentOfferSent: action.payload.currentOfferSent,
        todaySwipes: action.payload.todaySwipes,
        downloadCount: action.payload.downloadCount,
        TotalMeetupCreated: action.payload.TotalMeetupCreated,
        cafePartners: action.payload.cafePartners,
        totalQueries: action.payload.totalQueries,
        todayRevenue: action.payload.todayRevenue,
        usersCount: action.payload.usersCount,
        paidUsersCount: action.payload.paidUsersCount,
        unPaidUsersCount: action.payload.unPaidUsersCount,
      };

    case "GET_DASHBOARD_UPPER_FIGURES_FAILURE":
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};


export const getDashboardNewUsersReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_DASHBOARD_NEW_USERS_REQUEST":
      return { ...state, loading: true };

    case "GET_DASHBOARD_NEW_USERS_SUCCESS":
      return {
        loading: false,
        newUserResponce: action.payload.newUserResponce,
      };

    case "GET_DASHBOARD_NEW_USERS_FAILURE":
      return { loading: false, newUserResponce: [], error: action.payload };

    default:
      return state;
  }
};

export const getDashboardNewReportsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_DASHBOARD_NEW_REPORTS_REQUEST":
      return { ...state, loading: true };

    case "GET_DASHBOARD_NEW_REPORTS_SUCCESS":
      return {
        loading: false,
        newReportResponce: action.payload.newReportResponce,
      };

    case "GET_DASHBOARD_NEW_REPORTS_FAILURE":
      return { loading: false, newReportResponce: [], error: action.payload };

    default:
      return state;
  }
};

export const getDashboardNewMatchReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_DASHBOARD_NEW_MATCH_REQUEST":
      return { ...state, loading: true };

    case "GET_DASHBOARD_NEW_MATCH_SUCCESS":
      return {
        loading: false,
        newMatchResponce: action.payload.newMatchResponce,
      };

    case "GET_DASHBOARD_NEW_MATCH_FAILURE":
      return { loading: false, newMatchResponce: [], error: action.payload };

    default:
      return state;
  }
};

export const getDashboardOfferingItemsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_DASHBOARD_OFFERING_ITEMS_REQUEST":
      return { ...state, loading: true };

    case "GET_DASHBOARD_OFFERING_ITEMS_SUCCESS":
      return {
        loading: false,
        firstOfferingItem: action.payload.firstOfferingItem,
        secondOfferingItem: action.payload.secondOfferingItem,
        thirdOfferingItem: action.payload.thirdOfferingItem,


      };

    case "GET_DASHBOARD_OFFERING_ITEMS_FAILURE":
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const getDashboardAlertsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_DASHBOARD_ALERTS_REQUEST":
      return { ...state, loading: true };

    case "GET_DASHBOARD_ALERTS_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "GET_DASHBOARD_ALERTS_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getDashboardRevenueReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_DASHBOARD_REVENUE_REQUEST":
      return { ...state, loading: true };

    case "GET_DASHBOARD_REVENUE_SUCCESS":
      return {
        loading: false,
        revenueAmount: action.payload.revenueAmount,
        transitionResponce: action.payload.transitionResponce,

      };

    case "GET_DASHBOARD_REVENUE_FAILURE":
      return { loading: false, transitionResponce: [], error: action.payload };

    default:
      return state;
  }
};

export const getDashboardTrafficReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_DASHBOARD_TRAFFIC_REQUEST":
      return { ...state, loading: true };

    case "GET_DASHBOARD_TRAFFIC_SUCCESS":
      return {
        loading: false,
        userTraffic: action.payload.userTraffic,
      };

    case "GET_DASHBOARD_TRAFFIC_FAILURE":
      return { loading: false, userTraffic: [], error: action.payload };

    default:
      return state;
  }
};