import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout/Index.jsx";
import { Home } from "./pages/Home.jsx";
import { VenueDetails } from "./pages/VenueDetail.jsx";
import { Auth } from "./pages/auth/Auth.jsx";
import "./App.css";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "venues/:id",
                element: <VenueDetails />,
            },
            {
                path: "profile/:id",
                // element: <Home />,
            },
            {
                path: "auth",
                element: <Auth />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={routes} />
    </StrictMode>
);
