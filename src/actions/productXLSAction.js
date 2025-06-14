import { deleteCall, getCall, postCall, putCall } from "../api/HttpService";

export const uploadProductXLS = (file) => async (dispatch) => {
  try {
    dispatch({ type: "PRODUCT_XLS_UPLOAD_REQUEST" });

    const formData = new FormData();
    formData.append("products", JSON.stringify(file));

    const { data } = await postCall(
      "/api/v1/admin/product/upload-products",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    dispatch({ type: "PRODUCT_XLS_UPLOAD_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "PRODUCT_XLS_UPLOAD_FAIL",
      payload: error.response?.data?.message || "Excel Upload Failed",
    });
  }
};

export const resetProductXLSUpload = () => (dispatch) => {
  dispatch({ type: "PRODUCT_XLS_UPLOAD_RESET" });
};
