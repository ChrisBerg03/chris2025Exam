import { venueList } from "../../utility/constants.js";

async function fetchVenueList(page = 1) {
    try {
        const response = await fetch(`${venueList}?limit=40&page=${page}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                return data.data;
            });
        return response;
    } catch (error) {
        console.error("Error fetching venue list:", error.message);
        throw error;
    }
}

export default fetchVenueList;
