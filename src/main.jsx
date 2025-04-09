import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout/Index.jsx";
import { Home } from "./pages/Home.jsx";
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
                path: "venues",
                // element: <Home />,
            },
            {
                path: "venues/:venueId",
                // element: <Home />,
            },
            {
                path: "profile/:userId",
                // element: <Home />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={routes} />
    </StrictMode>
);
