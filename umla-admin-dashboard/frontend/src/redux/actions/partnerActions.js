import axios from "axios";
import { url } from "../../constants";
import {
  ADD_QUERY_REPLY_FAILURE,
  ADD_QUERY_REPLY_REQUEST,
  ADD_QUERY_REPLY_SUCCESS,
  CLAIM_OFFER_SUBMIT_FAILURE,
  CLAIM_OFFER_SUBMIT_REQUEST,
  CLAIM_OFFER_SUBMIT_SUCCESS,
  GET_CREDIT_AMOUNT_FAILURE,
  GET_CREDIT_AMOUNT_REQUEST,
  GET_CREDIT_AMOUNT_SUCCESS,
  GET_DASHBOARD_ALERTS_FAILURE,
  GET_DASHBOARD_ALERTS_REQUEST,
  GET_DASHBOARD_ALERTS_SUCCESS,
  GET_DASHBOARD_NEW_MATCH_FAILURE,
  GET_DASHBOARD_NEW_MATCH_REQUEST,
  GET_DASHBOARD_NEW_MATCH_SUCCESS,
  GET_DASHBOARD_NEW_REPORTS_FAILURE,
  GET_DASHBOARD_NEW_REPORTS_REQUEST,
  GET_DASHBOARD_NEW_REPORTS_SUCCESS,
  GET_DASHBOARD_NEW_USERS_FAILURE,
  GET_DASHBOARD_NEW_USERS_REQUEST,
  GET_DASHBOARD_NEW_USERS_SUCCESS,
  GET_DASHBOARD_OFFERING_ITEMS_FAILURE,
  GET_DASHBOARD_OFFERING_ITEMS_REQUEST,
  GET_DASHBOARD_OFFERING_ITEMS_SUCCESS,
  GET_DASHBOARD_REVENUE_FAILURE,
  GET_DASHBOARD_REVENUE_REQUEST,
  GET_DASHBOARD_REVENUE_SUCCESS,
  GET_DASHBOARD_TRAFFIC_FAILURE,
  GET_DASHBOARD_TRAFFIC_REQUEST,
  GET_DASHBOARD_TRAFFIC_SUCCESS,
  GET_DASHBOARD_UPPER_FIGURES_FAILURE,
  GET_DASHBOARD_UPPER_FIGURES_REQUEST,
  GET_DASHBOARD_UPPER_FIGURES_SUCCESS,
  GET_DEBIT_AMOUNT_FAILURE,
  GET_DEBIT_AMOUNT_REQUEST,
  GET_DEBIT_AMOUNT_SUCCESS,
  GET_FLOATING_OFFERS_FAILURE,
  GET_FLOATING_OFFERS_REQUEST,
  GET_FLOATING_OFFERS_SUCCESS,
  GET_MATCHED_FAILURE,
  GET_MATCHED_REQUEST,
  GET_MATCHED_SUCCESS,
  GET_MENU_ITEMS_FAILURE,
  GET_MENU_ITEMS_REQUEST,
  GET_MENU_ITEMS_SUCCESS,
  GET_OFFER_CREATION_FAILURE,
  GET_OFFER_CREATION_REQUEST,
  GET_OFFER_CREATION_SUCCESS,
  GET_OFFER_EXPIRED_FAILURE,
  GET_OFFER_EXPIRED_REQUEST,
  GET_OFFER_EXPIRED_SUCCESS,
  GET_PARTNERS_DATA_FAILURE,
  GET_PARTNERS_DATA_REQUEST,
  GET_PARTNERS_DATA_SUCCESS,
  GET_PARTNERS_TRANSACTIONS_FAILURE,
  GET_PARTNERS_TRANSACTIONS_REQUEST,
  GET_PARTNERS_TRANSACTIONS_SUCCESS,
  GET_PARTNER_CITY_DETAILS_FAILURE,
  GET_PARTNER_CITY_DETAILS_REQUEST,
  GET_PARTNER_CITY_DETAILS_SUCCESS,
  GET_PARTNER_DETAILS_FAILURE,
  GET_PARTNER_DETAILS_REQUEST,
  GET_PARTNER_DETAILS_SUCCESS,
  GET_PARTNER_MEETUP_HISTORY_FAILURE,
  GET_PARTNER_MEETUP_HISTORY_REQUEST,
  GET_PARTNER_MEETUP_HISTORY_SUCCESS,
  GET_PARTNER_MENU_FAILURE,
  GET_PARTNER_MENU_REQUEST,
  GET_PARTNER_MENU_SUCCESS,
  GET_REFUND_FAILURE,
  GET_REFUND_REQUEST,
  GET_REFUND_SUCCESS,
  GET_RESTAURANTS_FAILURE,
  GET_RESTAURANTS_REQUEST,
  GET_RESTAURANTS_SUCCESS,
  GET_USER_ALERT_FAILURE,
  GET_USER_ALERT_REQUEST,
  GET_USER_ALERT_SUCCESS,
  GET_USER_FEEDBACKS_FAILURE,
  GET_USER_FEEDBACKS_REQUEST,
  GET_USER_FEEDBACKS_SUCCESS,
  GET_USER_OFFERS_FAILURE,
  GET_USER_OFFERS_REQUEST,
  GET_USER_OFFERS_SUCCESS,
  GET_USER_QUERY_FAILURE,
  GET_USER_QUERY_REQUEST,
  GET_USER_QUERY_SUCCESS,
  GET_USER_REPORT_FAILURE,
  GET_USER_REPORT_REQUEST,
  GET_USER_REPORT_SUCCESS,
} from "../constants/partnerConstants";

export const getPartnerMeetupHistory =
  (
    page = 1,
    search = "",
    cafeId = "",
    status = "",
    lowerlimit = 0,
    upperlimit = 5000,
    startDate = "",
    endDate = ""
  ) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_PARTNER_MEETUP_HISTORY_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/meetupHistory?page=${page}&search=${search}&cafeId=${cafeId}&status=${status}&lowerlimit=${lowerlimit}&upperlimit=${upperlimit}&startDate=${startDate}&endDate=${endDate}`
      );

      dispatch({
        type: GET_PARTNER_MEETUP_HISTORY_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_PARTNER_MEETUP_HISTORY_FAILURE,
        payload: err.message,
      });
    }
  };

export const getPartnersData =
  (page = 1, search = "", city = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_PARTNERS_DATA_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/partnerData?page=${page}&search=${search}&city=${city}`
      );

      dispatch({
        type: GET_PARTNERS_DATA_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_PARTNERS_DATA_FAILURE,
        payload: err.message,
      });
    }
  };

export const getPartnersTransactions = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_PARTNERS_TRANSACTIONS_REQUEST,
    });

    const response = await axios.get(`${url}/partner/transactions`);

    dispatch({
      type: GET_PARTNERS_TRANSACTIONS_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_PARTNERS_TRANSACTIONS_FAILURE,
      payload: err.message,
    });
  }
};

export const getPartnerCityDetails =
  (page = 1, search = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_PARTNER_CITY_DETAILS_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/cityDetails?page=${page}&search=${search}`
      );

      dispatch({
        type: GET_PARTNER_CITY_DETAILS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_PARTNER_CITY_DETAILS_FAILURE,
        payload: err.message,
      });
    }
  };

export const getOfferCreation =
  (
    page = 1,
    search = "",
    cafeId = "",
    lowerlimit = 0,
    upperlimit = 5000,
    startDate = "",
    endDate = ""
  ) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_OFFER_CREATION_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/offerCreation?page=${page}&search=${search}&cafeId=${cafeId}&lowerlimit=${lowerlimit}&upperlimit=${upperlimit}&startDate=${startDate}&endDate=${endDate}`
      );

      dispatch({
        type: GET_OFFER_CREATION_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_OFFER_CREATION_FAILURE,
        payload: err.message,
      });
    }
  };

export const getMatched =
  (
    page = 1,
    search = "",
    cafeId = "",
    lowerlimit = 0,
    upperlimit = 5000,
    startDate = "",
    endDate = ""
  ) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_MATCHED_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/matched?page=${page}&search=${search}&cafeId=${cafeId}&lowerlimit=${lowerlimit}&upperlimit=${upperlimit}&startDate=${startDate}&endDate=${endDate}`
      );

      dispatch({
        type: GET_MATCHED_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_MATCHED_FAILURE,
        payload: err.message,
      });
    }
  };

export const getOfferExpired =
  (
    page = 1,
    search = "",
    cafeId = "",
    lowerlimit = 0,
    upperlimit = 5000,
    startDate = "",
    endDate = ""
  ) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_OFFER_EXPIRED_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/offerExpired?page=${page}&search=${search}&cafeId=${cafeId}&lowerlimit=${lowerlimit}&upperlimit=${upperlimit}&startDate=${startDate}&endDate=${endDate}`
      );

      dispatch({
        type: GET_OFFER_EXPIRED_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_OFFER_EXPIRED_FAILURE,
        payload: err.message,
      });
    }
  };

export const getCreditAmount =
  (
    page = 1,
    search = "",
    status = "",
    lowerlimit = 0,
    upperlimit = 5000,
    startDate = "",
    endDate = ""
  ) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_CREDIT_AMOUNT_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/creditAmount?page=${page}&search=${search}&status=${status}&lowerlimit=${lowerlimit}&upperlimit=${upperlimit}&startDate=${startDate}&endDate=${endDate}`
      );

      dispatch({
        type: GET_CREDIT_AMOUNT_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_CREDIT_AMOUNT_FAILURE,
        payload: err.message,
      });
    }
  };

export const getDebitAmount =
  (page = 1, status = "", lowerlimit = 0, upperlimit = 5000) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_DEBIT_AMOUNT_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/creditAmount?page=${page}&status=${status}&lowerlimit=${lowerlimit}&upperlimit=${upperlimit}`
      );

      dispatch({
        type: GET_DEBIT_AMOUNT_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_DEBIT_AMOUNT_FAILURE,
        payload: err.message,
      });
    }
  };

export const getUserQuery =
  (page = 1) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_USER_QUERY_REQUEST,
      });

      const response = await axios.get(`${url}/partner/userQuery?page=${page}`);

      dispatch({
        type: GET_USER_QUERY_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_USER_QUERY_FAILURE,
        payload: err.message,
      });
    }
  };

export const addUserQueryReply = (bodyData) => async (dispatch) => {
  try {
    dispatch({
      type: ADD_QUERY_REPLY_REQUEST,
    });

    const response = await axios.patch(
      `${url}/partner/addResolutionquery`,
      bodyData
    );

    dispatch({
      type: ADD_QUERY_REPLY_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: ADD_QUERY_REPLY_FAILURE,
      payload: err.message,
    });
  }
};

export const getRefundRequest =
  (page = 1, search = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_REFUND_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/refundRequest?page=${page}&search=${search}`
      );

      dispatch({
        type: GET_REFUND_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_REFUND_FAILURE,
        payload: err.message,
      });
    }
  };

export const getRestaurants =
  (page = 1) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_RESTAURANTS_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/selectRestaurants?page=${page}`
      );

      dispatch({
        type: GET_RESTAURANTS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_RESTAURANTS_FAILURE,
        payload: err.message,
      });
    }
  };

export const getMenuItems =
  (restaurantId = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_MENU_ITEMS_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/menuItems?restaurantId=${restaurantId}`
      );

      dispatch({
        type: GET_MENU_ITEMS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_MENU_ITEMS_FAILURE,
        payload: err.message,
      });
    }
  };

export const submitClaimOffer = (bodyData) => async (dispatch) => {
  try {
    dispatch({
      type: CLAIM_OFFER_SUBMIT_REQUEST,
    });

    const response = await axios.patch(
      `${url}/partner/claimOfferSubmit`,
      bodyData
    );

    dispatch({
      type: CLAIM_OFFER_SUBMIT_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: CLAIM_OFFER_SUBMIT_FAILURE,
      payload: err.message,
    });
  }
};

export const getPartnerDetails =
  (partnerId = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_PARTNER_DETAILS_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/partnerDataById?partnerId=${partnerId}`
      );

      dispatch({
        type: GET_PARTNER_DETAILS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_PARTNER_DETAILS_FAILURE,
        payload: err.message,
      });
    }
  };

export const getPartnerMenu =
  (restaurantId = "", nonVeg = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_PARTNER_MENU_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/partnerMenuItems?restaurantId=${restaurantId}&nonVeg=${nonVeg}`
      );

      dispatch({
        type: GET_PARTNER_MENU_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_PARTNER_MENU_FAILURE,
        payload: err.message,
      });
    }
  };


  export const getUserAlert =
  (page = 1, search="") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_USER_ALERT_REQUEST,
      });

      const response = await axios.get(`${url}/partner/userAlert?page=${page}&search=${search}`);

      dispatch({
        type: GET_USER_ALERT_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_USER_ALERT_FAILURE,
        payload: err.message,
      });
    }
  };



export const getUserReport =
  (page = 1, search="") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_USER_REPORT_REQUEST,
      });

      const response = await axios.get(`${url}/partner/userReport?page=${page}&search=${search}`);

      dispatch({
        type: GET_USER_REPORT_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_USER_REPORT_FAILURE,
        payload: err.message,
      });
    }
  };


export const getFloatingOffers =
  (page = 1, search="") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_FLOATING_OFFERS_REQUEST,
      });

      const response = await axios.get(`${url}/partner/getFloatingOffers?page=${page}&search=${search}`);

      dispatch({
        type: GET_FLOATING_OFFERS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_FLOATING_OFFERS_FAILURE,
        payload: err.message,
      });
    }
  };

  export const getUserOffers =
  (userId) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_USER_OFFERS_REQUEST,
      });

      const response = await axios.get(`${url}/partner/userOffer?userId=${userId}`);

      dispatch({
        type: GET_USER_OFFERS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_USER_OFFERS_FAILURE,
        payload: err.message,
      });
    }
  };

  export const getUserFeedbacks =
  (page = 1, search="") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_USER_FEEDBACKS_REQUEST,
      });

      const response = await axios.get(`${url}/partner/userFeedback?page=${page}&search=${search}`);

      dispatch({
        type: GET_USER_FEEDBACKS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_USER_FEEDBACKS_FAILURE,
        payload: err.message,
      });
    }
  };

  export const getDashboardUpperFigures =
  (startDate="", endDate="") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_DASHBOARD_UPPER_FIGURES_REQUEST,
      });

      const response = await axios.get(`${url}/partner/forUpperBoxs?startDate=${startDate}&endDate=${endDate}`);

      dispatch({
        type: GET_DASHBOARD_UPPER_FIGURES_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_DASHBOARD_UPPER_FIGURES_FAILURE,
        payload: err.message,
      });
    }
  };

  export const getDashboardNewUsers =
  (page = 1) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_DASHBOARD_NEW_USERS_REQUEST,
      });

      const response = await axios.get(`${url}/partner/homeNewUser?userPage=${page}`);

      dispatch({
        type: GET_DASHBOARD_NEW_USERS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_DASHBOARD_NEW_USERS_FAILURE,
        payload: err.message,
      });
    }
  };

  export const getDashboardNewReports =
  (page = 1) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_DASHBOARD_NEW_REPORTS_REQUEST,
      });

      const response = await axios.get(`${url}/partner/homeNewReport?page=${page}`);

      dispatch({
        type: GET_DASHBOARD_NEW_REPORTS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_DASHBOARD_NEW_REPORTS_FAILURE,
        payload: err.message,
      });
    }
  };

  export const getDashboardNewMatch =
  () =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_DASHBOARD_NEW_MATCH_REQUEST,
      });

      const response = await axios.get(`${url}/partner/homeNewMatch`);

      dispatch({
        type: GET_DASHBOARD_NEW_MATCH_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_DASHBOARD_NEW_MATCH_FAILURE,
        payload: err.message,
      });
    }
  };

  export const getDashboardOfferingItems =
  (startDate="", endDate="") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_DASHBOARD_OFFERING_ITEMS_REQUEST,
      });

      const response = await axios.get(`${url}/partner/homeMostOfferingItem?startDate=${startDate}&endDate=${endDate}`);

      dispatch({
        type: GET_DASHBOARD_OFFERING_ITEMS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_DASHBOARD_OFFERING_ITEMS_FAILURE,
        payload: err.message,
      });
    }
  };

  export const getDashboardAlerts =
  (page = 1) =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_DASHBOARD_ALERTS_REQUEST,
      });

      const response = await axios.get(`${url}/partner/homeAlertRaised?page=${page}`);

      dispatch({
        type: GET_DASHBOARD_ALERTS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_DASHBOARD_ALERTS_FAILURE,
        payload: err.message,
      });
    }
  };


  export const getDashboardRevenue =
  (startDate="", endDate="") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_DASHBOARD_REVENUE_REQUEST,
      });

      const response = await axios.get(`${url}/partner/homeRevenue?startDate=${startDate}&endDate=${endDate}`);

      dispatch({
        type: GET_DASHBOARD_REVENUE_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_DASHBOARD_REVENUE_FAILURE,
        payload: err.message,
      });
    }
  };

  export const getDashboardTraffic =
  () =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_DASHBOARD_TRAFFIC_REQUEST,
      });

      const response = await axios.get(`${url}/partner/homeTraffic`);

      dispatch({
        type: GET_DASHBOARD_TRAFFIC_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_DASHBOARD_TRAFFIC_FAILURE,
        payload: err.message,
      });
    }
  };