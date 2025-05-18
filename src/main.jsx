import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout/Index.jsx";
import { UserProvider } from "./utility/UserContext.jsx";
import { Home } from "./pages/Home.jsx";
import { VenueDetails } from "./pages/VenueDetail.jsx";
import { Auth } from "./pages/auth/Auth.jsx";
import { Profile } from "./pages/Profile.jsx";
import { CreateVenue } from "./pages/CreateVenue.jsx";
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
                path: "venues/createVenue",
                element: <CreateVenue />,
            },
            {
                path: "profile/:id",
                element: <Profile />,
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
        <UserProvider>
            <RouterProvider router={routes} />
        </UserProvider>
    </StrictMode>
);
