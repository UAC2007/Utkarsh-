import {
  ADMIN_BRANDS_FAIL,
  ADMIN_BRANDS_REQUEST,
  ADMIN_BRANDS_SUCCESS,
  ALL_BRANDS_FAIL,
  ALL_BRANDS_REQUEST,
  ALL_BRANDS_SUCCESS,
  CLEAR_ERRORS,
  DELETE_BRAND_FAIL,
  DELETE_BRAND_REQUEST,
  DELETE_BRAND_RESET,
  DELETE_BRAND_SUCCESS,
  NEW_BRAND_FAIL,
  NEW_BRAND_REQUEST,
  NEW_BRAND_RESET,
  NEW_BRAND_SUCCESS,
  BRAND_DETAILS_FAIL,
  BRAND_DETAILS_REQUEST,
  BRAND_DETAILS_SUCCESS,
  UPDATE_BRAND_FAIL,
  UPDATE_BRAND_REQUEST,
  UPDATE_BRAND_RESET,
  UPDATE_BRAND_SUCCESS,
  REMOVE_BRAND_DETAILS,
} from "../constants/brandConstants";

export const brandsReducer = (state = { brands: [] }, { type, payload }) => {
  switch (type) {
    case ALL_BRANDS_REQUEST:
    case ADMIN_BRANDS_REQUEST:
      return {
        ...state,
        loading: true,
        brands: [],
      };

    case ALL_BRANDS_SUCCESS:
      return {
        loading: false,
        brands: payload.brands,
        brandsCount: payload.brandsCount,
        resultPerPage: payload.resultPerPage,
        filteredBrandsCount: payload.filteredBrandsCount,
      };

    case ADMIN_BRANDS_SUCCESS:
      return {
        loading: false,
        brands: payload,
      };

    case ALL_BRANDS_FAIL:
    case ADMIN_BRANDS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const brandDetailsReducer = (
  state = { brand: {} },
  { type, payload }
) => {
  switch (type) {
    case BRAND_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case BRAND_DETAILS_SUCCESS:
      return {
        loading: false,
        brand: payload,
      };
    case BRAND_DETAILS_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case REMOVE_BRAND_DETAILS:
      return {
        ...state,
        brand: {},
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// New Brand Reducer
export const newBrandReducer = (state = { brand: {} }, { type, payload }) => {
  switch (type) {
    case NEW_BRAND_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_BRAND_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        brand: payload.brand,
      };
    case NEW_BRAND_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case NEW_BRAND_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// New Brand Reducer
export const brandReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case UPDATE_BRAND_REQUEST:
    case DELETE_BRAND_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_BRAND_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: payload,
      };
    case DELETE_BRAND_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: payload,
      };
    case UPDATE_BRAND_FAIL:
    case DELETE_BRAND_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case UPDATE_BRAND_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case DELETE_BRAND_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
