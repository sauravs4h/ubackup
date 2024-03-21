export const loginRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, loading: true };

    case "LOGIN_SUCCESS":
      return { loading: false, loginInfo: action.payload.user };

    case "LOGIN_FAILURE":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const getUsersReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USERS_REQUEST":
      return { ...state, loading: true };

    case "GET_USERS_SUCCESS":
      return {
        loading: false,
        users: action.payload.users,
        total: action.payload.total,
        totalVerified: action.payload.totalVerified,
        totalApproved: action.payload.totalApproved,
        coffeeClaimed: action.payload.coffeeClaimed,
        maleCount: action.payload.maleCount,
        femaleCount: action.payload.femaleCount,
        verificationDenied: action.payload.verificationDenied,
      };

    case "GET_USERS_FAILURE":
      return { loading: false, users: [], error: action.payload };

    default:
      return state;
  }
};

export const getUsersDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USERS_DATA_REQUEST":
      return { ...state, loading: true };

    case "GET_USERS_DATA_SUCCESS":
      return { loading: false, user: action.payload.user };

    case "GET_USERS_DATA_FAILURE":
      return { loading: false, user: [], error: action.payload };

    default:
      return state;
  }
};

export const denyUserVerificationReducer = (state = {}, action) => {
  switch (action.type) {
    case "DENY_USER_VERIFY_REQUEST":
      return { ...state, loading: true };

    case "DENY_USER_VERIFY_SUCCESS":
      return { loading: false, user: action.payload.users };

    case "DENY_USER_VERIFY_FAILURE":
      return { loading: false, user: [], error: action.payload };

    default:
      return state;
  }
};

export const earlyBirdOfferReducer = (state = {}, action) => {
  switch (action.type) {
    case "EARLY_BIRD_USER_REQUEST":
      return { ...state, loading: true };

    case "EARLY_BIRD_USER_SUCCESS":
      return { loading: false, users: action.payload.users };

    case "EARLY_BIRD_USER_FAILURE":
      return { loading: false, users: [], error: action.payload };

    default:
      return state;
  }
};

export const approveVerificationReducer = (state = {}, action) => {
  switch (action.type) {
    case "APPROVE_VERIFICATION_REQUEST":
      return { ...state, loading: true };

    case "APPROVE_VERIFICATION_SUCCESS":
      return { loading: false, users: action.payload.users };

    case "APPROVE_VERIFICATION_FAILURE":
      return { loading: false, users: [], error: action.payload };

    default:
      return state;
  }
};

export const secondOfferReducer = (state = {}, action) => {
  switch (action.type) {
    case "SECOND_OFFER_REQUEST":
      return { ...state, loading: true };

    case "SECOND_OFFER_SUCCESS":
      return { loading: false, users: action.payload.users };

    case "SECOND_OFFER_FAILURE":
      return { loading: false, users: [], error: action.payload };

    default:
      return state;
  }
};

export const verifyProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case "VERIFY_PROFILE_REQUEST":
      return { ...state, loading: true };

    case "VERIFY_PROFILE_SUCCESS":
      return { loading: false, users: action.payload.users };

    case "VERIFY_PROFILE_FAILURE":
      return { loading: false, users: [], error: action.payload };

    default:
      return state;
  }
};

export const coffeeGivenReducer = (state = {}, action) => {
  switch (action.type) {
    case "COFFEE_GIVEN_REQUEST":
      return { ...state, loading: true };

    case "COFFEE_GIVEN_SUCCESS":
      return {
        loading: false,
        coupons: action.payload.coupons,
        total: action.payload.total,
      };

    case "COFFEE_GIVEN_FAILURE":
      return { loading: false, coupons: [], error: action.payload };

    default:
      return state;
  }
};


export const blockUserReducer = (state = {}, action) => {
  switch (action.type) {
    case "BLOCK_USER_REQUEST":
      return { ...state, loading: true };

    case "BLOCK_USER_SUCCESS":
      return { loading: false, user: action.payload.users };

    case "BLOCK_USER_FAILURE":
      return { loading: false, user: [], error: action.payload };

    default:
      return state;
  }
};