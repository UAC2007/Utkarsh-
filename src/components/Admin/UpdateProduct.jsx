import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import {
  clearErrors,
  getProductDetails,
  updateProduct,
} from "../../actions/productAction";
import { getAdminBrands } from "../../actions/brandAction";
import { categories } from "../../utils/constants";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );
  const { isUpdated } = useSelector((state) => state.product);
  const { brands } = useSelector((state) => state.brands);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    cuttedPrice: 0,
    category: "",
    baseStock: 0,
    warranty: 0,
    brand: "",
    tags: [],
    specs: [],
    variants: [],
    youtubeLink: "",
    moreLink: "",
    imagesPreview: [],
  });

  const [specsInput, setSpecsInput] = useState({ title: "", description: "" });
  const [variantInput, setVariantInput] = useState({
    variant: "",
    price: "",
    stock: "",
  });
  const [images, setImages] = useState([]);
  const {
    name,
    description,
    price,
    cuttedPrice,
    category,
    baseStock,
    warranty,
    brand,
    tags,
    specs,
    variants,
    youtubeLink,
    moreLink,
    imagesPreview,
  } = formData;

  const tagsList = [
    "Best Seller",
    "New Arrival",
    "Future Products",
    "Limited Stock",
    "Assured",
    "Top Rated",
  ];

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product._id === id) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        cuttedPrice: product.cuttedPrice,
        category: product.category,
        baseStock: product.stock,
        warranty: product.warranty,
        brand: product.brand_code,
        tags: product.tags,
        specs: product.specifications,
        variants: product.variants,
        youtubeLink: product.youtube,
        moreLink: product.morelink,
        imagesPreview: product.images.map((img) => img.url),
      });
    }
  }, [product, id]);

  useEffect(() => {
    if (brands.length === 0) {
      dispatch(getAdminBrands());
    }
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isUpdated) {
      enqueueSnackbar("Product Updated", { variant: "success" });
      dispatch({ type: UPDATE_PRODUCT_RESET });
      navigate("/admin/products");
    }
  }, [dispatch, error, isUpdated, navigate, enqueueSnackbar]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setFormData({
      ...formData,
      tags: checked
        ? [...formData.tags, value]
        : formData.tags.filter((t) => t !== value),
    });
  };

  const handleSpecsChange = (e) => {
    setSpecsInput({ ...specsInput, [e.target.name]: e.target.value });
  };

  const addSpecs = () => {
    if (!specsInput.title.trim() || !specsInput.description.trim()) return;
    setFormData((prev) => ({ ...prev, specs: [...prev.specs, specsInput] }));
    setSpecsInput({ title: "", description: "" });
  };

  const deleteSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    const previews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          previews.push(reader.result);
          setImages((old) => [...old, reader.result]);
          setFormData((prev) => ({ ...prev, imagesPreview: [...previews] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVariantChange = (e) => {
    setVariantInput({ ...variantInput, [e.target.name]: e.target.value });
  };

  const addVariant = () => {
    const { variant, price, stock } = variantInput;
    if (!variant.trim() || !price || !stock) return;
    const totalVariantStock = variants.reduce(
      (acc, curr) => acc + curr.stock,
      0
    );
    const newVariantStock = Number(stock);

    if (totalVariantStock + newVariantStock > baseStock) {
      enqueueSnackbar("Total variant stock should not exceed base stock", {
        variant: "warning",
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { variant, price: +price, stock: +stock }],
    }));
    setVariantInput({ variant: "", price: "", stock: "" });
  };

  const deleteVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("name", formData.name);
    data.set("description", formData.description);
    data.set("price", formData.price);
    data.set("cuttedPrice", formData.cuttedPrice);
    data.set("category", formData.category);
    data.set("stock", formData.baseStock);
    data.set("warranty", formData.warranty);
    data.set("brand_code", formData.brand);
    data.set("youtube", formData.youtubeLink);
    data.set("morelink", formData.moreLink);
    images.forEach((img) => data.append("images", img));
    formData.specs.forEach((s) =>
      data.append("specifications", JSON.stringify(s))
    );
    formData.tags.forEach((t) => data.append("tags", t));
    formData.variants.forEach((v) =>
      data.append("variants", JSON.stringify(v))
    );
    dispatch(updateProduct(id, data));
  };

  return (
    <>
      <MetaData title="Admin: Update Product" />
      {loading && <BackdropLoader />}
      <form
        onSubmit={updateProductSubmitHandler}
        encType="multipart/form-data"
        id="mainform"
      >
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-medium text-lg mb-3">General Information</h2>
          <div className="flex flex-col sm:flex-row mb-3">
            {/* Left Column */}
            <div className="flex flex-col gap-3 m-2 sm:w-1/2">
              <TextField
                label="Name"
                variant="outlined"
                size="small"
                required
                value={name}
                onChange={handleInputChange}
              />
              <TextField
                label="Category"
                select
                fullWidth
                variant="outlined"
                size="small"
                required
                value={category}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              >
                {brands?.map((brand) => (
                  <MenuItem value={brand.brand_code} key={brand.brand_code}>
                    {brand.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <h2 className="font-medium text-lg mb-3">Pricing & Inventory</h2>
          <div className="flex flex-col sm:flex-row mb-3">
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  value={baseStock}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </div>

            {/*<div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center border rounded">
                      <input
                        value={highlightInput}
                        onChange={handleInputChange}
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
          <div className="flex flex-col sm:flex-row mb-3">
            {/* Left Column */}
            <div className="flex flex-col gap-3 m-2 sm:w-1/2">
              <div className="flex gap-2 overflow-x-auto h-32 border rounded">
                {imagesPreview.slice(0, 3).map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    alt="Product"
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
                onChange={handleInputChange}
              />
              <TextField
                label="More Link *"
                variant="outlined"
                size="small"
                placeholder="Enter More Link"
                value={moreLink}
                onChange={handleInputChange}
              />
              <h2 className="font-medium mt-4">Tags</h2>
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
              </div>
            </div>
          </div>
          <h2 className="font-medium text-lg mb-3">Technical Details</h2>
          <div className="flex flex-col gap-y-4 w-full mb-3">
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
                  label="Name"
                  placeholder="Model No"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <TextField
                  value={specsInput.description}
                  onChange={handleSpecsChange}
                  name="description"
                  label="Description"
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
          </div>
          <h2 className="font-medium text-lg mb-3">Product Variants</h2>
          <div className="flex flex-col gap-y-4 w-full mb-3">
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
      ;
    </>
  );
};

export default UpdateProduct;
