import { bookingUrl } from "../../utility/constants";

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
            throw new Error("Failed to create booking");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }
}

export default createBooking;
