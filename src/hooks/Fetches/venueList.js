import { venueList } from "../../utility/constants.js";

async function fetchVenueList() {
    try {
        const response = await fetch(venueList)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);

                return data.data;
            });
        return response;
    } catch (error) {}
}

export default fetchVenueList;
