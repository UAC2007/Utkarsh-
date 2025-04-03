import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const ProductPPTGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Product list should match your backend product data
  const products = [
    { id: 1, name: "Product A" },
    { id: 2, name: "Product B" },
    { id: 3, name: "Product C" },
    { id: 4, name: "Product D" },
    { id: 5, name: "Product E" },
  ];

  const toggleSelection = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const downloadPPT = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/ppt/generate",
        { selectedProducts },
        { responseType: "blob" }
      );

      // Create a blob URL and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Product_Presentation.pptx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("PPT downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PPT:", error);
      toast.error("Failed to download PPT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mt-10 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Select Products for PPT</h2>
      <div>
        {products.map(product => (
          <div key={product.id}>
            <input
              type="checkbox"
              id={`product-${product.id}`}
              onChange={() => toggleSelection(product.id)}
              checked={selectedProducts.includes(product.id)}
            />
            <label htmlFor={`product-${product.id}`} className="ml-2">
              {product.name}
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={downloadPPT}
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700 mt-4"
        disabled={loading}
      >
        {loading ? "Downloading..." : "Download PPT"}
      </button>
    </div>
  );
};

export default ProductPPTGenerator;
