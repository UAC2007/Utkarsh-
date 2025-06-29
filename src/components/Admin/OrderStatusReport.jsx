import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../actions/orderAction";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

const OrderStatusReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders = [], loading } = useSelector((state) => state.allOrders);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID", flex: 1, minWidth: 180 },
    { field: "customer", headerName: "Customer", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 130 },
    {
      field: "amount",
      headerName: "Total Price",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => `₹${params.value}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 130,
      cellClassName: (params) => {
        return params.value === "Delivered"
          ? "text-green-600 font-medium"
          : params.value === "Shipped"
          ? "text-yellow-600 font-medium"
          : "text-blue-600 font-medium";
      },
    },
    {
      field: "date",
      headerName: "Ordered On",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Button
          onClick={() => navigate(`/admin/order/${params.row.oid}`)}
          startIcon={<LaunchIcon />}
        >
          View
        </Button>
      ),
    },
  ];

  const rows = orders.map((order) => ({
    id: order._id,
    oid: order._id,
    customer: order.shippingInfo.name,
    email: order.shippingInfo.email,
    phone: order.shippingInfo.mobileNo,
    amount: order.totalPrice,
    status: order.orderStatus,
    date: new Date(order.createdAt).toLocaleDateString("en-IN"),
  }));

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Order Status Report</h2>
      <div style={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          autoHeight
          pageSize={10}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default OrderStatusReport;
