import React, { useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../actions/orderAction";
import { getAdminProducts } from "../../actions/productAction";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";

const ProductSalesReport = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.allOrders);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getAdminProducts());
  }, [dispatch]);
  const rows = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    const sales = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (!sales[item.product]) {
          const matchingProduct = products?.find((p) => p._id === item.product);

          sales[item.product] = {
            id: item.product,
            name: item.name,
            quantity: 0,
            revenue: 0,
            stock: matchingProduct?.stock ?? "N/A",
          };
        }

        sales[item.product].quantity += item.quantity;
        sales[item.product].revenue += item.quantity * item.price;
      });
    });

    return Object.values(sales).map((item, index) => ({
      ...item,
      id: index + 1,
    }));
  }, [orders, products]);

  const columns = [
    { field: "name", headerName: "Product Name", flex: 1 },
    {
      field: "quantity",
      headerName: "Total Units Sold",
      type: "number",
      flex: 1,
    },
    {
      field: "revenue",
      headerName: "Total Revenue",
      type: "number",
      flex: 1,
      valueFormatter: (params) => `₹${params.value.toFixed(2)}`,
    },
    {
      field: "stock",
      headerName: "Available Stock",
      type: "number",
      flex: 1,
    },
  ];

  const exportToExcel = () => {
    const exportData = rows.map((item) => ({
      "Product Name": item.name,
      "Total Units Sold": item.quantity,
      "Total Revenue (₹)": item.revenue.toFixed(2),
      "Available Stock": item.stock,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ProductSalesReport");
    XLSX.writeFile(workbook, "ProductSalesReport.xlsx");
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Product Sales Report</h2>
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white font-medium px-4 py-2 rounded hover:bg-green-700"
        >
          Export Excel
        </button>
      </div>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ProductSalesReport;
