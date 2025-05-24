import { deleteCall, getCall, postCall, putCall } from "../api/HttpService";
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

export const getAdminBrands = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_BRANDS_REQUEST });

    const { data } = await getCall("/api/v1/admin/brands");

    dispatch({
      type: ADMIN_BRANDS_SUCCESS,
      payload: data.brands,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_BRANDS_FAIL,
      payload:
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong",
    });
  }
};

export const createBrand = (brandData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_BRAND_REQUEST });

    const { data } = await postCall("/api/v1/admin/brand/new", brandData);

    dispatch({
      type: NEW_BRAND_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_BRAND_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const updateBrand = (id, brandData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_BRAND_REQUEST });

    const { data } = await putCall(`/api/v1/admin/brand/${id}`, brandData);

    dispatch({
      type: UPDATE_BRAND_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_BRAND_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const deleteBrand = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BRAND_REQUEST });
    const { data } = await deleteCall(`/api/v1/admin/brand/${id}`);

    dispatch({
      type: DELETE_BRAND_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_BRAND_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Brand Details
export const getBrandDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: BRAND_DETAILS_REQUEST });

    const { data } = await getCall(`/api/v1/brand/${id}`);

    dispatch({
      type: BRAND_DETAILS_SUCCESS,
      payload: data.brand,
    });
  } catch (error) {
    dispatch({
      type: BRAND_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear All Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
