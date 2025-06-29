import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../actions/orderAction";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const RevenueReport = () => {
  const dispatch = useDispatch();
  const { orders = [] } = useSelector((state) => state.allOrders || {});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    if (!startDate || !endDate) return orders;

    const from = new Date(startDate);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999); // include entire end day

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= from && orderDate <= to;
    });
  }, [orders, startDate, endDate]);

  const getTotal = (key) =>
    filteredOrders.reduce((acc, order) => acc + Number(order[key] || 0), 0);

  const totalRevenue = getTotal("totalPrice");
  const totalDiscount = getTotal("discount");
  const totalSGST = getTotal("SGST");
  const totalCGST = getTotal("CGST");
  const netRevenue = totalRevenue - totalSGST - totalCGST;

  const exportToExcel = () => {
    const excelData = filteredOrders.map((order, index) => ({
      "#": index + 1,
      "Invoice No": order.invoiceNumber,
      Date: format(new Date(order.createdAt), "dd/MM/yyyy"),
      Customer: order.shippingInfo?.name || "—",
      "Total (₹)": order.totalPrice.toFixed(2),
      "Discount (₹)": (order.discount || 0).toFixed(2),
      "SGST (₹)": (order.SGST || 0).toFixed(2),
      "CGST (₹)": (order.CGST || 0).toFixed(2),
      Status: order.orderStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, `Revenue_Report_${format(new Date(), "yyyyMMdd")}.xlsx`);
  };

  const columns = [
    { field: "id", headerName: "#", width: 70 },
    { field: "invoiceNumber", headerName: "Invoice No", width: 180 },
    {
      field: "date",
      headerName: "Date",
      width: 120,
      valueGetter: (params) =>
        format(new Date(params.row.createdAt), "dd/MM/yyyy"),
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1,
      valueGetter: (params) => params.row.shippingInfo?.name || "—",
    },
    {
      field: "total",
      headerName: "Total (₹)",
      type: "number",
      width: 130,
      valueGetter: (params) => params.row.totalPrice.toFixed(2),
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      valueGetter: (params) => params.row.orderStatus,
    },
  ];

  const rows = filteredOrders.map((order, index) => ({
    id: index + 1,
    ...order,
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Revenue Report</h2>
        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h4 className="text-sm">Total Orders</h4>
          <p className="text-lg font-semibold">{filteredOrders.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h4 className="text-sm">Total Revenue</h4>
          <p className="text-lg font-semibold">₹{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h4 className="text-sm">Discount</h4>
          <p className="text-lg font-semibold">₹{totalDiscount.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h4 className="text-sm">Tax (SGST + CGST)</h4>
          <p className="text-lg font-semibold">
            ₹{(totalSGST + totalCGST).toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <h4 className="text-sm">Net Earnings</h4>
          <p className="text-lg font-semibold">₹{netRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div style={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          className="bg-white rounded shadow"
        />
      </div>
    </div>
  );
};

export default RevenueReport;
