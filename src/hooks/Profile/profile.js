import { profileUrl } from "../../utility/constants.js";
import { toast } from "react-toastify";

async function fetchProfile(id) {
    try {
        const rawUser = localStorage.getItem("user");
        const token = JSON.parse(rawUser)?.token;

        const response = await fetch(
            `${profileUrl}/${id}?_venues=true&_bookings=true`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
                },
            }
        );

        if (!response.ok) {
            toast.error(
                "Failed to fetch profile, please try again. make sure you are logged in"
            );

            throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        return data.data;
    } catch (error) {
        throw error;
    }
}

export default fetchProfile;
