import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchVenueDetails from "../hooks/Fetches/venueDetails.js";
import DetailedCard from "../components/Cards/DetailedCard.jsx";

export function VenueDetails() {
    const [venue, setVenue] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchVenueDetails(id).then((data) => {
            setVenue(data);
        });
    }, [id]);

    return (
        <div className="p-4">
            {venue ? <DetailedCard venue={venue} /> : <p>Loading...</p>}
        </div>
    );
}
