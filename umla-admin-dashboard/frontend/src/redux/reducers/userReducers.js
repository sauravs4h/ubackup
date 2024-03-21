export const getAllUsersReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_ALL_USERS_REQUEST":
      return { ...state, loading: true };

    case "GET_ALL_USERS_SUCCESS":
      return {
        loading: false,
        users: action.payload.users,
        verifiedProfiles: action.payload.verifiedProfiles,
        unVerifiedProfiles: action.payload.unVerifiedProfiles,
      };

    case "GET_ALL_USERS_FAILURE":
      return { loading: false, users: [], error: action.payload };

    default:
      return state;
  }
};

export const getUserProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_PROFILE_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_PROFILE_SUCCESS":
      return {
        loading: false,
        info: action.payload.info,
        userProfile: action.payload.userProfile,
        profileInfo: action.payload.profileInfo,
        _id: action.payload._id,

      };

    case "GET_USER_PROFILE_FAILURE":
      return { loading: false, user: {}, error: action.payload };

    default:
      return state;
  }
};

export const getBookingsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_BOOKINGS_REQUEST":
      return { ...state, loading: true };

    case "GET_BOOKINGS_SUCCESS":
      return {
        loading: false,
        bookings: action.payload.bookings,
        todaysBooking: action.payload.todaysBooking,
        thisWeekBooking: action.payload.thisWeekBooking,
      };

    case "GET_BOOKINGS_FAILURE":
      return { loading: false, bookings: [], error: action.payload };

    default:
      return state;
  }
};

export const getOutletsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_OUTLETS_REQUEST":
      return { ...state, loading: true };

    case "GET_OUTLETS_SUCCESS":
      return {
        loading: false,
        outlets: action.payload.outlets,
      };

    case "GET_OUTLETS_FAILURE":
      return { loading: false, outlets: [], error: action.payload };

    default:
      return state;
  }
};


export const getOutletCityReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_OUTLET_CITY_REQUEST":
      return { ...state, loading: true };

    case "GET_OUTLET_CITY_SUCCESS":
      return {
        loading: false,
        city: action.payload.city,
      };

    case "GET_OUTLET_CITY_FAILURE":
      return { loading: false, city: [], error: action.payload };

    default:
      return state;
  }
};

export const getWeeklyBookingsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_WEEKLY_BOOKINGS_REQUEST":
      return { ...state, loading: true };

    case "GET_WEEKLY_BOOKINGS_SUCCESS":
      return {
        loading: false,
        weeklyBooking: action.payload.weeklyBooking,
      };

    case "GET_WEEKLY_BOOKINGS_FAILURE":
      return { loading: false, weeklyBooking: [], error: action.payload };

    default:
      return state;
  }
};

export const getUserTrafficReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_TRAFFIC_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_TRAFFIC_SUCCESS":
      return {
        loading: false,
        userTraffic: action.payload.userTraffic,
      };

    case "GET_USER_TRAFFIC_FAILURE":
      return { loading: false, userTraffic: [], error: action.payload };

    default:
      return state;
  }
};

export const getUserPurchasesReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_PURCHASES_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_PURCHASES_SUCCESS":
      return {
        loading: false,
        purchase: action.payload.purchase,
      };

    case "GET_USER_PURCHASES_FAILURE":
      return { loading: false, purchase: [], error: action.payload };

    default:
      return state;
  }
};

export const getUserMeetupsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_MEETUPS_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_MEETUPS_SUCCESS":
      return {
        loading: false,
        meetups: action.payload.meetups,
      };

    case "GET_USER_MEETUPS_FAILURE":
      return { loading: false, meetups: [], error: action.payload };

    default:
      return state;
  }
};

export const getUserMatchesReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_MATCHES_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_MATCHES_SUCCESS":
      return {
        loading: false,
        matches: action.payload.matches,
      };

    case "GET_USER_MATCHES_FAILURE":
      return { loading: false, matches: [], error: action.payload };

    default:
      return state;
  }
};

export const getUserDealsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_DEALS_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_DEALS_SUCCESS":
      return {
        loading: false,
        floatingdeals: action.payload.floatingdeals,
        upcomingdeals: action.payload.upcomingdeals,

      };

    case "GET_USER_DEALS_FAILURE":
      return { loading: false, floatingdeals: [], upcomingdeals: [], error: action.payload };

    default:
      return state;
  }
};

export const getVerifiedUsersReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_VERIFIED_USERS_REQUEST":
      return { ...state, loading: true };

    case "GET_VERIFIED_USERS_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
        verifiedUser: action.payload.verifiedUser,
        unVerifiedUser: action.payload.unVerifiedUser,


      };

    case "GET_VERIFIED_USERS_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getUnVerifiedUsersReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_UNVERIFIED_USERS_REQUEST":
      return { ...state, loading: true };

    case "GET_UNVERIFIED_USERS_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "GET_UNVERIFIED_USERS_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};

export const getUserDataMeetupReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_DATA_MEETUP_REQUEST":
      return { ...state, loading: true };

    case "GET_USER_DATA_MEETUP_SUCCESS":
      return {
        loading: false,
        responseData: action.payload.responseData,
      };

    case "GET_USER_DATA_MEETUP_FAILURE":
      return { loading: false, responseData: [], error: action.payload };

    default:
      return state;
  }
};