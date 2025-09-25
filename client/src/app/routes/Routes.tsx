// src/app/routes/Routes.tsx
import { createBrowserRouter } from "react-router-dom";
import AboutPage from "../../features/about/AboutPage";
import Catalog from "../../features/catalog/Catalogs";
import ProductDetails from "../../features/catalog/ProductDetails";
import HomePage from "../../features/home/HomePage";
import ContactPage from "../../features/contact/ContactPage"; // Correct contact page module
import App from "../layout/App";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import RequireAuth from "./RequireAuth";
import CheckoutSuccess from "../../features/checkout/CheckoutSuccess";
import OrdersPage from "../../features/orders/OrdersPage";
import OrderDetailsPage from "../../features/orders/OrderDetailedPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {element: <RequireAuth />, children:[
        { path: "checkout", element: <CheckoutPage /> },
        { path: "checkout/success", element: <CheckoutSuccess /> },
        { path: "orders", element: <OrdersPage /> },
        { path: "orders/:id",      element: <OrderDetailsPage /> } // Use relative child route
      ]}, // Wrapper for routes that require authentication
      { path: "", element: <HomePage /> },
      { path: "catalog", element: <Catalog /> },
      { path: "catalog/:id", element: <ProductDetails /> },
      { path: "about", element: <AboutPage /> },
      { path: "basket", element: <BasketPage /> },
      { path: "login", element: <LoginForm /> },
      { path: "register", element: <RegisterForm /> },
      { path: "contact", element: <ContactPage /> }, // Contact page route
      { path: 'server-error', element: <ServerError /> },
      
      { path: 'not-found', element: <NotFound /> },     // Dedicated not-found route

    ],
  },
]);
