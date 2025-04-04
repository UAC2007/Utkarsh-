import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const ProductPPTGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [titledescription, setTitledescription] = useState("");
  const [generalNotes, setGeneralNotes] = useState(
    "➢ The prices mentioned are rough estimates and on rentals for the mentioned dates in Dubai\n" +
      "➢ Prices mentioned above are estimates exclusive of VAT.\n" +
      "➢ The above-attached images/video links are just for reference, the actual product may vary.\n" +
      "➢ Timeline – need confirmation by Saturday.\n" +
      "➢ The price includes overall project management and operations.\n" +
      "➢ The prices are exclusive of any kinds of LED walls, fabrication, cladding and branding\n" +
      "➢ Final price can be shared depending on the agreed scope of work and clarity of content"
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://mmic-backend.onrender.com/api/v1/ppt/generate"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

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

  const handleGeneralNotesChange = (e) => {
    const value = e.target.value;
    const lines = value.split("\n");
    if (lines.length > 8) {
      toast.error("General Notes can only have 8 lines.");
      return;
    }
    setGeneralNotes(value);
  };

  // Download PPT file that includes the selected products
  const downloadPPT = async () => {
    if (selectedProducts.length === 0) {
      toast.warn("Please select at least one product.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://mmic-backend.onrender.com/api/v1/ppt/generate",
        { title, titledescription, generalNotes, selectedProducts },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.pptx`);
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

  // Highlight matching text in product names (optional helper)
  const highlightMatch = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
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

  return (
    <div className="p-6 mt-10 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}
      <label className="block mb-2 text-gray-700 font-semibold">
        Event Name:
      </label>
      <input
        type="text"
        className="w-full border p-2 rounded-md mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label className="block mb-2 text-gray-700 font-semibold">
        Event Venue:
      </label>
      <textarea
        type="text"
        required
        className="w-full border p-2 rounded-md mb-4"
        value={titledescription}
        onChange={(e) => setTitledescription(e.target.value)}
        rows="3"
      />
      <label className="block mb-2 text-gray-700 font-semibold">
        Select Products:
      </label>

      {/* Display selected products as pills */}
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedProducts.map((id) => {
            const product = products.find((p) => p.id === id);
            return (
              <span
                key={id}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center space-x-2"
              >
                <span>{product?.name}</span>
                <button
                  onClick={() => toggleSelection(id)}
                  className="text-blue-500 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search and select products..."
          value={searchTerm}
          onClick={() => setIsDropdownOpen(true)}
          onFocus={() => setIsDropdownOpen(true)} // 👈 Add this line
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          className="border w-full p-2 rounded-md"
        />

        {/* Dropdown */}
        {isDropdownOpen && (
          <div
            className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
            ref={dropdownRef}
          >
            {filteredProducts.length === 0 ? (
              <p className="p-2 text-gray-500">No products found.</p>
            ) : (
              filteredProducts.map((product) => (
                <label
                  key={product.id}
                  className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleSelection(product.id)}
                  />
                  {highlightMatch(product.name, searchTerm)}
                </label>
              ))
            )}
            {/* Optional Close Button */}
            <div className="p-2 border-t">
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="text-sm text-blue-600 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <label className="block mb-2 text-gray-700 font-semibold">
        General Notes:
      </label>
      <textarea
        type="text"
        required
        className="w-full border p-2 rounded-md mb-4"
        value={generalNotes}
        onChange={handleGeneralNotesChange}
        rows="7"
      />

      {/* Download button */}
      <button
        onClick={downloadPPT}
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Downloading..." : "Download PPT"}
      </button>
    </div>
  );
};

export default ProductPPTGenerator;
