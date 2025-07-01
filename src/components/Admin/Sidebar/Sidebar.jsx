import { Link, useNavigate } from "react-router-dom";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupIcon from "@mui/icons-material/Group";
import ReviewsIcon from "@mui/icons-material/Reviews";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useDispatch, useSelector } from "react-redux";
import "./Sidebar.css";
import { useSnackbar } from "notistack";
import { logoutUser } from "../../../actions/userAction";
import { useState } from "react";

const Sidebar = ({ activeTab, setToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.user);

  const [showReports, setShowReports] = useState(true); // default open

  const handleLogout = () => {
    dispatch(logoutUser());
    enqueueSnackbar("Logout Successfully", { variant: "success" });
    navigate("/login");
  };

  const navMenu = [
    {
      icon: <EqualizerIcon />,
      label: "Dashboard",
      ref: "/admin/dashboard",
    },
    {
      icon: <ShoppingBagIcon />,
      label: "Orders",
      ref: "/admin/orders",
    },
    {
      icon: <AddBoxIcon />,
      label: "Add Brand",
      ref: "/admin/add_brand",
    },
    {
      icon: <InventoryIcon />,
      label: "Products",
      ref: "/admin/products",
    },
    {
      icon: <AddBoxIcon />,
      label: "Add Product",
      ref: "/admin/new_product",
    },
    {
      icon: <GroupIcon />,
      label: "Users",
      ref: "/admin/users",
    },
    {
      icon: <ReviewsIcon />,
      label: "Reviews",
      ref: "/admin/reviews",
    },
    {
      label: "Reports",
      isDropdown: true,
      icon: <EqualizerIcon />,
      children: [
        {
          label: "Order Status Report",
          ref: "/admin/report/orderStatus",
        },
        {
          label: "Revenue Report",
          ref: "/admin/report/revenue",
        },
        {
          label: "Invoice Report",
          ref: "/admin/report/invoices",
        },
        {
          label: "Product Sales Report",
          ref: "/admin/report/productSales",
        },
      ],
    },
    {
      icon: <LogoutIcon />,
      label: "Logout",
    },
  ];

  return (
    <aside className="sidebar z-10 sm:z-0 block min-h-screen fixed left-0 pb-14 max-h-screen w-3/4 sm:w-1/5 bg-gray-800 text-white overflow-x-hidden border-r">
      {/* User Header */}
      <div className="flex items-center gap-3 bg-gray-700 p-2 rounded-lg shadow-lg my-4 mx-3.5">
        <Avatar alt="Avatar" src={user?.avatar?.url} />
        <div className="flex flex-col gap-0">
          <span className="font-medium text-lg">{user.name}</span>
          <span className="text-gray-300 text-sm">{user.email}</span>
        </div>
        <button
          onClick={() => setToggleSidebar(false)}
          className="sm:hidden bg-gray-800 ml-auto rounded-full w-10 h-10 flex items-center justify-center"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Menu */}
      <div className="flex flex-col w-full gap-0 my-8">
        {navMenu.map((item, index) => {
          if (item.label === "Logout") {
            return (
              <button
                key={index}
                onClick={handleLogout}
                className="hover:bg-gray-700 flex gap-3 items-center py-3 px-4 font-medium"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          }

          if (item.isDropdown) {
            return (
              <div key={index} className="flex flex-col">
                <div
                  onClick={() => setShowReports(!showReports)}
                  className="flex gap-3 items-center justify-between py-3 px-4 font-medium hover:bg-gray-600 cursor-pointer"
                >
                  <div className="flex gap-3 items-center">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span>
                    {showReports ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </span>
                </div>
                {showReports &&
                  item.children.map((child, cIndex) => (
                    <Link
                      key={cIndex}
                      to={child.ref}
                      className="pl-12 py-2 px-4 hover:bg-gray-600 text-sm"
                    >
                      {child.label}
                    </Link>
                  ))}
              </div>
            );
          }

          return (
            <Link
              key={index}
              to={item.ref}
              className={`${
                activeTab === index ? "bg-gray-700" : "hover:bg-gray-700"
              } flex gap-3 items-center py-3 px-4 font-medium`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
