import { venueList } from "../../utility/constants.js";

function fetchVenueList() {
    try {
        const response = fetch(venueList)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);

                return data.data;
            });
        return response;
    } catch (error) {}
}

export default fetchVenueList;
