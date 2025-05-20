import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, Trash2, Save, X } from "lucide-react";
import editBooking from "../../hooks/Booking/editBooking";
import deleteBooking from "../../hooks/Booking/deleteBooking";

export default function BookingsSection({ bookings, reloadProfile }) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({
        dateFrom: "",
        dateTo: "",
        guests: 1,
    });
    const [error, setError] = useState(null);

    const startEdit = (booking) => {
        setEditingId(booking.id);
        setEditData({
            dateFrom: booking.dateFrom.slice(0, 10),
            dateTo: booking.dateTo.slice(0, 10),
            guests: booking.guests,
        });
        setError(null);
    };

    const saveEdit = async () => {
        try {
            await editBooking(editingId, {
                dateFrom: new Date(editData.dateFrom).toISOString(),
                dateTo: new Date(editData.dateTo).toISOString(),
                guests: Number(editData.guests),
            });
            reloadProfile();
            setEditingId(null);
        } catch {
            setError("Failed to update booking");
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setError(null);
    };

    const handleDelete = async (bid) => {
        if (!window.confirm("Are you sure you want to delete this booking?"))
            return;
        try {
            await deleteBooking(bid);
            reloadProfile();
        } catch {
            alert("Failed to delete booking");
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Your Upcoming Trips</h2>
            {bookings.length ? (
                bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="flex items-center mb-4 p-4 shadow-lg rounded"
                    >
                        {editingId === booking.id ? (
                            <div className="flex-1 flex items-center space-x-2">
                                <input
                                    type="date"
                                    value={editData.dateFrom}
                                    onChange={(e) =>
                                        setEditData((d) => ({
                                            ...d,
                                            dateFrom: e.target.value,
                                        }))
                                    }
                                    className="border p-1 rounded"
                                />
                                <input
                                    type="date"
                                    value={editData.dateTo}
                                    onChange={(e) =>
                                        setEditData((d) => ({
                                            ...d,
                                            dateTo: e.target.value,
                                        }))
                                    }
                                    className="border p-1 rounded"
                                />
                                <input
                                    type="number"
                                    min="1"
                                    value={editData.guests}
                                    onChange={(e) =>
                                        setEditData((d) => ({
                                            ...d,
                                            guests: e.target.value,
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
                            <Link
                                to={`/venues/${booking.venue.id}`}
                                className="flex-1 flex items-center space-x-2"
                            >
                                {booking.venue.media[0]?.url && (
                                    <img
                                        src={booking.venue.media[0].url}
                                        alt={booking.venue.name}
                                        className="h-14 w-14 rounded object-cover"
                                    />
                                )}
                                <div>
                                    <span className="font-medium">
                                        {booking.venue.name}
                                    </span>
                                    <p className="text-sm text-gray-600">
                                        {new Date(
                                            booking.dateFrom
                                        ).toLocaleDateString()}{" "}
                                        -{" "}
                                        {new Date(
                                            booking.dateTo
                                        ).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Guests: {booking.guests}
                                    </p>
                                </div>
                            </Link>
                        )}
                        {editingId === booking.id ? null : (
                            <>
                                <button
                                    onClick={() => startEdit(booking)}
                                    className="bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded mr-2 flex items-center cursor-pointer"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(booking.id)}
                                    className="bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded flex items-center cursor-pointer"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-600">No upcoming bookings</p>
            )}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
