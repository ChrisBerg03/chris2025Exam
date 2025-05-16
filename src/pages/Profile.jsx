import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import fetchProfile from "../hooks/Profile/profile";
import { useContext } from "react";
import { UserContext } from "../utility/UserContext";
import { updateProfile } from "../hooks/Profile/profileEdit";
import { updateVenue } from "../hooks/Fetches/venueEdit";
import { deleteVenue } from "../hooks/Fetches/venueDelete";
import {
    Edit3,
    Trash2,
    Save,
    X,
    DollarSign,
    Users,
    FileText,
    Type,
} from "lucide-react";
import editBooking from "../hooks/Booking/editBooking.js";
import deleteBooking from "../hooks/Booking/deleteBooking.js";
import { useNavigate } from "react-router-dom";

export function Profile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const { setUser } = useContext(UserContext);
    const rawUser = localStorage.getItem("user");
    const currentUserName = JSON.parse(rawUser || "{}").name;
    const canEdit = currentUserName === id;

    const navigate = useNavigate();

    const [editingVenueId, setEditingVenueId] = useState(null);
    const [editVenueData, setEditVenueData] = useState(null);
    const [venueError, setVenueError] = useState(null);

    const startEditVenue = (venue) => {
        setEditingVenueId(venue.id);
        setEditVenueData({
            name: venue.name,
            description: venue.description,
            price: venue.price,
            maxGuests: venue.maxGuests,
            media: venue.media.map((m) => ({ url: m.url, alt: m.alt })),
            meta: { ...venue.meta },
            location: { ...venue.location },
        });
        setVenueError(null);
    };

    const saveEditVenue = async (venueId) => {
        setVenueError(null);
        if (!editVenueData.name.trim()) {
            setVenueError("Venue name cannot be empty.");
            return;
        }
        if (editVenueData.price < 0 || editVenueData.maxGuests < 1) {
            setVenueError("Invalid price or max guests.");
            return;
        }
        try {
            await updateVenue(venueId, {
                ...editVenueData,
                price: Number(editVenueData.price),
                maxGuests: Number(editVenueData.maxGuests),
            });
            fetchProfile(id).then((data) => setProfile(data));
            setEditingVenueId(null);
            setEditVenueData(null);
        } catch (err) {
            setVenueError("Failed to update venue.");
        }
    };

    const cancelEditVenue = () => {
        setEditingVenueId(null);
        setEditVenueData(null);
        setVenueError(null);
    };

    const [editingBookingId, setEditingBookingId] = useState(null);
    const [editBookingData, setEditBookingData] = useState({
        dateFrom: "",
        dateTo: "",
        guests: 1,
    });
    const [bookingError, setBookingError] = useState(null);

    const startEditBooking = (booking) => {
        setEditingBookingId(booking.id);
        setEditBookingData({
            dateFrom: booking.dateFrom.slice(0, 10),
            dateTo: booking.dateTo.slice(0, 10),
            guests: booking.guests,
        });
        setBookingError(null);
    };

    const cancelEditBooking = () => {
        setEditingBookingId(null);
        setBookingError(null);
    };

    const saveEditBooking = async (bookingId) => {
        setBookingError(null);
        if (!editBookingData.dateFrom || !editBookingData.dateTo) {
            setBookingError("Please select both dates.");
            return;
        }
        if (editBookingData.guests < 1) {
            setBookingError("Guests must be at least 1.");
            return;
        }
        try {
            await editBooking(bookingId, {
                dateFrom: new Date(editBookingData.dateFrom).toISOString(),
                dateTo: new Date(editBookingData.dateTo).toISOString(),
                guests: Number(editBookingData.guests),
            });
            // Refresh profile data
            fetchProfile(id).then((data) => setProfile(data));
            setEditingBookingId(null);
        } catch (err) {
            setBookingError("Failed to update booking.");
        }
    };

    const handleDeleteVenue = async (venueId) => {
        if (!window.confirm("Are you sure you want to delete this venue?"))
            return;
        try {
            await deleteVenue(venueId);
            // Refresh profile data
            fetchProfile(id).then((data) => setProfile(data));
        } catch (err) {
            alert("Failed to delete venue.");
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to delete this booking?"))
            return;
        try {
            await deleteBooking(bookingId);
            // Refresh profile data
            fetchProfile(id).then((data) => setProfile(data));
        } catch (err) {
            alert("Failed to delete booking.");
        }
    };

    useEffect(() => {
        if (!id) return;

        fetchProfile(id)
            .then((data) => {
                setProfile(data);
                setEditData({
                    bio: data.bio || "",
                    avatar: {
                        url: data.avatar?.url || "",
                        alt: data.avatar?.alt || "",
                    },
                    banner: {
                        url: data.banner?.url || "",
                        alt: data.banner?.alt || "",
                    },
                    venueManager: data.venueManager || false,
                });
            })
            .catch((err) => setError(err));
    }, [id]);

    const handleEditChange = (field, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setEditData((prev) => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value },
        }));
    };

    const confirmEdit = async () => {
        if (!editData.bio.trim()) {
            setError("Bio cannot be empty");
            return;
        }
        const payload = {
            bio: editData.bio,
            avatar: {
                url: editData.avatar.url || null,
                alt: editData.avatar.alt || "",
            },
            banner: {
                url: editData.banner.url || null,
                alt: editData.banner.alt || "",
            },
            venueManager: editData.venueManager,
        };

        try {
            await updateProfile(id, payload);
            setProfile((prev) => ({ ...prev, ...payload }));

            const rawUser = localStorage.getItem("user");
            const user = JSON.parse(rawUser || "{}");
            user.profilePic = payload.avatar.url || user.profilePic;
            user.venueManager = payload.venueManager;
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);

            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError("Failed to update profile: " + err.message);
        }
    };

    if (error)
        return (
            <div className="text-red-500 text-center p-4">
                Error loading profile: {error.message}
            </div>
        );
    if (!profile || !editData)
        return (
            <div className="text-gray-600 text-center p-4">
                Loading profile...
            </div>
        );

    const { name, email, venues, bookings } = profile;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white border border-gray-200">
            {isEditing ? (
                <div className="space-y-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Edit Profile
                    </h2>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">Bio</label>
                        <textarea
                            value={editData.bio}
                            onChange={(e) =>
                                handleEditChange("bio", e.target.value)
                            }
                            className="w-full h-24 border border-gray-200 p-3 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
                            placeholder="Tell us about yourself"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">
                            Avatar URL
                        </label>
                        <input
                            type="text"
                            value={editData.avatar.url}
                            onChange={(e) =>
                                handleNestedChange(
                                    "avatar",
                                    "url",
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400"
                            placeholder="https://url.com/avatar.jpg"
                        />
                        <label className="text-sm text-gray-600">
                            Avatar Alt Text
                        </label>
                        <input
                            type="text"
                            value={editData.avatar.alt}
                            onChange={(e) =>
                                handleNestedChange(
                                    "avatar",
                                    "alt",
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400"
                            placeholder="Avatar description"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">
                            Banner URL
                        </label>
                        <input
                            type="text"
                            value={editData.banner.url}
                            onChange={(e) =>
                                handleNestedChange(
                                    "banner",
                                    "url",
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400"
                            placeholder="https://url.com/banner.jpg"
                        />
                        <label className="text-sm text-gray-600">
                            Banner Alt Text
                        </label>
                        <input
                            type="text"
                            value={editData.banner.alt}
                            onChange={(e) =>
                                handleNestedChange(
                                    "banner",
                                    "alt",
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400"
                            placeholder="Banner description"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={editData.venueManager}
                            onChange={(e) =>
                                handleEditChange(
                                    "venueManager",
                                    e.target.checked
                                )
                            }
                            className="h-4 w-4"
                        />
                        <label className="text-sm text-gray-600">
                            Venue Manager
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={confirmEdit}
                            className="flex-1 bg-blue-500 text-white py-2 text-sm hover:bg-blue-600 transition cursor-pointer"
                            aria-label="Save profile changes"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 bg-gray-500 text-white py-2 text-sm hover:bg-gray-600 transition cursor-pointer"
                            aria-label="Cancel editing"
                        >
                            Cancel
                        </button>
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                </div>
            ) : (
                <>
                    {editData.banner?.url && (
                        <img
                            src={editData.banner.url}
                            alt={editData.banner.alt || "Banner image"}
                            className="w-full h-48 object-cover mb-6"
                        />
                    )}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            {editData.avatar?.url && (
                                <img
                                    src={editData.avatar.url}
                                    alt={editData.avatar.alt || "Avatar"}
                                    className="h-20 w-20 rounded-full mr-4 object-cover"
                                />
                            )}
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-800">
                                    {name}
                                </h1>
                                <p className="text-gray-600 text-sm">{email}</p>
                            </div>
                        </div>
                        {canEdit && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 text-white py-2 px-4 text-sm hover:bg-blue-600 transition flex items-center gap-2 cursor-pointer"
                                aria-label="Edit profile"
                            >
                                <Edit3 size={16} /> Edit
                            </button>
                        )}
                    </div>
                    {editData.bio && (
                        <p className="text-gray-600 text-sm mb-4">
                            {editData.bio}
                        </p>
                    )}
                    <p className="text-gray-600 text-sm mb-4">
                        <strong>Venue Manager:</strong>{" "}
                        {editData.venueManager ? "Yes" : "No"}
                    </p>
                </>
            )}

            {editData.venueManager && (
                <div className="flex flex-col gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        My Venues
                    </h2>
                    {venues && venues.length > 0 ? (
                        venues.map((venue) => (
                            <div
                                key={venue.id}
                                className="flex flex-col gap-2 p-4 bg-white border border-gray-200 hover:bg-gray-50"
                            >
                                {editingVenueId === venue.id ? (
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                            <Type size={16} /> Title
                                        </label>
                                        <input
                                            type="text"
                                            value={editVenueData.name}
                                            onChange={(e) =>
                                                setEditVenueData((d) => ({
                                                    ...d,
                                                    name: e.target.value,
                                                }))
                                            }
                                            className="border p-1 text-sm"
                                            placeholder="Venue name"
                                        />

                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                            <FileText size={16} /> Description
                                        </label>
                                        <textarea
                                            value={editVenueData.description}
                                            onChange={(e) =>
                                                setEditVenueData((d) => ({
                                                    ...d,
                                                    description: e.target.value,
                                                }))
                                            }
                                            className="border p-1 text-sm"
                                            placeholder="Short description"
                                        />

                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                            <DollarSign size={16} /> Price
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={editVenueData.price}
                                            onChange={(e) =>
                                                setEditVenueData((d) => ({
                                                    ...d,
                                                    price: e.target.value,
                                                }))
                                            }
                                            className="border p-1 text-sm"
                                            placeholder="Price per night"
                                        />

                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                            <Users size={16} /> Max Guests
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={editVenueData.maxGuests}
                                            onChange={(e) =>
                                                setEditVenueData((d) => ({
                                                    ...d,
                                                    maxGuests: e.target.value,
                                                }))
                                            }
                                            className="border p-1 text-sm"
                                            placeholder="Maximum number of guests"
                                        />

                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() =>
                                                    saveEditVenue(venue.id)
                                                }
                                                className="bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600 cursor-pointer"
                                            >
                                                <Save size={14} /> Save
                                            </button>
                                            <button
                                                onClick={cancelEditVenue}
                                                className="bg-gray-400 text-white px-2 py-1 text-xs rounded hover:bg-gray-500 cursor-pointer"
                                            >
                                                <X size={14} /> Cancel
                                            </button>
                                        </div>

                                        {venueError && (
                                            <div className="text-red-500 text-xs">
                                                {venueError}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Link
                                            to={`/venues/${venue.id}`}
                                            className="flex items-center gap-4 flex-1"
                                        >
                                            {venue.media[0]?.url && (
                                                <img
                                                    src={venue.media[0].url}
                                                    alt={
                                                        venue.media[0].alt ||
                                                        venue.name
                                                    }
                                                    className="h-14 w-14 object-cover"
                                                />
                                            )}
                                            <span className="text-gray-800 font-medium text-sm">
                                                {venue.name}
                                            </span>
                                        </Link>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() =>
                                                    startEditVenue(venue)
                                                }
                                                className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 cursor-pointer z-10"
                                                title="Edit venue"
                                            >
                                                <Edit3 size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteVenue(venue.id)
                                                }
                                                className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 cursor-pointer z-10"
                                                title="Delete venue"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-sm">
                            No available venues
                        </p>
                    )}
                </div>
            )}

            {currentUserName === name ? (
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Your upcoming trips{" "}
                    </h2>
                    {bookings && bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <Link
                                to={`/venues/${booking.venue.id}`}
                                key={booking.id}
                                className="flex flex-col gap-2 p-4 bg-white border border-gray-200 hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4">
                                    {booking.venue.media[0]?.url && (
                                        <img
                                            src={booking.venue.media[0].url}
                                            alt={
                                                booking.venue.media[0].alt ||
                                                booking.venue.name
                                            }
                                            className="h-14 w-14 object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <span className="text-gray-800 font-medium text-sm">
                                            <Link
                                                to={`/bookings/${booking.id}`}
                                            >
                                                {booking.venue.name}
                                            </Link>
                                        </span>
                                        {editingBookingId === booking.id ? (
                                            <div
                                                className="flex flex-col gap-2 mt-2"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <div className="flex gap-2">
                                                    <input
                                                        type="date"
                                                        value={
                                                            editBookingData.dateFrom
                                                        }
                                                        onChange={(e) =>
                                                            setEditBookingData(
                                                                (d) => ({
                                                                    ...d,
                                                                    dateFrom:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        className="border p-1 text-xs"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                    />
                                                    <input
                                                        type="date"
                                                        value={
                                                            editBookingData.dateTo
                                                        }
                                                        onChange={(e) =>
                                                            setEditBookingData(
                                                                (d) => ({
                                                                    ...d,
                                                                    dateTo: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            )
                                                        }
                                                        className="border p-1 text-xs"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={
                                                            editBookingData.guests
                                                        }
                                                        onChange={(e) =>
                                                            setEditBookingData(
                                                                (d) => ({
                                                                    ...d,
                                                                    guests: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            )
                                                        }
                                                        className="border p-1 text-xs w-16"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            saveEditBooking(
                                                                booking.id
                                                            );
                                                        }}
                                                        className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600"
                                                    >
                                                        <Save size={14} /> Save
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            cancelEditBooking();
                                                        }}
                                                        className="flex items-center gap-1 bg-gray-400 text-white px-2 py-1 text-xs rounded hover:bg-gray-500"
                                                    >
                                                        <X size={14} /> Cancel
                                                    </button>
                                                </div>
                                                {bookingError && (
                                                    <div className="text-red-500 text-xs">
                                                        {bookingError}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-gray-600 text-xs">
                                                    {new Date(
                                                        booking.dateFrom
                                                    ).toLocaleDateString()}{" "}
                                                    -{" "}
                                                    {new Date(
                                                        booking.dateTo
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p className="text-gray-600 text-xs">
                                                    Guests: {booking.guests}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    {editingBookingId !== booking.id && (
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    startEditBooking(booking);
                                                }}
                                                className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 cursor-pointer z-10"
                                            >
                                                <Edit3 size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDeleteBooking(
                                                        booking.id
                                                    );
                                                }}
                                                className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 cursor-pointer z-10"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-600 text-sm">
                            No upcoming bookings
                        </p>
                    )}
                </div>
            ) : (
                <p className="text-gray-600 text-sm">
                    Bookings are only visible to the profile owner.
                </p>
            )}
        </div>
    );
}
