const initialState = {
  loading: false,
  success: false,
  error: null,
};

export const productXLSUploadReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_XLS_UPLOAD_REQUEST":
      return { ...state, loading: true, success: false, error: null };
    case "PRODUCT_XLS_UPLOAD_SUCCESS":
      return { ...state, loading: false, success: true };
    case "PRODUCT_XLS_UPLOAD_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PRODUCT_XLS_UPLOAD_RESET":
      return initialState;
    case "PRODUCT_XLS_UPLOAD_RESET":
      return {
        loading: false,
        success: false,
        error: null,
      };
    default:
      return state;
  }
};
