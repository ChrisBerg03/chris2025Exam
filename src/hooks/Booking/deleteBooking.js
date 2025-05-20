import { bookingUrl } from "../../utility/constants";
import { toast } from "react-toastify";

export default async function deleteBooking(bookingId) {
    const rawUser = localStorage.getItem("user");
    const token = JSON.parse(rawUser)?.token;
    if (!token) throw new Error("User is not authenticated");

    const response = await fetch(`${bookingUrl}/${bookingId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
        },
    });
    if (!response.ok) {
        toast.error(
            "Failed to delete booking, please make sure the booking exists"
        );

        throw new Error("Failed to delete booking");
    }
    toast.success("Booking delted successfully!");

    return true;
}
