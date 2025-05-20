import { bookingUrl } from "../../utility/constants";
import { toast } from "react-toastify";

export default async function editBooking(bookingId, data) {
    const rawUser = localStorage.getItem("user");
    const token = JSON.parse(rawUser)?.token;
    if (!token) throw new Error("User is not authenticated");

    const response = await fetch(`${bookingUrl}/${bookingId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        toast.error(
            "Failed to update booking, please make sure the booking exists and that you have the right permissions"
        );

        throw new Error("Failed to update booking");
    }
    toast.success("Booking updated successfully!");

    return response.json();
}
