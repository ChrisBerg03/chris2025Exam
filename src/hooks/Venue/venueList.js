import { venueList } from "../../utility/constants.js";
import { toast } from "react-toastify";

export async function fetchVenueList(page = 1, query = "", sortOrder = "asc") {
    const params = new URLSearchParams({
        limit: 40,
        page,
        sortOrder,
        sort: "price",
    });

    let url;
    if (query.trim()) {
        params.set("q", query.trim());
        url = `${venueList}/search?${params.toString()}`;
    } else {
        url = `${venueList}?${params.toString()}`;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            toast.error("Failed to fetch venues, please try again");
            throw new Error(
                `Failed to fetch venues (status ${response.status})`
            );
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw error;
    }
}
