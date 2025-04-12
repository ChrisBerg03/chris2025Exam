import { Wifi, CircleParking, Utensils, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";

function MainCard({ venue }) {
    return (
        <Link
            to={`/venues/${venue.id}`}
            className="border border-gray-200 rounded-lg shadow-sm bg-white p-4 w-full max-w-sm h-96 flex flex-col"
        >
            <div className="rounded-lg overflow-hidden mb-3">
                <img
                    src={
                        venue.media[0]?.url && venue.media[0].url.trim() !== ""
                            ? venue.media[0].url
                            : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                    }
                    alt={venue.media[0]?.alt || "Placeholder image"}
                    className="w-full h-40 object-cover"
                />
            </div>

            <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 mb-1 truncate">
                    {venue.name}
                </h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {venue.description}
                </p>
                <div className="flex justify-between items-center text-gray-700 text-xs mb-2">
                    <p>
                        <strong>Price:</strong> ${venue.price}
                    </p>
                    <p>
                        <strong>Max Guests:</strong> {venue.maxGuests}
                    </p>
                </div>
                <div className="flex justify-between items-center text-gray-700 text-xs mb-2">
                    <p>
                        <strong>Rating:</strong> {venue.rating} / 5
                    </p>
                    <p>
                        <strong>Bookings:</strong> {venue._count.bookings}
                    </p>
                </div>
                <div className="text-gray-700 text-xs mb-2">
                    <p className="font-bold">Location:</p>{" "}
                    {venue.location.address}, {venue.location.city},{" "}
                    {venue.location.country}
                </div>
            </div>

            <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                    Facilities
                </h3>
                <div className="flex flex-wrap gap-2">
                    {venue.meta.wifi && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Wifi className="text-gray-500" /> WiFi
                        </span>
                    )}
                    {venue.meta.parking && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                            <CircleParking className="text-gray-500" /> Parking
                        </span>
                    )}
                    {venue.meta.breakfast && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Utensils className="text-gray-500" /> Breakfast
                        </span>
                    )}
                    {venue.meta.pets && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                            <PawPrint className="text-gray-500" /> Pets Allowed
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default MainCard;
