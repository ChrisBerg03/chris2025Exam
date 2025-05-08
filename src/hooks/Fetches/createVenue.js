import { venueList } from "../../utility/constants";

export async function createVenue(data) {
    const rawUser = localStorage.getItem("user");
    const token = JSON.parse(rawUser)?.token;
    if (!token) throw new Error("User is not authenticated");
    console.log(data);

    const response = await fetch(venueList, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
        },

        body: JSON.stringify(data),
    });
    console.log(data);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create venue");
    }

    return response.json();
}
