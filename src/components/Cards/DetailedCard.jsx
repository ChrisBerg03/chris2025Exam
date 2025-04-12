import {
    Wifi,
    CircleParking,
    Utensils,
    PawPrint,
    ArrowLeft,
    ArrowRight,
    MapPinned,
} from "lucide-react";
import { useState } from "react";

function DetailedCard({ venue }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === venue.media.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? venue.media.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="border rounded-lg shadow-lg bg-white p-6 max-w-4xl mx-auto">
            <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                    src={
                        venue.media[currentImageIndex]?.url &&
                        venue.media[currentImageIndex].url.trim() !== ""
                            ? venue.media[currentImageIndex].url
                            : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                    }
                    alt={
                        venue.media[currentImageIndex]?.alt ||
                        "Placeholder image"
                    }
                    className="w-full h-64 object-cover"
                />
                <button
                    onClick={handlePrevImage}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 cursor-pointer"
                >
                    <ArrowLeft />
                </button>

                <button
                    onClick={handleNextImage}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 cursor-pointer"
                >
                    <ArrowRight />
                </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {venue.name}
            </h1>
            <p className="text-gray-600 mb-4">
                {venue.description || "No description available."}
            </p>

            <div className="flex justify-between items-center text-gray-700 mb-4">
                <p>
                    <strong>Price:</strong> ${venue.price}
                </p>
                <p>
                    <strong>Max Guests:</strong> {venue.maxGuests}
                </p>
                <p>
                    <strong>Rating:</strong> {venue.rating} / 5
                </p>
            </div>

            <div className="text-gray-700 mb-4">
                <p className="font-bold flex items-center gap-1">
                    <MapPinned /> Location:
                </p>
                <p>
                    {venue.location.address}, {venue.location.city},{" "}
                    {venue.location.country}
                </p>
            </div>

            <p className="text-gray-700 mb-4">
                <strong>Bookings:</strong> {venue._count.bookings}
            </p>

            <div className="text-gray-700 mb-4">
                <h3 className="text-lg font-semibold mb-2">Facilities</h3>
                <div className="flex flex-wrap gap-4">
                    {venue.meta.wifi && (
                        <span className="flex items-center gap-1 text-sm">
                            <Wifi className="text-gray-500" /> WiFi
                        </span>
                    )}
                    {venue.meta.parking && (
                        <span className="flex items-center gap-1 text-sm">
                            <CircleParking className="text-gray-500" /> Parking
                        </span>
                    )}
                    {venue.meta.breakfast && (
                        <span className="flex items-center gap-1 text-sm">
                            <Utensils className="text-gray-500" /> Breakfast
                        </span>
                    )}
                    {venue.meta.pets && (
                        <span className="flex items-center gap-1 text-sm">
                            <PawPrint className="text-gray-500" /> Pets Allowed
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Location Map</h3>
                <iframe
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${venue.location.lat},${venue.location.lng}&z=14&output=embed`}
                ></iframe>
            </div>
        </div>
    );
}

export default DetailedCard;
