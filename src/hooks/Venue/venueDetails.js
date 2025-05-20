import { venueDetails } from "../../utility/constants.js";
import { toast } from "react-toastify";

export async function fetchVenueDetails(id) {
    try {
        const response = await fetch(
            `${venueDetails}/${id}?_owner=true&_bookings=true`
        );

        if (!response.ok) {
            toast.error("Failed to fetch venue, please try again");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
            throw new Error("Failed to fetch venue");
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw error;
    }
}
