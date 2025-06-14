import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { uploadProductXLS } from "../../actions/productXLSAction";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";
import { resetProductXLSUpload } from "../../actions/productXLSAction";

const NewProductXLS = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector(
    (state) => state.productXLSUpload
  );

  const handleDownloadSample = () => {
    const sampleData = [
      {
        name: "Sample Product",
        brand_code: 1,
        category: "Mobiles",
        price: 20000,
        cuttedPrice: 22000,
        stock: 5,
        warranty: 1,
        description: "This is a sample product",
        images: "https://image1.jpg, https://image2.jpg",
        tags: "New Arrival, Best Seller",
        youtube: "https://www.youtube.com/watch?v=xyz",
        morelink: "https://example.com",
        specifications: "In The Box:Charger, Cable;Model Number:XYZ123",
        variants: "Variant A::10000::3| Variant B::12000::2",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);

    // Attach comments manually
    ws["A1"].c = [{ t: "Product name" }];
    ws["B1"].c = [{ t: "Brand ID (number, Apple - 1)" }];
    ws["C1"].c = [{ t: "Category like Mobiles, Laptops, etc." }];
    ws["D1"].c = [{ t: "Selling price in number" }];
    ws["E1"].c = [{ t: "Original cutted price" }];
    ws["F1"].c = [{ t: "Stock quantity" }];
    ws["G1"].c = [{ t: "Warranty period (in years)" }];
    ws["H1"].c = [{ t: "Short description" }];
    ws["I1"].c = [{ t: "Image URLs comma-separated (Cloudinary/Drive links)" }];
    ws["J1"].c = [{ t: "Comma-separated tags like New Arrival, Top Pick" }];
    ws["K1"].c = [{ t: "YouTube video link" }];
    ws["L1"].c = [{ t: "More link (official or product page)" }];
    ws["M1"].c = [
      { t: "Format: title:desc;title2:desc2 (semicolon-separated specs)" },
    ];
    ws["N1"].c = [{ t: "Format: variant::price::stock,comma-separated" }];

    // Mark the sheet to use comments
    ws["!comments"] = [];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");

    // ✅ Write file with comments option enabled
    XLSX.writeFile(wb, "sample_products_upload.xlsx", {
      bookType: "xlsx",
      cellComments: true,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);
  };

  const handleParseExcel = () => {
    if (!excelFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const enhancedData = data.map((row) => {
        let totalVariantStock = 0;

        if (typeof row.variants === "string" && row.variants.trim()) {
          const variantList = row.variants.split("|");

          for (const variant of variantList) {
            const parts = variant.trim().split("::");
            const stock = Number(parts[2]);
            if (!isNaN(stock)) {
              totalVariantStock += stock;
            }
          }
        }

        return {
          ...row,
          totalVariantStock,
        };
      });

      setParsedData(enhancedData);
    };

    reader.readAsBinaryString(excelFile);
  };

  const handleUpload = () => {
    if (!parsedData || parsedData.length === 0) {
      enqueueSnackbar(
        "No data to upload. Please preview the Excel file first.",
        {
          variant: "warning",
          autoHideDuration: 4000,
        }
      );
      return;
    }

    enqueueSnackbar("Uploading products... Please wait.", {
      variant: "info",
      autoHideDuration: 3000,
    });

    dispatch(uploadProductXLS(parsedData));
  };

  useEffect(() => {
    if (success) {
      enqueueSnackbar("Products uploaded successfully", { variant: "success" });
      navigate("/admin/products");
    }
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  }, [success, error, enqueueSnackbar, navigate]);

  useEffect(() => {
    dispatch(resetProductXLSUpload());
  }, [dispatch]);

  const columns = parsedData[0]
    ? [
        ...Object.keys(parsedData[0])
          .filter((key) => key !== "totalVariantStock")
          .map((key) => ({
            field: key,
            headerName: key,
            width: 150,
          })),
        {
          field: "totalVariantStock",
          headerName: "Total Variant Stock",
          width: 180,
          type: "number",
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-y-6 w-full mx-auto">
      {loading && <BackdropLoader />}

      <div className="flex flex-col gap-4 bg-white p-4 shadow rounded-md">
        <form
          encType="multipart/form-data"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg text-gray-700">
              Upload Products via Excel
            </h2>
            <Link
              to="/admin/products"
              className="py-2 px-4 rounded shadow font-medium text-white bg-primary-blue hover:shadow-lg hover:opacity-90 transition"
            >
              ← Back to Product List
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="border rounded px-2 py-1 text-sm w-full md:w-1/2"
            />
            <div className="flex flex-wrap gap-2 md:gap-4">
              <Button variant="outlined" onClick={handleParseExcel}>
                Preview Data
              </Button>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Upload"}
              </Button>
              <Button variant="outlined" onClick={handleDownloadSample}>
                Download Sample Format
              </Button>
            </div>
          </div>
        </form>

        {parsedData.length > 0 && (
          <DataGrid
            rows={parsedData.map((row, index) => ({ id: index, ...row }))}
            columns={columns}
            autoHeight
            pageSize={5}
            getRowClassName={(params) =>
              params.row.totalVariantStock > Number(params.row.stock)
                ? "bg-red-100" // or use MUI class overrides
                : ""
            }
          />
        )}
      </div>
    </div>
  );
};

export default NewProductXLS;
