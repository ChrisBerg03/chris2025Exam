import { useEffect, useState } from "react";
import fetchVenueList from "../hooks/Fetches/VenueList";
import MainCard from "../components/Cards/MainCard";

export function Home() {
    const [venues, setVenues] = useState([]);

    useEffect(() => {
        fetchVenueList().then((data) => {
            setVenues(data);
        });
    }, []);

    return (
        <div>
            <div>
                display some pre made cities or countries here for filtering!!!
            </div>
            <div className="flex flex-wrap justify-center items-center gap-5">
                {venues.map((venue) => (
                    <MainCard key={venue.id} venue={venue} />
                ))}
            </div>
        </div>
    );
}
