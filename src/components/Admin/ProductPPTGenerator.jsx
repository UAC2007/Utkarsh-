import React, { useState } from "react";
import axios from "axios";

const ProductPPTGenerator = () => {
  const [title, setTitle] = useState("");
  const [products, setProducts] = useState([
    { productName: "", productDescription: "", pricingText: "" },
  ]);

  // 🟢 Add a new product row
  const addProduct = () => {
    setProducts([...products, { productName: "", productDescription: "", pricingText: "" }]);
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

  // 🟢 Send data to backend and download PPT
  const downloadPPT = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/v1/ppt/generate", { title, products }, { responseType: "blob" });

      // Create a blob URL for downloading
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Product_Presentation.pptx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PPT:", error);
    }
  };

  return (
    <div className="p-6 mt-10 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Product PPT</h2>

      {/* Title Input */}
      <label className="block mb-2 text-gray-700 font-semibold">Title:</label>
      <input
        type="text"
        className="w-full border p-2 rounded-md mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        // placeholder="Enter PPT Title"
      />


      {/* Product List */}
      {products.map((product, index) => (
        <div key={index} className="mb-4 border border-gray-300 bg-white shadow-lg p-4 rounded-lg flex items-center gap-4">
           <div className="text-gray-700 font-semibold text-lg w-8 text-center">{index + 1}.</div>
          <div className="w-full">
            <label className="block text-gray-700">Product Name:</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md mb-2"
              value={product.productName}
              onChange={(e) => handleChange(index, "productName", e.target.value)}
            //   placeholder="Enter Product Name"
            />

            

            <label className="block text-gray-700">Product Description:</label>
            <textarea
              className="w-full border p-2 rounded-md mb-2"
              rows="5"
              value={product.productDescription}
              onChange={(e) => handleChange(index, "productDescription", e.target.value)}
            //   placeholder="Enter Product Description"
            ></textarea>

            <label className="block text-gray-700">Pricing Text:</label>
            <textarea
              className="w-full border p-2 rounded-md mb-2"
              rows="3"
              value={product.pricingText}
              onChange={(e) => handleChange(index, "pricingText", e.target.value)}
            //   placeholder="Enter Pricing Details"
            />
          </div>

          {/* Remove Row Button */}
          {products.length > 1 &&(
            <button
            onClick={() => removeProduct(index)}
            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-700"
          >
            ✕
          </button>
          )}
          
        </div>
      ))}

      {/* Add Product Button */}
      <button
        onClick={addProduct}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        + Add Product
      </button>

      {/* Generate PPT Button */}
      <button
        onClick={downloadPPT}
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700 ml-4"
      >
        Download PPT
      </button>
    </div>
  );
};

export default ProductPPTGenerator;