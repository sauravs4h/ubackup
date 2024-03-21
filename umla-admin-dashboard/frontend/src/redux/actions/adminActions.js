import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  GET_USERS_DATA_REQUEST,
  GET_USERS_DATA_SUCCESS,
  GET_USERS_DATA_FAILURE,
  EARLY_BIRD_USER_REQUEST,
  EARLY_BIRD_USER_SUCCESS,
  EARLY_BIRD_USER_FAILURE,
  APPROVE_VERIFICATION_REQUEST,
  APPROVE_VERIFICATION_SUCCESS,
  APPROVE_VERIFICATION_FAILURE,
  SECOND_OFFER_REQUEST,
  SECOND_OFFER_SUCCESS,
  SECOND_OFFER_FAILURE,
  VERIFY_PROFILE_REQUEST,
  VERIFY_PROFILE_SUCCESS,
  VERIFY_PROFILE_FAILURE,
  DENY_USER_VERIFY_REQUEST,
  DENY_USER_VERIFY_SUCCESS,
  DENY_USER_VERIFY_FAILURE,
  ADMIN_LOGOUT,
  COFFEE_GIVEN_REQUEST,
  COFFEE_GIVEN_SUCCESS,
  COFFEE_GIVEN_FAILURE,
  BLOCK_USER_REQUEST,
  BLOCK_USER_SUCCESS,
  BLOCK_USER_FAILURE,
} from "../constants/adminConstants";
import axios from "axios";
import { url } from "../../constants";
import { toast } from "react-toastify";

export const loginRequest = (bodyData) => async (dispatch) => {
  try {
    dispatch({
      type: LOGIN_REQUEST,
    });

    const response = await axios.post(`${url}/login`, bodyData);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data,
    });
    toast.success('Login Successful');
		localStorage.setItem('admin', JSON.stringify(response.data));
  } catch (err) {
    console.error(err);
    dispatch({
      type: LOGIN_FAILURE,
      payload: err.message,
    });
  }
};

export const logout = () => async (dispatch) => {
	try {
		// Remove the static token here as well
		localStorage.removeItem('admin');
		dispatch({ type: ADMIN_LOGOUT });
	} catch (error) {
		console.log(error);
	}
};

export const getUsers = (page, search="") => async (dispatch) => {
  try {
    dispatch({
      type: GET_USERS_REQUEST,
    });

    const response = await axios.get(`${url}/getUsers?page=${page}&search=${search}`);

    dispatch({
      type: GET_USERS_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_USERS_FAILURE,
      payload: err.message,
    });
  }
};

export const getUsersData = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: GET_USERS_DATA_REQUEST,
    });

    const response = await axios.get(`${url}/getUserData/${userId}`);

    dispatch({
      type: GET_USERS_DATA_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_USERS_DATA_FAILURE,
      payload: err.message,
    });
  }
};

export const denyUserVerification = (bodyData) => async (dispatch) => {
  try {
    dispatch({
      type: DENY_USER_VERIFY_REQUEST,
    });

    const response = await axios.put(`${url}/denyUserVerification`, bodyData);

    dispatch({
      type: DENY_USER_VERIFY_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: DENY_USER_VERIFY_FAILURE,
      payload: err.message,
    });
  }
};

export const earlyBird = () => async (dispatch) => {
  try {
    dispatch({
      type: EARLY_BIRD_USER_REQUEST,
    });

    const response = await axios.get(`${url}/getEarlyBirdUsers`);

    dispatch({
      type: EARLY_BIRD_USER_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: EARLY_BIRD_USER_FAILURE,
      payload: err.message,
    });
  }
};

export const approveVerification = (bodyData) => async (dispatch) => {
  try {
    dispatch({
      type: APPROVE_VERIFICATION_REQUEST,
    });

    const response = await axios.post(
      `${url}/approveVerificationForCoupon`,
      bodyData
    );

    dispatch({
      type: APPROVE_VERIFICATION_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: APPROVE_VERIFICATION_FAILURE,
      payload: err.message,
    });
  }
};

export const secondOffer = (bodyData) => async (dispatch) => {
  try {
    dispatch({
      type: SECOND_OFFER_REQUEST,
    });

    const response = await axios.post(`${url}/secondOffer`, bodyData);

    dispatch({
      type: SECOND_OFFER_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: SECOND_OFFER_FAILURE,
      payload: err.message,
    });
  }
};

export const verifyProfile = (bodyData) => async (dispatch) => {
  try {
    dispatch({
      type: VERIFY_PROFILE_REQUEST,
    });

    const response = await axios.post(`${url}/verifyProfile`, bodyData);

    dispatch({
      type: VERIFY_PROFILE_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: VERIFY_PROFILE_FAILURE,
      payload: err.message,
    });
  }
};


export const blockUser = (bodyData) => async (dispatch) => {
  try {
    dispatch({
      type: BLOCK_USER_REQUEST,
    });

    const response = await axios.patch(`${url}/partner/blockUser`, bodyData);

    dispatch({
      type: BLOCK_USER_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: BLOCK_USER_FAILURE,
      payload: err.message,
    });
  }
};



export const coffeeGiven = (page) => async (dispatch) => {
  try {
    dispatch({
      type: COFFEE_GIVEN_REQUEST,
    });

    const response = await axios.get(`${url}/getCoffeeClaimed?page=${page}`);

    dispatch({
      type: COFFEE_GIVEN_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: COFFEE_GIVEN_FAILURE,
      payload: err.message,
    });
  }
};