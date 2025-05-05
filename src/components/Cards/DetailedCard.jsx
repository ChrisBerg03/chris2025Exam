import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import {
    Wifi,
    CircleParking,
    Utensils,
    PawPrint,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Star,
    Users,
    Calendar,
} from "lucide-react";

const DetailedCard = ({ venue, onBook }) => {
    const [range, setRange] = useState([null, null]);
    const [start, end] = range;
    const [thumbIndex, setThumbIndex] = useState(0);

    const bookedDates = useMemo(() => {
        const dates = [];
        venue.bookings.forEach(({ dateFrom, dateTo }) => {
            const curr = new Date(dateFrom);
            const last = new Date(dateTo);
            while (curr <= last) {
                dates.push(new Date(curr));
                curr.setDate(curr.getDate() + 1);
            }
        });
        return dates;
    }, [venue.bookings]);

    const bookingRanges = useMemo(
        () =>
            venue.bookings.map(({ dateFrom, dateTo }) => ({
                from: new Date(dateFrom),
                to: new Date(dateTo),
            })),
        [venue.bookings]
    );

    const nextThumb = () => setThumbIndex((i) => (i + 1) % venue.media.length);
    const prevThumb = () =>
        setThumbIndex((i) => (i - 1 + venue.media.length) % venue.media.length);

    const hasOverlap = (start, end) =>
        bookingRanges.some(({ from, to }) => start <= to && end >= from);

    if (hasOverlap(start, end)) {
        alert(
            "The dates you selected are already booked. Please select different dates."
        );
        setRange([null, null]);
        return;
    }

    const confirmBooking = () => {
        if (!start || !end) {
            alert("Select both start and end dates");
            return;
        }
        onBook(venue.id, { startDate: start, endDate: end });
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
            <div className="relative h-64 bg-gray-100 flex-shrink-0">
                <img
                    src={venue.media[thumbIndex]?.url}
                    alt={venue.media[thumbIndex]?.alt}
                    className="object-cover w-full h-full"
                />
                <button
                    onClick={prevThumb}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 cursor-pointer"
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={nextThumb}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 cursor-pointer"
                >
                    <ChevronRight />
                </button>
            </div>

            <div className="p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {venue.name}
                    </h2>
                    <div className="flex items-center text-yellow-500">
                        <Star className="mr-1" />
                        {venue.rating.toFixed(1)}
                    </div>
                </div>

                <p className="text-gray-600">{venue.description}</p>

                <div className="flex flex-wrap gap-6 text-gray-700">
                    <div className="flex items-center gap-2">
                        <Calendar />
                        <span>${venue.price} / night</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users />
                        <span>Up to {venue.maxGuests} guests</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 text-gray-700">
                    {venue.meta.wifi && (
                        <div className="flex items-center gap-1">
                            <Wifi className="text-gray-500" />
                            <span>WiFi</span>
                        </div>
                    )}
                    {venue.meta.parking && (
                        <div className="flex items-center gap-1">
                            <CircleParking className="text-gray-500" />
                            <span>Parking</span>
                        </div>
                    )}
                    {venue.meta.breakfast && (
                        <div className="flex items-center gap-1">
                            <Utensils className="text-gray-500" />
                            <span>Breakfast</span>
                        </div>
                    )}
                    {venue.meta.pets && (
                        <div className="flex items-center gap-1">
                            <PawPrint className="text-gray-500" />
                            <span>Pets Allowed</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <DatePicker
                        selectsRange
                        startDate={start}
                        endDate={end}
                        onChange={(update) => setRange(update)}
                        minDate={new Date()}
                        inline
                        excludeDates={bookedDates}
                        dayClassName={(date) =>
                            bookedDates.some(
                                (d) =>
                                    d.getFullYear() === date.getFullYear() &&
                                    d.getMonth() === date.getMonth() &&
                                    d.getDate() === date.getDate()
                            )
                                ? "booked-day"
                                : undefined
                        }
                    />

                    <button
                        onClick={confirmBooking}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
                    >
                        Book Now
                    </button>
                </div>
                <Link
                    to={`/profile/${venue.owner.name}`}
                    className="flex items-center gap-4"
                >
                    <img
                        src={venue.owner.avatar.url}
                        alt={venue.owner.avatar.alt}
                        className="rounded-full w-16 h-16 mb-4 object-cover"
                    />
                    <h3>{venue.owner.name}</h3>
                </Link>
                <div>
                    <h3 className="flex items-center gap-2 text-gray-800 font-semibold mb-2">
                        <MapPin /> Location
                    </h3>
                    <p className="text-gray-600">
                        {venue.location.address}, {venue.location.city},{" "}
                        {venue.location.country}
                    </p>
                    <div className="mt-2 w-full h-48">
                        <iframe
                            width="100%"
                            height="200"
                            allowFullScreen
                            loading="lazy"
                            src={`https://www.google.com/maps?q=${venue.location.city},${venue.location.address}&z=14&output=embed`}
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailedCard;
