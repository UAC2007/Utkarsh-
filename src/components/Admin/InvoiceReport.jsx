import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../actions/orderAction";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const InvoiceReport = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.allOrders);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const filtered = orders.filter((order) => {
        const invoiceDate = new Date(order.invoiceDate);
        return invoiceDate >= fromDate && invoiceDate <= toDate;
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  }, [from, to, orders]);

  const exportToExcel = () => {
    const exportData = filteredOrders.map((order) => ({
      "Invoice No": order.invoiceNumber,
      "Invoice Date": format(new Date(order.invoiceDate), "MM/dd/yyyy hh:mm a"),
      "Customer Name": order.billingInfo?.name || "N/A",
      "Total Price (₹)": order.totalPrice,
      "Order Status": order.orderStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "InvoiceReport");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `InvoiceReport_${Date.now()}.xlsx`);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "invoiceNumber", headerName: "Invoice No", flex: 1 },
    {
      field: "invoiceDate",
      headerName: "Invoice Date",
      flex: 1,
      valueFormatter: (params) =>
        format(new Date(params.value), "MM/dd/yyyy hh:mm a"),
    },
    {
      field: "name",
      headerName: "Customer",
      flex: 1,
    },
    {
      field: "total",
      headerName: "Total (₹)",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Order Status",
      flex: 1,
    },
  ];

  const rows = filteredOrders.map((order, i) => ({
    id: i + 1,
    invoiceNumber: order.invoiceNumber,
    invoiceDate: order.invoiceDate,
    name: order.billingInfo?.name || "N/A",
    total: order.totalPrice,
    status: order.orderStatus,
  }));

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Invoice Report</h2>

      <div className="flex gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium">From Date</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">To Date</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white font-medium px-4 py-2 rounded hover:bg-green-700"
            disabled={filteredOrders.length === 0}
          >
            Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default InvoiceReport;
