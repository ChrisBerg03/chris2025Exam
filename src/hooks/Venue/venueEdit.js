import { venueList } from "../../utility/constants";

export const updateVenue = async (id, data) => {
    const rawUser = localStorage.getItem("user");
    const token = JSON.parse(rawUser)?.token;
    if (!token) throw new Error("User is not authenticated");

    const response = await fetch(`${venueList}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update venue");
    }
    return response.json();
};
