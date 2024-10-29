import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import CategoryPage from "../pages/category/CategoryPage";
import Search from "../pages/search/Search";
import ShopPage from "../pages/shop/ShopPage";
import SingleProduct from "../pages/shop/productDetails/SingleProduct";
import Login from "../components/Login";
import Register from "../components/Register";
import PaymentSuccess from "../components/PaymentSuccess";
import TimelineStep from "../components/TimelineStep";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import PrivateRoute from "../routers/PrivateRoute";


const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/categories/:categoryName",
        element: <CategoryPage />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/shop",
        element: <ShopPage />,
      },
      {
        path: "/shop/:id",
        element: <SingleProduct />,
      },
      {
        path: "/success",
        element: <PaymentSuccess />,
      },
      {
        path: "/timeline",
        element: <TimelineStep />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
  // Admin Stats Dashboard
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      // user route
      {
        path: "",
        element: <div>User Dashboard</div>,
      },
      {
        path: "orders",
        element: <div>User Orders</div>,
      },
      {
        path: "payments",
        element: <div>User Payments</div>,
      },
      {
        path: "profile",
        element: <div>User Profile</div>,
      },
      {
        path: "reviews",
        element: <div>User Reviews</div>,
      },

      // admin route
      {
        path: "admin",
        element: <PrivateRoute role="admin"><div>Admin Dashboard</div></PrivateRoute>,
      },
      {
        path: "add-new-post",
        element: <PrivateRoute role="admin"><div>Add New Post</div></PrivateRoute>,
      },
      {
        path: "manage-products",
        element: <PrivateRoute role="admin"><div>Manage Products</div></PrivateRoute>,
      },
      {
        path: "update-product/:id",
        element: <PrivateRoute role="admin"><div>Update Product</div></PrivateRoute>,
      },
      {
        path: "users",
        element: <PrivateRoute role="admin"><div>Manage All User</div></PrivateRoute>,
      },
      {
        path: "manage-orders",
        element: <PrivateRoute role="admin"><div>Manage Orders</div></PrivateRoute>,
      },
    ],
  },
]);

export default Router;