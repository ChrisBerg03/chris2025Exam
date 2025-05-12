import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import fetchProfile from "../hooks/Profile/profile";
import { useContext } from "react";
import { UserContext } from "../utility/UserContext";
import { updateProfile } from "../hooks/Profile/profileEdit";
import { Edit3 } from "lucide-react";

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
                            <Link
                                to={`/venues/${venue.id}`}
                                key={venue.id}
                                className="flex items-center gap-4 p-4 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
                            >
                                {venue.media[0]?.url && (
                                    <img
                                        src={venue.media[0].url}
                                        alt={venue.media[0].alt || venue.name}
                                        className="h-14 w-14 object-cover"
                                    />
                                )}
                                <span className="text-gray-800 font-medium text-sm">
                                    {venue.name}
                                </span>
                            </Link>
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
                        Upcoming Bookings
                    </h2>
                    {bookings && bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <Link
                                to={`/bookings/${booking.id}`}
                                key={booking.id}
                                className="flex flex-col gap-2 p-4 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
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
                                    <div>
                                        <span className="text-gray-800 font-medium text-sm">
                                            {booking.venue.name}
                                        </span>
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
                                    </div>
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
