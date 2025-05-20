import { venueList } from "../../utility/constants.js";

async function fetchVenueList(page = 1, query = "", sortOrder = "asc") {
    const params = new URLSearchParams({ limit: 40, page, sortOrder });

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
            throw new Error(
                `Failed to fetch venues (status ${response.status})`
            );
        }

        const json = await response.json();
        console.log(json.data);
        return json.data;
    } catch (error) {
        console.error("Error fetching venue list:", error.message);
        throw error;
    }
}

export default fetchVenueList;
