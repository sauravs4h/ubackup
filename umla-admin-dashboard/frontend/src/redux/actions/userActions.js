import axios from "axios";
import {
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAILURE,
  GET_BOOKINGS_REQUEST,
  GET_BOOKINGS_SUCCESS,
  GET_BOOKINGS_FAILURE,
  GET_OUTLETS_REQUEST,
  GET_OUTLETS_SUCCESS,
  GET_OUTLETS_FAILURE,
  GET_OUTLET_CITY_REQUEST,
  GET_OUTLET_CITY_SUCCESS,
  GET_OUTLET_CITY_FAILURE,
  GET_WEEKLY_BOOKINGS_REQUEST,
  GET_WEEKLY_BOOKINGS_SUCCESS,
  GET_WEEKLY_BOOKINGS_FAILURE,
  GET_USER_TRAFFIC_REQUEST,
  GET_USER_TRAFFIC_SUCCESS,
  GET_USER_TRAFFIC_FAILURE,
  GET_USER_PURCHASES_REQUEST,
  GET_USER_PURCHASES_SUCCESS,
  GET_USER_PURCHASES_FAILURE,
  GET_USER_MEETUPS_REQUEST,
  GET_USER_MEETUPS_SUCCESS,
  GET_USER_MEETUPS_FAILURE,
  GET_USER_MATCHES_REQUEST,
  GET_USER_MATCHES_SUCCESS,
  GET_USER_MATCHES_FAILURE,
  GET_USER_DEALS_REQUEST,
  GET_USER_DEALS_SUCCESS,
  GET_USER_DEALS_FAILURE,
  GET_VERIFIED_USERS_REQUEST,
  GET_VERIFIED_USERS_SUCCESS,
  GET_VERIFIED_USERS_FAILURE,
  GET_UNVERIFIED_USERS_REQUEST,
  GET_UNVERIFIED_USERS_SUCCESS,
  GET_UNVERIFIED_USERS_FAILURE,
  GET_USER_DATA_MEETUP_REQUEST,
  GET_USER_DATA_MEETUP_SUCCESS,
  GET_USER_DATA_MEETUP_FAILURE,
} from "../constants/userConstants";
import { url } from "../../constants";

export const getAllUsers =
  (page = 1, search = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_ALL_USERS_REQUEST,
      });

      const response = await axios.get(
        `${url}/getAllUser?page=${page}&search=${search}`
      );

      dispatch({
        type: GET_ALL_USERS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_ALL_USERS_FAILURE,
        payload: err.message,
      });
    }
  };

export const getUserProfile = (id) => async (dispatch) => {
  try {
    dispatch({
      type: GET_USER_PROFILE_REQUEST,
    });

    const response = await axios.get(`${url}/getUser?userId=${id}`);

    dispatch({
      type: GET_USER_PROFILE_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_USER_PROFILE_FAILURE,
      payload: err.message,
    });
  }
};

export const getBookings =
  (page = 1, cafeId = "", status = "", startDate="", endDate="") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_BOOKINGS_REQUEST,
      });

      const response = await axios.get(
        `${url}/getBookings?page=${page}&cafeId=${cafeId}&status=${status}&startDate=${startDate}&endDate=${endDate}`
      );

      dispatch({
        type: GET_BOOKINGS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_BOOKINGS_FAILURE,
        payload: err.message,
      });
    }
  };

export const getOutlets = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_OUTLETS_REQUEST,
    });

    const response = await axios.get(`${url}/filter/outlets`);

    dispatch({
      type: GET_OUTLETS_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_OUTLETS_FAILURE,
      payload: err.message,
    });
  }
};

export const getOutletCity = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_OUTLET_CITY_REQUEST,
    });

    const response = await axios.get(`${url}/filter/outlets/city`);

    dispatch({
      type: GET_OUTLET_CITY_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_OUTLET_CITY_FAILURE,
      payload: err.message,
    });
  }
};

export const getWeeklyBookings =
  (page = 1, startDate="", endDate="") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_WEEKLY_BOOKINGS_REQUEST,
      });

      const response = await axios.get(
        `${url}/weeklyBooking?page=${page}&startDate=${startDate}&endDate=${endDate}`
      );

      dispatch({
        type: GET_WEEKLY_BOOKINGS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_WEEKLY_BOOKINGS_FAILURE,
        payload: err.message,
      });
    }
  };

export const getUserTraffic =
  (search = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_USER_TRAFFIC_REQUEST,
      });

      const response = await axios.get(`${url}/userTraffic?search=${search}`);

      dispatch({
        type: GET_USER_TRAFFIC_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_USER_TRAFFIC_FAILURE,
        payload: err.message,
      });
    }
  };

export const getUserPurchases =
  (page = 1, search = "", cafeId = "", status = "",  startDate = "",
  endDate = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_USER_PURCHASES_REQUEST,
      });

      const response = await axios.get(
        `${url}/userData/purchase?page=${page}&search=${search}&cafeId=${cafeId}&status=${status}&startDate=${startDate}&endDate=${endDate}`
      );

      dispatch({
        type: GET_USER_PURCHASES_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_USER_PURCHASES_FAILURE,
        payload: err.message,
      });
    }
  };

export const getUserMeetups = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_USER_MEETUPS_REQUEST,
    });

    const response = await axios.get(`${url}/partner/userMeetups`);

    dispatch({
      type: GET_USER_MEETUPS_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_USER_MEETUPS_FAILURE,
      payload: err.message,
    });
  }
};

export const getUserMatches = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_USER_MATCHES_REQUEST,
    });

    const response = await axios.get(`${url}/partner/userMatches`);

    dispatch({
      type: GET_USER_MATCHES_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_USER_MATCHES_FAILURE,
      payload: err.message,
    });
  }
};

export const getUserDeals = (id) => async (dispatch) => {
  try {
    dispatch({
      type: GET_USER_DEALS_REQUEST,
    });

    const response = await axios.get(`${url}/partner/userDeals?userId=${id}`);

    dispatch({
      type: GET_USER_DEALS_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_USER_DEALS_FAILURE,
      payload: err.message,
    });
  }
};

export const getVerifiedUsers =
  (page = 1, search="") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_VERIFIED_USERS_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/verifiedUsers?page=${page}&search=${search}`
      );

      dispatch({
        type: GET_VERIFIED_USERS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_VERIFIED_USERS_FAILURE,
        payload: err.message,
      });
    }
  };

export const getUnVerifiedUsers =
  (page = 1, search="") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_UNVERIFIED_USERS_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/unVerifiedUsers?page=${page}&search=${search}`
      );

      dispatch({
        type: GET_UNVERIFIED_USERS_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_UNVERIFIED_USERS_FAILURE,
        payload: err.message,
      });
    }
  };

export const getUserDataMeetup =
  (page = 1, search = "", city="", restaurantId = "", orderStatus = "",  startDate = "",
  endDate = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: GET_USER_DATA_MEETUP_REQUEST,
      });

      const response = await axios.get(
        `${url}/partner/usersDataMeetups?page=${page}&search=${search}&city=${city}&restaurantId=${restaurantId}&orderStatus=${orderStatus}&startDate=${startDate}&endDate=${endDate}`
      );

      dispatch({
        type: GET_USER_DATA_MEETUP_SUCCESS,
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: GET_USER_DATA_MEETUP_FAILURE,
        payload: err.message,
      });
    }
  };
