import { venueDetails } from "../../utility/constants.js";

async function fetchVenueDetails(id) {
    try {
        const response = await fetch(`${venueDetails}/${id}?_owner=true`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);

                return data.data;
            });
        return response;
    } catch (error) {}
}

export default fetchVenueDetails;
