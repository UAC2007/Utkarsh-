import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { createProduct, clearErrors } from "../../actions/productAction";
import ImageIcon from "@mui/icons-material/Image";
import { categories } from "../../utils/constants";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";
import { getAdminBrands } from "../../actions/brandAction";

const NewProduct = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector((state) => state.newProduct);
  const { brands, error: getBrandsError } = useSelector(
    (state) => state.brands
  );

  /* const [highlights, setHighlights] = useState([]);
  const [highlightInput, setHighlightInput] = useState(""); */
  const [specs, setSpecs] = useState([]);
  const [specsInput, setSpecsInput] = useState({
    title: "",
    description: "",
  });
  const [wInfo, setWInfo] = useState([]);
  const [wInfoInput, setWInfoInput] = useState({
    title: "",
    description: "",
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [cuttedPrice, setCuttedPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [warranty, setWarranty] = useState(0);
  const [brand, setBrand] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  /* const [logo, setLogo] = useState("");
  const [logoPreview, setLogoPreview] = useState(""); */
  /* const tagsList = [
    "Best Seller",
    "New Arrival",
    "Limited Stock",
    "Assured",
    "Top Rated",
  ];
  const [tags, setTags] = useState([]); */
  const [variants, setVariants] = useState([]);
  const [variantInput, setVariantInput] = useState({
    variant: "",
    price: "",
    stock: "",
  });
  const [youtubeLink, setYoutubeLink] = useState("");
  const [moreLink, setMoreLink] = useState("");

  const handleSpecsChange = (e) => {
    setSpecsInput({ ...specsInput, [e.target.name]: e.target.value });
  };

  const addSpecs = () => {
    if (!specsInput.title.trim() || !specsInput.title.trim()) return;
    setSpecs([...specs, specsInput]);
    setSpecsInput({ title: "", description: "" });
  };

  const handleWInfoChange = (e) => {
    setWInfoInput({ ...wInfoInput, [e.target.name]: e.target.value });
  };

  const addWInfo = () => {
    if (!wInfoInput.title.trim() || !wInfoInput.title.trim()) return;
    setWInfo([...wInfo, wInfoInput]);
    setWInfoInput({ title: "", description: "" });
  };

  /* const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setHighlights([...highlights, highlightInput]);
    setHighlightInput("");
  };

  const deleteHighlight = (index) => {
    setHighlights(highlights.filter((h, i) => i !== index));
  }; */

  const deleteSpec = (index) => {
    setSpecs(specs.filter((s, i) => i !== index));
  };

  const deleteWInfo = (index) => {
    setWInfo(wInfo.filter((s, i) => i !== index));
  };

  /* const handleLogoChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setLogoPreview(reader.result);
        setLogo(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  }; */

  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldImages) => [...oldImages, reader.result]);
          setImages((oldImages) => [...oldImages, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  /* const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTags([...tags, value]);
    } else {
      setTags(tags.filter((tag) => tag !== value));
    }
  }; */

  const handleVariantChange = (e) => {
    setVariantInput({ ...variantInput, [e.target.name]: e.target.value });
  };

  const addVariant = () => {
    const { variant, price, stock } = variantInput;
    if (!variant.trim() || !price || !stock) return;

    setVariants([
      ...variants,
      {
        variant,
        price: Number(price),
        stock: Number(stock),
      },
    ]);

    setVariantInput({ variant: "", price: "", stock: "" });
  };

  const deleteVariant = (index) => {
    setVariants(variants.filter((v, i) => i !== index));
  };

  /* const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
  }; */

  const newProductSubmitHandler = (e) => {
    e.preventDefault();

    // required field checks
    if (brand.length < 1) {
      enqueueSnackbar("Select Brand", { variant: "warning" });
      return;
    }
    /* if (highlights.length <= 0) {
      enqueueSnackbar("Add Highlights", { variant: "warning" });
      return;
    } */
    /* if (!logo) {
      enqueueSnackbar("Add Brand Logo", { variant: "warning" });
      return;
    } */
    // if (!youtubeLink) {
    //   enqueueSnackbar("Enter Youtube link", { variant: "warning" });
    //   return;
    // }
    if (!moreLink) {
      enqueueSnackbar("Enter More link", { variant: "warning" });
      return;
    }
    if (specs.length <= 1) {
      enqueueSnackbar("Add Minimum 2 Specifications", { variant: "warning" });
      return;
    }
    if (wInfo.length <= 1) {
      enqueueSnackbar("Add Minimum 2 Warranty Details", { variant: "warning" });
      return;
    }
    /* if (tags.length < 1) {
      enqueueSnackbar("Add at least one tag", { variant: "warning" });
      return;
    } */
    if (images.length <= 0) {
      enqueueSnackbar("Add Product Images", { variant: "warning" });
      return;
    }

    const formData = new FormData();

    formData.set("name", name);
    formData.set("description", description);
    formData.set("price", price);
    formData.set("cuttedPrice", cuttedPrice);
    formData.set("category", category);
    formData.set("stock", stock);
    formData.set("warranty", warranty);
    formData.set("brand_id", brand);
    //formData.set("logo", logo);

    images.forEach((image) => {
      formData.append("images", image);
    });

    /* highlights.forEach((h) => {
      formData.append("highlights", h);
    }); */

    specs.forEach((s) => {
      formData.append("specifications", JSON.stringify(s));
    });

    wInfo.forEach((s) => {
      formData.append("warranty_details", JSON.stringify(s));
    });

    /* tags.forEach((tag) => {
      formData.append("tags", tag);
    }); */

    variants.forEach((variant) => {
      formData.append("variants", JSON.stringify(variant));
    });
    formData.set("youtube", youtubeLink);
    formData.set("morelink", moreLink);

    dispatch(createProduct(formData));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Product Created", { variant: "success" });
      dispatch({ type: NEW_PRODUCT_RESET });
      navigate("/admin/products");
    }
  }, [dispatch, error, success, navigate, enqueueSnackbar]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (!brands || brands.length === 0) {
      dispatch(getAdminBrands());
    }
  }, [dispatch, error, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Admin: New Product" />

      {loading && <BackdropLoader />}
      <form
        onSubmit={newProductSubmitHandler}
        encType="multipart/form-data"
        id="mainform"
      >
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-medium text-lg mb-3">General Information</h2>
          <div className="flex flex-col sm:flex-row">
            {/* Left Column */}
            <div className="flex flex-col gap-3 m-2 sm:w-1/2">
              <TextField
                label="Name"
                variant="outlined"
                size="small"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Category"
                select
                fullWidth
                variant="outlined"
                size="small"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((el, i) => (
                  <MenuItem value={el} key={i}>
                    {el}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-3 m-2 sm:w-1/2">
              <TextField
                label="Brand"
                select
                fullWidth
                variant="outlined"
                size="small"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                {brands?.map((brand) => (
                  <MenuItem value={brand._id} key={brand._id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <h2 className="font-medium text-lg mb-3">Pricing & Inventory</h2>
          <div className="flex flex-col sm:flex-row">
            {/* Left Column */}
            <div className="flex flex-col gap-3 m-2 sm:w-1/2">
              <div className="flex justify-between">
                <TextField
                  label="Price"
                  type="number"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <TextField
                  label="Cutted Price"
                  type="number"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  required
                  value={cuttedPrice}
                  onChange={(e) => setCuttedPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 m-2 sm:w-1/2">
              <div className="flex justify-between">
                <TextField
                  label="Stock"
                  type="number"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
                <TextField
                  label="Warranty"
                  type="number"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  required
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                />
              </div>
            </div>
          </div>
          <h2 className="font-medium text-lg mb-3">Product Summary</h2>
          <div className="flex flex-col gap-y-4 mb-3">
            <div className="flex flex-col gap-2">
              <TextField
                label="Short Description"
                multiline
                rows={3}
                required
                variant="outlined"
                size="small"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/*<div className="flex flex-col gap-2">
              <div className="flex justify-between items-center border rounded">
                <input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  type="text"
                  placeholder="Highlight *"
                  className="px-2 flex-1 outline-none border-none"
                />
                <span
                  onClick={() => addHighlight()}
                  className="py-2 px-6 bg-primary-blue text-white rounded-r hover:shadow-lg cursor-pointer"
                >
                  Add
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex justify-between rounded items-center py-1 px-2 bg-green-50"
                  >
                    <p className="text-green-800 text-sm font-medium">{h}</p>
                    <span
                      onClick={() => deleteHighlight(i)}
                      className="text-red-600 hover:bg-red-100 p-1 rounded-full cursor-pointer"
                    >
                      <DeleteIcon />
                    </span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
          <h2 className="font-medium text-lg mb-3">Product Images & Video</h2>
          <div className="flex flex-col sm:flex-row">
            {/* Left Column */}
            <div className="flex flex-col gap-3 m-2 sm:w-1/2">
              <div className="flex gap-2 overflow-x-auto h-32 border rounded">
                {imagesPreview.map((image, i) => (
                  <img
                    draggable="false"
                    src={image}
                    alt="Product"
                    key={i}
                    className="w-full h-full object-contain"
                  />
                ))}
              </div>
              <label className="rounded font-medium bg-gray-400 text-center cursor-pointer text-white p-2 shadow hover:shadow-lg my-2">
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleProductImageChange}
                  className="hidden"
                />
                Choose Files
              </label>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-3 m-2 sm:w-1/2">
              <TextField
                label="YouTube Link"
                variant="outlined"
                size="small"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
              />
              <TextField
                label="More Link *"
                variant="outlined"
                size="small"
                placeholder="Enter More Link"
                value={moreLink}
                onChange={(e) => setMoreLink(e.target.value)}
              />
              {/* <h2 className="font-medium mt-4">Tags</h2>
              <div className="flex flex-wrap gap-3">
                {tagsList.map((tag, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={tag}
                      checked={tags.includes(tag)}
                      onChange={handleTagChange}
                      className="accent-primary-blue"
                    />
                    <span className="text-sm">{tag}</span>
                  </label>
                ))}
              </div> */}
            </div>
          </div>
          <h2 className="font-medium text-lg mb-3">Technical Details</h2>
          <div className="flex flex-col gap-y-4 w-full">
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-lg text-gray-700">
                Specifications
              </h2>

              {/* Input Row */}
              <div className="flex flex-wrap md:flex-nowrap gap-2">
                <TextField
                  value={specsInput.title}
                  onChange={handleSpecsChange}
                  name="title"
                  label="Name *"
                  placeholder="Model No"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <TextField
                  value={specsInput.description}
                  onChange={handleSpecsChange}
                  name="description"
                  label="Description *"
                  placeholder="WJDK42DF5"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <span
                  onClick={addSpecs}
                  className="bg-primary-blue text-white px-4 py-2 rounded hover:shadow-md"
                >
                  Add
                </span>
              </div>

              {/* List of Specifications */}
              <div className="flex flex-col gap-1.5 mt-2">
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm bg-blue-50 py-2 px-3 rounded"
                  >
                    <div className="flex-1 font-medium text-gray-600">
                      {spec.title}
                    </div>
                    <div className="flex-1 text-gray-800">
                      {spec.description}
                    </div>
                    <span
                      onClick={() => deleteSpec(i)}
                      className="text-red-600 hover:bg-red-200 bg-red-100 p-1 rounded-full cursor-pointer"
                    >
                      <DeleteIcon fontSize="small" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-lg text-gray-700">
                Warranty Details
              </h2>

              {/* Input Row */}
              <div className="flex flex-wrap md:flex-nowrap gap-2">
                <TextField
                  value={wInfoInput.title}
                  onChange={handleWInfoChange}
                  name="title"
                  label="Name *"
                  placeholder="Model No"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <TextField
                  value={wInfoInput.description}
                  onChange={handleWInfoChange}
                  name="description"
                  label="Description *"
                  placeholder="WJDK42DF5"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <span
                  onClick={addWInfo}
                  className="bg-primary-blue text-white px-4 py-2 rounded hover:shadow-md"
                >
                  Add
                </span>
              </div>

              {/* List of Warranty Details */}
              <div className="flex flex-col gap-1.5 mt-2">
                {wInfo.map((wDet, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm bg-blue-50 py-2 px-3 rounded"
                  >
                    <div className="flex-1 font-medium text-gray-600">
                      {wDet.title}
                    </div>
                    <div className="flex-1 text-gray-800">
                      {wDet.description}
                    </div>
                    <span
                      onClick={() => deleteWInfo(i)}
                      className="text-red-600 hover:bg-red-200 bg-red-100 p-1 rounded-full cursor-pointer"
                    >
                      <DeleteIcon fontSize="small" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <h2 className="font-medium text-lg mb-3">Product Variants</h2>
          <div className="flex flex-col gap-y-4 w-full">
            <div className="flex flex-col gap-2">
              {/* Input Row */}
              <div className="flex flex-wrap md:flex-nowrap gap-2">
                <TextField
                  label="Variant"
                  name="variant"
                  value={variantInput.variant}
                  onChange={handleVariantChange}
                  size="small"
                  placeholder="8GB RAM, 128GB ROM, Black"
                  fullWidth
                />
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={variantInput.price}
                  onChange={handleVariantChange}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Stock"
                  name="stock"
                  type="number"
                  value={variantInput.stock}
                  onChange={handleVariantChange}
                  size="small"
                  fullWidth
                />
                <span
                  onClick={addVariant}
                  className="bg-primary-blue text-white px-4 py-2 rounded hover:shadow-md"
                >
                  Add
                </span>
              </div>

              {/* List of Variants */}
              <div className="flex flex-col gap-1.5 mt-2">
                {variants.map((v, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm rounded bg-yellow-50 py-1 px-2"
                  >
                    <p className="text-gray-800 font-medium">
                      {v.variant} — ₹{v.price} — Stock: {v.stock}
                    </p>
                    <span
                      onClick={() => deleteVariant(i)}
                      className="text-red-600 hover:bg-red-200 bg-red-100 p-1 rounded-full cursor-pointer"
                    >
                      <DeleteIcon />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <input
              form="mainform"
              type="submit"
              className="bg-primary-orange uppercase w-1/3 p-3 text-white font-medium rounded shadow hover:shadow-lg cursor-pointer"
              value="Submit"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default NewProduct;
