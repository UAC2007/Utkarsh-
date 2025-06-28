import React, { useState, useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  NEW_BRAND_RESET,
  DELETE_BRAND_RESET,
  UPDATE_BRAND_RESET,
  REMOVE_BRAND_DETAILS,
} from "../../constants/brandConstants";
import Actions from "./Actions";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";
import {
  clearErrors,
  getAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandDetails,
} from "../../actions/brandAction";

const AddBrand = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const brandId = params.id;

  const fileInputRef = useRef(null);

  const { brands, error } = useSelector((state) => state.brands);
  const {
    loadingDelete,
    isDeleted,
    error: deleteError,
  } = useSelector((state) => state.brand);
  const {
    loadingAdd,
    success,
    error: addError,
  } = useSelector((state) => state.newBrand);
  const {
    loadingUpdate,
    brand,
    error: loadupdateError,
  } = useSelector((state) => state.brandDetails);
  const {
    loading: updateLoading,
    isUpdated,
    error: updateError,
  } = useSelector((state) => state.brand);

  const [brandInput, setBrandInput] = useState({ name: "", logo: null });

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (deleteError) {
      enqueueSnackbar(deleteError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (loadupdateError) {
      enqueueSnackbar(loadupdateError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isDeleted) {
      enqueueSnackbar("Brand Deleted Successfully", { variant: "success" });
      dispatch({ type: DELETE_BRAND_RESET });
      dispatch(getAdminBrands());

      setBrandInput({ name: "", logo: null });
      navigate("/admin/add_brand");
    }
  }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

  useEffect(() => {
    if (addError) {
      enqueueSnackbar(addError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Brand Created", { variant: "success" });
      dispatch({ type: NEW_BRAND_RESET });
      dispatch(getAdminBrands());

      setBrandInput({ name: "", logo: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [dispatch, addError, success, enqueueSnackbar]);

  useEffect(() => {
    if (updateError) {
      enqueueSnackbar(updateError, { variant: "error" });
      dispatch(clearErrors());
    }

    if (isUpdated) {
      enqueueSnackbar("Brand Updated Successfully", { variant: "success" });
      dispatch({ type: UPDATE_BRAND_RESET });
      dispatch({ type: REMOVE_BRAND_DETAILS });
      dispatch(getAdminBrands());

      setBrandInput({ name: "", logo: null });
      navigate("/admin/add_brand");
    }
  }, [isUpdated, updateError, dispatch, enqueueSnackbar, navigate]);

  useEffect(() => {
    if (!brandId) return;

    if (!brand || brand._id !== brandId) {
      dispatch(getBrandDetails(brandId));
    } else {
      setBrandInput({
        name: brand.name,
        logo: brand.logo?.url || null,
      });
    }
  }, [dispatch, brandId, brand]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrandInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setBrandInput((prev) => ({ ...prev, logo: reader.result }));
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const brandSubmitHandler = (e) => {
    e.preventDefault();

    if (!brandInput.name.trim()) {
      enqueueSnackbar("Enter Brand", { variant: "warning" });
      return;
    }

    if (!brandInput.logo && !brandId) {
      enqueueSnackbar("Upload Brand Logo", { variant: "warning" });
      return;
    }

    const formData = new FormData();
    formData.set("name", brandInput.name);
    if (brandInput.logo) {
      formData.set("logo", brandInput.logo);
    }

    if (!brandId) {
      dispatch(createBrand(formData));
    } else {
      dispatch(updateBrand(brandId, formData));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deleteBrandHandler = (id) => {
    dispatch(deleteBrand(id));
  };

  const columns = [
    {
      field: "id",
      headerName: "Brand ID",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              draggable={false}
              src={params.row.image}
              alt={params.row.name}
              className="w-full h-full object-cover"
            />
          </div>
          {params.row.name}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <Actions
          editRoute={"brand"}
          deleteHandler={deleteBrandHandler}
          id={params.row.id}
        />
      ),
    },
  ];

  const rows =
    brands?.map((item) => ({
      id: item._id,
      name: item.name,
      image: item.logo?.url,
    })) ?? [];

  return (
    <div className="flex flex-col gap-y-6 w-full mx-auto">
      {(loadingAdd || loadingDelete || updateLoading) && <BackdropLoader />}

      <div className="flex flex-col gap-4 bg-white p-4 shadow rounded-md">
        <form
          onSubmit={brandSubmitHandler}
          encType="multipart/form-data"
          id="mainform"
        >
          <h2 className="font-semibold text-lg text-gray-700">Add Brand</h2>

          <div className="flex flex-col md:flex-row gap-4">
            <TextField
              label="Brand Name"
              name="name"
              value={brandInput.name}
              onChange={handleInputChange}
              placeholder="Samsung"
              variant="outlined"
              size="small"
              fullWidth
            />
            <input
              ref={fileInputRef}
              id="brand-logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded px-2 py-1 text-sm w-full md:w-1/2"
            />
            <button className="bg-primary-blue text-white px-6 py-2 rounded hover:shadow">
              {brandId ? "Update" : "Add"}
            </button>
          </div>

          {/* Preview logo if editing */}
          {brandInput.logo && typeof brandInput.logo === "string" && (
            <div className="mt-4">
              <img
                src={brandInput.logo}
                alt="Preview"
                className="w-20 h-20 object-contain border rounded"
              />
            </div>
          )}
        </form>

        <MetaData title="Admin Brands" />
        <div style={{ height: 470 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            sx={{ boxShadow: 0, border: 0 }}
          />
        </div>
      </div>
    </div>
  );
};

export default AddBrand;
