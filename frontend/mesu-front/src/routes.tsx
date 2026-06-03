import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Marketplace } from "./pages/Marketplace";
import { AccountSettings } from "./pages/AccountSettings";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ClientDashboard } from "./pages/ClientDashboard";
import { CreateProduct } from "./pages/CreateProduct";
import { NotFound } from "./pages/NotFound";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { ProductDetail } from "./pages/ProductDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: Login },
      {path: "register", Component: Register },
      {path: "marketplace", Component: Marketplace },
      {path: "accountsettings", Component: AccountSettings},
      {path: "admindashboard", Component: AdminDashboard},
      {path: "clientdashboard", Component: ClientDashboard},
      {path: "createproduct", Component: CreateProduct},
      {path: "owner-dashboard", Component: OwnerDashboard},
      {path: "product-detail", Component: ProductDetail},
      {path: "*", Component: NotFound}
    ],
  },
]);
