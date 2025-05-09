import { profileUrl } from "../../utility/constants.js";

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
            throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log(data.data);

        return data.data;
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        throw error;
    }
}

export default fetchProfile;
