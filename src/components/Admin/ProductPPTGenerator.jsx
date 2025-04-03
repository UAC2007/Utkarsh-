import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const ProductPPTGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Controls whether the dropdown with checkboxes is visible
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Reference to the dropdown container (for optional outside click handling)
  const dropdownRef = useRef(null);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://mmic-backend.onrender.com/api/v1/ppt/generate");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  // If you want to close the dropdown when user clicks outside:
  // (Optional feature, uncomment if you want this behavior)
  /*
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  */

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle selection of a product
  const toggleSelection = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle the dropdown open/close
  const handleSearchClick = () => {
    // If the dropdown is closed, open it; if open, close it.
    // Also, if you want the search to be dynamic, you might re-filter here.
    setIsDropdownOpen((prev) => !prev);
  };

  // Download a single PPT file that includes the selected products
  const downloadPPT = async () => {
    if (selectedProducts.length === 0) {
      toast.warn("Please select at least one product.");
      return;
    }
    setLoading(true);
    try {
      // We assume your backend always returns a single PPT file
      const response = await axios.post(
        "https://mmic-backend.onrender.com/api/v1/ppt/generate",
        { selectedProducts }, // No 'downloadType' needed, we removed it
        { responseType: "blob" }
      );
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

      {/* Search bar + Search button */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 mr-2 flex-grow"
          onClick={handleSearchClick}
        />
        
      </div>

      {/* Dropdown with checkboxes */}
      {isDropdownOpen && (
        <div
          className="border p-2 rounded-md mb-4 w-full max-h-60 overflow-y-auto"
          ref={dropdownRef}
        >
          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <label
                key={product.id}
                htmlFor={`product-${product.id}`}
                className="flex items-center space-x-2 mb-2"
              >
                <input
                  type="checkbox"
                  id={`product-${product.id}`}
                  onChange={() => toggleSelection(product.id)}
                  checked={selectedProducts.includes(product.id)}
                />
                <span>{product.name}</span>
              </label>
            ))
          )}
        </div>
      )}

      {/* Download button */}
      <button
        onClick={downloadPPT}
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Downloading..." : "Download PPT"}
      </button>
    </div>
  );
};

export default ProductPPTGenerator;
