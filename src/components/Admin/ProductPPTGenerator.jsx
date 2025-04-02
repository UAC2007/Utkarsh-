import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { htmlToText } from "html-to-text";
import { ToastContainer, toast } from 'react-toastify';

const ProductPPTGenerator = () => {
  const [title, setTitle] = useState("");
  const [titledescription, setTitledescription] = useState("");
  const [generalnotes, setGeneralnotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([
    { productName: "", productDescription: "", pricingText: "" },
  ]);

  // 🟢 Add a new product row
  const addProduct = () => {
    setProducts([
      ...products,
      { productName: "", productDescription: "", pricingText: "" },
    ]);
  };

  // 🟢 Remove a product row
  const removeProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  // 🟢 Handle input changes
  const handleChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const validateFields = () => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return false;
    }
    if (!titledescription.trim()) {
      toast.error("Event Detail is required.");
      return false;
    }
   
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product.productName.trim()) {
        toast.error(`Product Name is required for product ${i + 1}.`);
        return false;
      }
      if (!product.productDescription.trim()) {
        toast.error(`Product Description is required for product ${i + 1}.`);
        return false;
      }
      if (!product.pricingText.trim()) {
        toast.error(`Pricing Text is required for product ${i + 1}.`);
        return false;
      }
    }
     // Check generalnotes; also ignore the empty default markup
     if (!generalnotes.trim() || generalnotes === "<p><br></p>") {
      toast.error("General Notes is required.");
      return false;
    }
    return true;
  };

  // 🟢 Send data to backend and download PPT
  const downloadPPT = async () => {

    if (!validateFields()) return; // Validate before proceeding
    setLoading(true);
    try {
      const plainGeneralNotes = htmlToText(generalnotes, {
        wordwrap: false,
      });
      const response = await axios.post(
        "https://mmic-backend.onrender.com/api/v1/ppt/generate",
        { title, titledescription, products, generalnotes : plainGeneralNotes },
        { responseType: "blob" }
      );

      // Create a blob URL for downloading
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Product_Presentation.pptx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setProducts([
        { productName: "", productDescription: "", pricingText: "" },
      ]);
      setTitle("");
      setTitledescription("");
      setGeneralnotes("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error downloading PPT:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 mt-10 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Create Product PPT</h2>

      {/* Title Input */}
      <label className="block mb-2 text-gray-700 font-semibold">Title:</label>
      <input
        type="text"
        className="w-full border p-2 rounded-md mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        // placeholder="Enter PPT Title"
      />
      <label className="block mb-2 text-gray-700 font-semibold">
        Event Detail:
      </label>
      <textarea
        type="text"
        required
        className="w-full border p-2 rounded-md mb-4"
        value={titledescription}
        onChange={(e) => setTitledescription(e.target.value)}
        // placeholder="Enter PPT Title"
      />

      {/* Product List */}
      {products.map((product, index) => (
        <div
          key={index}
          className="mb-4 border border-gray-300 bg-white shadow-lg p-4 rounded-lg flex items-center gap-4"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold text-lg">
            {index + 1}
          </div>

          <div className="w-full">
            <label className="block text-gray-700">Product Name:</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md mb-2"
              rows="3"
              value={product.productName}
              onChange={(e) =>
                handleChange(index, "productName", e.target.value)
              }
              required
              //   placeholder="Enter Product Name"
            />

            <label className="block text-gray-700">Product Description:</label>
            <textarea
              className="w-full border p-2 rounded-md mb-2"
              rows="5"
              value={product.productDescription}
              onChange={(e) =>
                handleChange(index, "productDescription", e.target.value)
              }
              required
              //   placeholder="Enter Product Description"
            ></textarea>

            <label className="block text-gray-700">Pricing Text:</label>
            <textarea
              className="w-full border p-2 rounded-md mb-2"
              rows="3"
              value={product.pricingText}
              onChange={(e) =>
                handleChange(index, "pricingText", e.target.value)
              }
              required
              //   placeholder="Enter Pricing Details"
            />
          </div>

          {/* Remove Row Button */}
          {products.length > 1 && (
            <button
              onClick={() => removeProduct(index)}
              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-700"
            >
              ✕
            </button>
          )}
        </div>
      ))}
       <button
        onClick={addProduct}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        + Add Product
      </button>
      <label className="block mb-2 text-gray-700 font-semibold mt-4">
        General Notes:
      </label>

      <ReactQuill
        theme="snow"
        value={generalnotes}
        onChange={(content) => setGeneralnotes(content)}
        modules={ProductPPTGenerator.modules}
        formats={ProductPPTGenerator.formats}
        style={{ height: "300px", marginBottom: "70px" }}
        required
      />

      {/* Add Product Button */}
     <div className="mt-4">
    

      {/* Generate PPT Button */}
      <button
        onClick={downloadPPT}
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700 ml-4"
        disabled={loading}
      >
        {loading ? "Downloading..." : "Download PPT"}
      </button>
     </div>
    </div>
  );
};

ProductPPTGenerator.modules = {
  toolbar: [
    // [{ header: "1" }, { header: "2" }, { font: [] }],
    // [{ size: [] }],
    // ["bold", "italic", "underline", "strike", "blockquote"],
    // [{ align: [] }],
    // [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      // { indent: "-1" },
      // { indent: "+1" },
    ],
    // ["clean"],
  ],
};
ProductPPTGenerator.formats = [
  // "header",
  // "font",
  // "size",
  // "bold",
  // "italic",
  // "underline",
  // "strike",
  // "blockquote",
  // "color",
  // "background",
  "list",
  "bullet",
  // "indent",
  // "link",
  // "video",
  // "image",
  // "code-block",
  // "align",
];

export default ProductPPTGenerator;
