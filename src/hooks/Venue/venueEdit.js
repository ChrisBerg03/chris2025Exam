import { venueList } from "../../utility/constants";
import { toast } from "react-toastify";

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
        toast.error("Failed to update venue, please try again");
        throw new Error("Failed to update venue");
    }
    toast.success("Venue updated successfully!");

    return response.json();
};
