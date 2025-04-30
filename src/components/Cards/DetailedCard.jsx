import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Wifi,
    CircleParking,
    Utensils,
    PawPrint,
    ArrowLeft,
    ArrowRight,
    MapPinned,
} from "lucide-react";

function DetailedCard({ venue, onBook }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

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

    const handleConfirm = () => {
        if (!startDate || !endDate) {
            alert("Please select both a start and end date before confirming.");
            return;
        }
        onBook(venue.id, { startDate, endDate });
    };

    return (
        <div className="border rounded-lg shadow-lg bg-white p-6 max-w-4xl mx-auto">
            <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                    src={
                        venue.media[currentImageIndex]?.url?.trim() ||
                        "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                    }
                    alt={
                        venue.media[currentImageIndex]?.alt ||
                        "Placeholder image"
                    }
                    className="w-full h-64 object-cover"
                />
                <button
                    onClick={handlePrevImage}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700"
                >
                    <ArrowLeft />
                </button>
                <button
                    onClick={handleNextImage}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700"
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

            <div className="flex justify-between">
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
                                <CircleParking className="text-gray-500" />{" "}
                                Parking
                            </span>
                        )}
                        {venue.meta.breakfast && (
                            <span className="flex items-center gap-1 text-sm">
                                <Utensils className="text-gray-500" /> Breakfast
                            </span>
                        )}
                        {venue.meta.pets && (
                            <span className="flex items-center gap-1 text-sm">
                                <PawPrint className="text-gray-500" /> Pets
                                Allowed
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-gray-700">
                        <h3 className="text-lg font-semibold mb-2">
                            Select Booking Dates
                        </h3>
                        <DatePicker
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => setDateRange(update)}
                            minDate={new Date()}
                            placeholderText="Select a start and end date"
                            className="border p-2 rounded w-full"
                            inline
                        />
                    </div>

                    <button
                        onClick={handleConfirm}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-300 cursor-pointer"
                    >
                        Confirm Booking
                    </button>
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
