import { venueList } from "../../utility/constants";
import { toast } from "react-toastify";

export async function deleteVenue(id) {
    const rawUser = localStorage.getItem("user");
    const token = JSON.parse(rawUser)?.token;
    if (!token) throw new Error("User is not authenticated");

    const response = await fetch(`${venueList}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
        },
    });

    if (!response.ok) {
        toast.error(
            "failed to delete venue, please make sure you have the right permissions"
        );

        throw new Error(errorMessage);
    }
    toast.success("Venue was deleted successfully!");

    return true;
}
