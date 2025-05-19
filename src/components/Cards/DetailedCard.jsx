import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { updateVenue as updateVenueFetch } from "../../hooks/Fetches/venueEdit";
import { deleteVenue } from "../../hooks/Fetches/venueDelete";
import createBooking from "../../hooks/Booking/createBooking";
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
    Edit3,
    Trash2,
} from "lucide-react";

const DetailedCard = ({ venue }) => {
    const rawUser = localStorage.getItem("user");
    const currentUserName = JSON.parse(rawUser || "{}").name;
    const token = JSON.parse(rawUser || "{}").token;
    const isOwner = currentUserName === venue.owner.name;
    const [range, setRange] = useState([null, null]);
    const [start, end] = range;
    const [thumbIndex, setThumbIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [guests, setGuests] = useState(1);
    const navigate = useNavigate();

    const [editData, setEditData] = useState({
        name: venue.name,
        description: venue.description,
        price: venue.price,
        maxGuests: venue.maxGuests,
        rating: venue.rating,
        media: venue.media.map((m) => ({ url: m.url, alt: m.alt })),
        meta: { ...venue.meta },
        location: { ...venue.location },
    });

    const startEdit = () => {
        setEditData({
            name: venue.name,
            description: venue.description,
            price: venue.price,
            maxGuests: venue.maxGuests,
            rating: venue.rating,
            media: venue.media.map((m) => ({ url: m.url, alt: m.alt })),
            meta: { ...venue.meta },
            location: { ...venue.location },
        });
        setIsEditing(true);
    };

    const confirmEdit = async () => {
        const payload = {
            name: editData.name,
            description: editData.description,
            media: editData.media,
            price: Number(editData.price),
            maxGuests: Number(editData.maxGuests),
            rating: Math.min(5, Math.max(0, Number(editData.rating))),
            meta: { ...editData.meta },
            location: {
                ...editData.location,
                lat: Number(editData.location.lat),
                lng: Number(editData.location.lng),
            },
        };
        try {
            await updateVenueFetch(venue.id, payload);
            window.location.reload();
        } catch (err) {
            setError("Update failed: " + err.message);
        }
    };

    const handleDelete = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this venue? This action cannot be undone."
            )
        ) {
            return;
        }
        try {
            await deleteVenue(venue.id);
            setSuccessMessage("Venue deleted successfully");
            setError(null);
            setTimeout(() => {
                navigate(`/profile/${currentUserName}`);
            }, 2000);
        } catch (err) {
            setError("Failed to delete venue: " + err.message);
            setSuccessMessage(null);
        }
    };

    const handleChange = (field, value) => {
        if (field === "price" || field === "maxGuests") {
            if (value < 0) return;
        }
        if (field === "rating" && (value < 0 || value > 5)) return;
        setEditData((d) => ({ ...d, [field]: value }));
    };

    const handleMetaChange = (key) =>
        setEditData((d) => ({
            ...d,
            meta: { ...d.meta, [key]: !d.meta[key] },
        }));

    const handleLocationChange = (field, value) =>
        setEditData((d) => ({
            ...d,
            location: { ...d.location, [field]: value },
        }));

    const handleMediaChange = (i, key, value) => {
        const m = [...editData.media];
        m[i][key] = value;
        setEditData((d) => ({ ...d, media: m }));
    };

    const addMediaItem = () =>
        setEditData((d) => ({
            ...d,
            media: [...d.media, { url: "", alt: "" }],
        }));

    const removeMediaItem = (i) =>
        setEditData((d) => ({
            ...d,
            media: d.media.filter((_, idx) => idx !== i),
        }));

    const bookedDates = useMemo(() => {
        const dates = [];
        venue.bookings.forEach(({ dateFrom, dateTo }) => {
            const curr = new Date(dateFrom);
            curr.setHours(0, 0, 0, 0);
            const last = new Date(dateTo);
            last.setHours(0, 0, 0, 0);
            while (curr <= last) {
                dates.push(new Date(curr));
                curr.setDate(curr.getDate() + 1);
            }
        });
        return dates;
    }, [venue.bookings]);

    const bookingRanges = useMemo(
        () =>
            venue.bookings.map((b) => ({
                from: new Date(b.dateFrom),
                to: new Date(b.dateTo),
            })),
        [venue.bookings]
    );

    // Compute upcoming bookings
    const upcomingBookings = useMemo(() => {
        return venue.bookings
            .filter((booking) => new Date(booking.dateFrom) >= new Date())
            .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }, [venue.bookings]);

    const hasOverlap = (s, e) =>
        bookingRanges.some(({ from, to }) => s <= to && e >= from);

    const confirmBooking = async () => {
        setError(null);
        setSuccessMessage(null);
        if (!start || !end) {
            setError("Select both start and end dates");
            return;
        }
        if (hasOverlap(start, end)) {
            setError("Selected dates overlap with existing bookings");
            return;
        }
        if (isOwner) {
            setError("You cannot book your own venue.");
            return;
        }
        if (guests < 1 || guests > venue.maxGuests) {
            setError(`Guests must be between 1 and ${venue.maxGuests}`);
            return;
        }
        try {
            await createBooking({
                dateFrom: start.toISOString(),
                dateTo: end.toISOString(),
                guests: Number(guests),
                venueId: venue.id,
            });
            setSuccessMessage("Booking successful!");
            setTimeout(() => {
                navigate(`/profile/${currentUserName}`);
            }, 2000);
        } catch (err) {
            setError("Booking failed: " + err.message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white border border-gray-200">
            <div className="relative h-80 bg-gray-100">
                <img
                    src={venue.media[thumbIndex]?.url}
                    alt={venue.media[thumbIndex]?.alt || venue.name}
                    className="object-cover w-full h-full"
                />
                <button
                    onClick={() =>
                        setThumbIndex(
                            (i) =>
                                (i - 1 + venue.media.length) %
                                venue.media.length
                        )
                    }
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1.5 border border-gray-200 hover:bg-gray-100 cursor-pointer"
                    aria-label="Previous image"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={() =>
                        setThumbIndex((i) => (i + 1) % venue.media.length)
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1.5 border border-gray-200 hover:bg-gray-100 cursor-pointer"
                    aria-label="Next image"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="p-6 flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                className="text-2xl font-semibold border-b border-gray-200 focus:outline-none focus:border-gray-400"
                            />
                        ) : (
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {venue.name}
                            </h2>
                        )}
                        <div className="flex items-center text-yellow-500">
                            <Star size={18} className="mr-1" />
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={editData.rating}
                                    onChange={(e) =>
                                        handleChange("rating", e.target.value)
                                    }
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    className="w-16 border-b border-gray-200 focus:outline-none focus:border-gray-400"
                                />
                            ) : (
                                <span className="text-gray-800">
                                    {venue.rating.toFixed(1)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} />
                            <span>
                                $
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editData.price}
                                        onChange={(e) =>
                                            handleChange(
                                                "price",
                                                e.target.value
                                            )
                                        }
                                        min="0"
                                        className="w-16 border-b border-gray-200 focus:outline-none focus:border-gray-400"
                                    />
                                ) : (
                                    venue.price
                                )}{" "}
                                / night
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users size={16} />
                            <span>
                                Up to{" "}
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editData.maxGuests}
                                        onChange={(e) =>
                                            handleChange(
                                                "maxGuests",
                                                e.target.value
                                            )
                                        }
                                        min="1"
                                        className="w-16 border-b border-gray-200 focus:outline-none focus:border-gray-400"
                                    />
                                ) : (
                                    venue.maxGuests
                                )}{" "}
                                guests
                            </span>
                        </div>
                    </div>

                    {!isEditing && (
                        <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                            {venue.meta.wifi && (
                                <div className="flex items-center gap-1">
                                    <Wifi size={16} /> Wifi
                                </div>
                            )}
                            {venue.meta.parking && (
                                <div className="flex items-center gap-1">
                                    <CircleParking size={16} /> Parking
                                </div>
                            )}
                            {venue.meta.breakfast && (
                                <div className="flex items-center gap-1">
                                    <Utensils size={16} /> Breakfast
                                </div>
                            )}
                            {venue.meta.pets && (
                                <div className="flex items-center gap-1">
                                    <PawPrint size={16} /> Pets
                                </div>
                            )}
                        </div>
                    )}

                    {isEditing ? (
                        <textarea
                            value={editData.description}
                            onChange={(e) =>
                                handleChange("description", e.target.value)
                            }
                            className="w-full h-24 border border-gray-200 p-3 text-gray-700 focus:outline-none focus:border-gray-400"
                        />
                    ) : (
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {venue.description}
                        </p>
                    )}

                    {isEditing && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">
                                Media
                            </h3>
                            {editData.media.map((m, i) => (
                                <div
                                    key={i}
                                    className="flex gap-2 items-center"
                                >
                                    <input
                                        placeholder="Image URL"
                                        value={m.url}
                                        onChange={(e) =>
                                            handleMediaChange(
                                                i,
                                                "url",
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                    <input
                                        placeholder="Alt text"
                                        value={m.alt}
                                        onChange={(e) =>
                                            handleMediaChange(
                                                i,
                                                "alt",
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                    <button
                                        onClick={() => removeMediaItem(i)}
                                        className="text-red-500 text-sm hover:text-red-600 cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addMediaItem}
                                className="text-blue-500 text-sm hover:text-blue-600 cursor-pointer"
                            >
                                Add Image
                            </button>
                        </div>
                    )}

                    {isEditing && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">
                                Amenities
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {Object.keys(editData.meta).map((key) => (
                                    <label
                                        key={key}
                                        className="flex items-center gap-1 text-sm text-gray-600"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={editData.meta[key]}
                                            onChange={() =>
                                                handleMetaChange(key)
                                            }
                                        />
                                        <span className="capitalize">
                                            {key}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {isEditing ? (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">
                                Location
                            </h3>
                            {Object.entries(editData.location).map(([f, v]) => (
                                <div key={f} className="flex flex-col">
                                    <label className="text-xs capitalize text-gray-600">
                                        {f}
                                    </label>
                                    <input
                                        type={
                                            f === "lat" || f === "lng"
                                                ? "number"
                                                : "text"
                                        }
                                        value={v}
                                        onChange={(e) =>
                                            handleLocationChange(
                                                f,
                                                e.target.value
                                            )
                                        }
                                        className="border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin size={16} className="mt-0.5" />
                            <p>
                                {venue.location.address}, {venue.location.city},{" "}
                                {venue.location.country}
                            </p>
                        </div>
                    )}

                    <div className="mt-4 rounded-md overflow-hidden">
                        <iframe
                            title="Venue Location"
                            width="100%"
                            height="200"
                            loading="lazy"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                                `${venue.location.address}, ${venue.location.city}`
                            )}&z=14&output=embed`}
                        />
                    </div>

                    {/* Bookings Section */}
                    {isOwner && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Upcoming Bookings
                            </h3>
                            {upcomingBookings.length > 0 ? (
                                upcomingBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="p-4 border border-gray-200 mt-2"
                                    >
                                        <p>
                                            <strong>From:</strong>{" "}
                                            {new Date(
                                                booking.dateFrom
                                            ).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>To:</strong>{" "}
                                            {new Date(
                                                booking.dateTo
                                            ).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>Guests:</strong>{" "}
                                            {booking.guests}
                                        </p>
                                        <p>
                                            <strong>Booked by:</strong>{" "}
                                            {booking.customer.name}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">
                                    No upcoming bookings.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="w-full min-w-60 max-w-60 lg:w-80 space-y-6">
                    <div className="space-y-4 flex flex-col">
                        <DatePicker
                            selectsRange
                            startDate={start}
                            endDate={end}
                            onChange={setRange}
                            minDate={new Date()}
                            inline
                            excludeDates={bookedDates}
                            className="border border-gray-200 w-full max-w-60"
                        />
                        {token && (
                            <div>
                                <label
                                    className="block text-sm text-gray-700 mb-1"
                                    htmlFor="guests"
                                >
                                    Guests
                                </label>
                                <input
                                    id="guests"
                                    type="number"
                                    min={1}
                                    max={venue.maxGuests}
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    className="w-full border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400"
                                />
                                <span className="text-xs text-gray-500">
                                    Max guests: {venue.maxGuests}
                                </span>
                            </div>
                        )}

                        {!isOwner && token && (
                            <button
                                onClick={confirmBooking}
                                className="w-full max-w-60 bg-blue-500 text-white py-2 text-sm hover:bg-blue-600 transition cursor-pointer"
                                disabled={isOwner}
                                title={
                                    isOwner
                                        ? "You cannot book your own venue"
                                        : ""
                                }
                            >
                                Book Now
                            </button>
                        )}
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                    {successMessage && (
                        <div className="text-green-500 text-sm">
                            {successMessage}
                        </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={confirmEdit}
                                    className="flex-1 bg-green-500 text-white py-2 text-sm hover:bg-green-600 transition cursor-pointer"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-gray-500 text-white py-2 text-sm hover:bg-gray-600 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full max-w-60 bg-red-500 text-white py-2 text-sm hover:bg-red-600 transition flex items-center justify-center gap-2 cursor-pointer"
                                    aria-label="Delete venue"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </>
                        ) : (
                            isOwner && (
                                <button
                                    onClick={startEdit}
                                    className="w-full max-w-60 bg-blue-500 text-white py-2 text-sm hover:bg-blue-600 transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Edit3 size={16} /> Edit
                                </button>
                            )
                        )}
                    </div>
                    {token ? (
                        <Link
                            to={`/profile/${venue.owner.name}`}
                            className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900"
                        >
                            <img
                                src={venue.owner.avatar.url}
                                alt={`${venue.owner.name}'s avatar`}
                                className="rounded-full w-10 h-10 object-cover"
                            />
                            <span>{venue.owner.name}</span>
                        </Link>
                    ) : (
                        <div
                            className="flex items-center gap-3 text-sm text-gray-400 cursor-not-allowed"
                            aria-disabled="true"
                        >
                            <img
                                src={venue.owner.avatar.url}
                                alt={`${venue.owner.name}'s avatar`}
                                className="rounded-full w-10 h-10 object-cover opacity-50"
                            />
                            <span>{venue.owner.name}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailedCard;
