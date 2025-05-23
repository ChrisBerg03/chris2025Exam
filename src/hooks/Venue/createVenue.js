import { venueList } from "../../utility/constants";
import { toast } from "react-toastify";

export async function createVenue(data) {
    const rawUser = localStorage.getItem("user");
    const token = JSON.parse(rawUser)?.token;
    if (!token) throw new Error("User is not authenticated");

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
        toast.error("Failed to create venue");
        throw new Error("Failed to create venue");
    }

    toast.success("Venue was created successfully!");
    return response.json();
}
