// src/app/routes/Routes.tsx
import { createBrowserRouter } from "react-router-dom";
import AboutPage from "../../features/about/AboutPage";
import Catalog from "../../features/catalog/Catalogs";
import ProductDetails from "../../features/catalog/ProductDetails";
import HomePage from "../../features/home/HomePage";
import ContactPage from "../../features/contact/ContactPage"; // ✅ 이게 정답
import App from "../layout/App";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import RequireAuth from "./RequireAuth";
import CheckoutSuccess from "../../features/checkout/CheckoutSuccess";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {element: <RequireAuth />, children:[
        { path: "checkout", element: <CheckoutPage /> },
        { path: "checkout/success", element: <CheckoutSuccess /> },

      ]}, // index 속성 사용법
      { path: "", element: <HomePage /> },
      { path: "catalog", element: <Catalog /> },
      { path: "catalog/:id", element: <ProductDetails /> },
      { path: "about", element: <AboutPage /> },
      { path: "basket", element: <BasketPage /> },
      { path: "login", element: <LoginForm /> },
      { path: "register", element: <RegisterForm /> },
      { path: "contact", element: <ContactPage /> }, // ✅
      { path: 'server-error', element: <ServerError /> },
      
      { path: 'not-found', element: <NotFound /> },     // ✅ 추가

    ],
  },
]);