import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, Trash2, Save, X } from "lucide-react";
import { updateVenue } from "../../hooks/Fetches/venueEdit";
import { deleteVenue } from "../../hooks/Fetches/venueDelete";

export default function VenuesSection({ id, venues, reloadProfile }) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        price: 0,
        maxGuests: 1,
    });
    const [error, setError] = useState(null);

    const startEdit = (venue) => {
        setEditingId(venue.id);
        setEditData({
            name: venue.name,
            price: venue.price,
            maxGuests: venue.maxGuests,
        });
        setError(null);
    };

    const saveEdit = async () => {
        try {
            await updateVenue(editingId, {
                ...editData,
                price: Number(editData.price),
                maxGuests: Number(editData.maxGuests),
            });
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
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Owned Venues</h2>
            {venues.length ? (
                venues.map((venue) => (
                    <div
                        key={venue.id}
                        className="flex items-center mb-4 p-4 shadow-lg rounded"
                    >
                        {editingId === venue.id ? (
                            <div className="flex-1 flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) =>
                                        setEditData((d) => ({
                                            ...d,
                                            name: e.target.value,
                                        }))
                                    }
                                    className="border p-1 rounded"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={editData.price}
                                    onChange={(e) =>
                                        setEditData((d) => ({
                                            ...d,
                                            price: e.target.value,
                                        }))
                                    }
                                    className="border p-1 rounded w-20"
                                />
                                <input
                                    type="number"
                                    min="1"
                                    value={editData.maxGuests}
                                    onChange={(e) =>
                                        setEditData((d) => ({
                                            ...d,
                                            maxGuests: e.target.value,
                                        }))
                                    }
                                    className="border p-1 rounded w-20"
                                />
                                <button
                                    onClick={saveEdit}
                                    className="bg-green-500 text-white px-2 py-1 rounded flex items-center cursor-pointer"
                                >
                                    <Save size={14} />
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="bg-gray-500 text-white px-2 py-1 rounded flex items-center cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to={`/venues/${venue.id}`}
                                    className="flex-1 flex items-center space-x-2"
                                >
                                    {venue.media[0]?.url && (
                                        <img
                                            src={venue.media[0].url}
                                            alt={venue.name}
                                            className="h-14 w-14 rounded object-cover"
                                        />
                                    )}
                                    <span className="font-medium">
                                        {venue.name}
                                    </span>
                                </Link>
                                <button
                                    onClick={() => startEdit(v)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 flex items-center cursor-pointer"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(venue.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded flex items-center cursor-pointer"
                                >
                                    <Trash2 size={14} />
                                </button>
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
