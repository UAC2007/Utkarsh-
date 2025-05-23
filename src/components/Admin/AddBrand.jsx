import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  NEW_BRAND_RESET,
  DELETE_BRAND_RESET,
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
} from "../../actions/brandAction";

const AddBrand = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

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
    if (isDeleted) {
      enqueueSnackbar("Brand Deleted Successfully", { variant: "success" });
      dispatch({ type: DELETE_BRAND_RESET });
    }
    dispatch(getAdminBrands());
  }, [dispatch, error, deleteError, isDeleted, navigate, enqueueSnackbar]);

  useEffect(() => {
    if (addError) {
      enqueueSnackbar(addError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Brand Created", { variant: "success" });
      dispatch({ type: NEW_BRAND_RESET });
      dispatch(getAdminBrands()); // 🔁 Re-fetch updated brand list
    }
  }, [dispatch, addError, success, navigate, enqueueSnackbar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrandInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setBrandInput((prev) => ({ ...prev, logo: reader.result }));
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const newBrandSubmitHandler = (e) => {
    e.preventDefault();
    if (brandInput.name.length <= 0) {
      enqueueSnackbar("Enter Brand", { variant: "warning" });
      return;
    }
    if (!brandInput.logo) {
      enqueueSnackbar("Upload Brand Logo", { variant: "warning" });
      return;
    }
    if (!brandInput.name.trim() || !brandInput.logo) return;

    setBrandInput({ name: "", logo: null });

    const formData = new FormData();
    formData.set("name", brandInput.name);
    formData.set("logo", brandInput.logo);
    dispatch(createBrand(formData));
    document.getElementById("brand-logo").value = ""; // Reset file input
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
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full">
              <img
                draggable="false"
                src={params.row.image}
                alt={params.row.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.3,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Actions
            editRoute={"brand"}
            deleteHandler={deleteBrandHandler}
            id={params.row.id}
          />
        );
      },
    },
  ];

  const rows = [];

  brands &&
    brands.forEach((item) => {
      rows.unshift({
        id: item._id,
        name: item.name,
        image: item.logo?.url,
      });
    });

  return (
    <div className="flex flex-col gap-y-6 w-full mx-auto">
      {loadingAdd && <BackdropLoader />}
      {/* Brand Form */}
      <div className="flex flex-col gap-4 bg-white p-4 shadow rounded-md">
        <form
          onSubmit={newBrandSubmitHandler}
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
              id="brand-logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded px-2 py-1 text-sm w-full md:w-1/2"
            />
            <button className="bg-primary-blue text-white px-6 py-2 rounded hover:shadow">
              Add
            </button>
          </div>
        </form>

        {/* Brand List Table */}
        <>
          <MetaData title="Admin Brands" />

          {loadingDelete && <BackdropLoader />}

          <div style={{ height: 470 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectIconOnClick
              sx={{
                boxShadow: 0,
                border: 0,
              }}
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default AddBrand;
