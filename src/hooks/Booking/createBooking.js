import { bookingUrl } from "../../utility/constants";
import { toast } from "react-toastify";

async function createBooking({ dateFrom, dateTo, guests, venueId }) {
    try {
        const rawUser = localStorage.getItem("user");
        const token = JSON.parse(rawUser)?.token;

        const response = await fetch(bookingUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
            },
            body: JSON.stringify({
                dateFrom,
                dateTo,
                guests,
                venueId,
            }),
        });

        if (!response.ok) {
            toast.error(
                "booking failed, please check the details and try again"
            );

            throw new Error("Failed to create booking");
        }

        const data = await response.json();
        toast.success("Booking was successful!");

        return data;
    } catch (error) {
        throw error;
    }
}

export default createBooking;
