import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Marketplace } from "./pages/Marketplace";
import { AccountSettings } from "./pages/AccountSettings";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ClientDashboard } from "./pages/ClientDashboard";
import { NotFound } from "./pages/NotFound";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { ProductDetail } from "./pages/ProductDetail";
import { PublicacionInsumoForm } from "./pages/PublicacionInsumoForm";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "marketplace", Component: Marketplace },
      { path: "accountsettings", Component: AccountSettings },
      { path: "create-product", Component: PublicacionInsumoForm },
      { path: "admin-dashboard", Component: AdminDashboard },
      { path: "client-dashboard", Component: ClientDashboard },
      { path: "owner-dashboard", Component: OwnerDashboard },
      { path: "product/:id", Component: ProductDetail },
      { path: "publicacion-insumo/editar/:id", Component: PublicacionInsumoForm },
      { path: "*", Component: NotFound }
    ],
  },
]);
