import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, Trash2, Save, X } from "lucide-react";
import { updateVenue } from "../../hooks/Venue/venueEdit";
import { deleteVenue } from "../../hooks/Venue/venueDelete";

export default function VenuesSection({ venues, reloadProfile }) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        mediaUrl: "",
        price: 0,
        maxGuests: 1,
    });
    const [error, setError] = useState(null);

    const saveEdit = async () => {
        try {
            const payload = {
                name: editData.name || undefined,
                media: editData.mediaUrl
                    ? [{ url: editData.mediaUrl }]
                    : undefined,
                price: Number(editData.price) || undefined,
                maxGuests: Number(editData.maxGuests) || undefined,
            };
            await updateVenue(editingId, payload);
            reloadProfile();
            setEditingId(null);
        } catch {
            setError("Failed to update venue");
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setError(null);
    };

    const handleDelete = async (vid) => {
        if (!window.confirm("Are you sure you want to delete this venue?"))
            return;
        try {
            await deleteVenue(vid);
            reloadProfile();
        } catch {
            alert("Failed to delete venue");
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Owned Venues</h2>
            {venues.length ? (
                venues.map((venue) => (
                    <div
                        key={venue.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center mb-4 p-4 shadow-lg rounded bg-white gap-4"
                    >
                        {editingId === venue.id ? (
                            <div className="flex flex-col gap-4 max-w-[400px] w-full">
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="venueName"
                                            className="text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Venue Name
                                        </label>
                                        <input
                                            id="venueName"
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) =>
                                                setEditData((d) => ({
                                                    ...d,
                                                    name: e.target.value,
                                                }))
                                            }
                                            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="venueUrl"
                                            className="text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Media URL
                                        </label>
                                        <input
                                            id="venueUrl"
                                            type="url"
                                            value={editData.mediaUrl}
                                            onChange={(e) =>
                                                setEditData((d) => ({
                                                    ...d,
                                                    mediaUrl: e.target.value,
                                                }))
                                            }
                                            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="venuePrice"
                                            className="text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Price per Night (Nok)
                                        </label>
                                        <input
                                            id="venuePrice"
                                            type="number"
                                            min="0"
                                            value={editData.price}
                                            onChange={(e) =>
                                                setEditData((d) => ({
                                                    ...d,
                                                    price: e.target.value,
                                                }))
                                            }
                                            onBlur={(e) => {
                                                let v = Number(e.target.value);
                                                v = Math.max(0, v);
                                                setEditData((d) => ({
                                                    ...d,
                                                    price: v,
                                                }));
                                            }}
                                            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="maxGuests"
                                            className="text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Max Guests
                                        </label>
                                        <input
                                            id="maxGuests"
                                            type="number"
                                            min="1"
                                            value={editData.maxGuests}
                                            onChange={(e) =>
                                                setEditData((d) => ({
                                                    ...d,
                                                    maxGuests: e.target.value,
                                                }))
                                            }
                                            onBlur={(e) => {
                                                let v = Number(e.target.value);
                                                v = Math.max(1, v);
                                                setEditData((d) => ({
                                                    ...d,
                                                    maxGuests: v,
                                                }));
                                            }}
                                            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        />
                                    </div>
                                    <div>
                                        For more editing options, please visit{" "}
                                        <Link
                                            to={`/venues/${venue.id}`}
                                            className="text-sky-500 underline hover:text-sky-600"
                                        >
                                            your venue
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={saveEdit}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                                    >
                                        <Save size={16} />
                                        <span>Save</span>
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                                    >
                                        <X size={16} />
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to={`/venues/${venue.id}`}
                                    className="flex-1 flex items-center gap-2 min-w-0"
                                >
                                    {venue.media[0]?.url && (
                                        <img
                                            src={venue.media[0].url}
                                            alt={venue.media[0].alt}
                                            className="h-14 w-14 rounded object-cover flex-shrink-0"
                                        />
                                    )}
                                    <div>
                                        <span className="font-medium truncate">
                                            {venue.name}
                                        </span>
                                        <p className="text-sm text-gray-500">
                                            Price: {venue.price} Nok
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Max Guests: {venue.maxGuests}
                                        </p>
                                    </div>
                                </Link>
                                <div className="flex gap-2 mt-2 sm:mt-0">
                                    <button
                                        onClick={() => {
                                            setEditingId(venue.id);
                                            setEditData({
                                                name: venue.name || "",
                                                mediaUrl:
                                                    venue.media[0]?.url || "",
                                                price: venue.price || 0,
                                                maxGuests: venue.maxGuests || 1,
                                            });
                                            setError(null);
                                        }}
                                        className="bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded flex items-center cursor-pointer"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(venue.id)}
                                        className="bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded flex items-center cursor-pointer"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-600">No available venues</p>
            )}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
