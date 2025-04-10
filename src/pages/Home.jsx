import { useEffect, useState } from "react";
import fetchVenueList from "../hooks/Fetches/VenueList";

export function Home() {
    const [venues, setVenues] = useState([]);

    useEffect(() => {
        fetchVenueList().then((data) => {
            setVenues(data);
        });
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Venue List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {venues.map((venue) => (
                    <div
                        key={venue.id}
                        className="border p-4 rounded shadow-md bg-white"
                    >
                        <h2 className="text-xl font-semibold">{venue.name}</h2>
                        <p className="text-gray-600">{venue.description}</p>
                        <div className="mt-2">
                            <h3 className="font-medium">Media:</h3>
                            <div className="flex gap-2 overflow-x-auto">
                                {venue.media.map((media, index) => (
                                    <img
                                        key={index}
                                        src={
                                            media?.url &&
                                            media.url.trim() !== ""
                                                ? media.url
                                                : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                                        }
                                        alt={media?.alt || "Placeholder image"}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="mt-2">
                            <strong>Price:</strong> ${venue.price}
                        </p>
                        <p>
                            <strong>Max Guests:</strong> {venue.maxGuests}
                        </p>
                        <p>
                            <strong>Rating:</strong> {venue.rating} / 5
                        </p>
                        <p className="mt-2">
                            <strong>Location:</strong> {venue.location.address},{" "}
                            {venue.location.city}, {venue.location.country}
                        </p>
                        <p>
                            <strong>Bookings:</strong> {venue._count.bookings}
                        </p>
                        <p className="mt-2">
                            <strong>Meta:</strong> {venue.meta.wifi && "WiFi, "}
                            {venue.meta.parking && "Parking, "}
                            {venue.meta.breakfast && "Breakfast, "}
                            {venue.meta.pets && "Pets Allowed"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
