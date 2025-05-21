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
        maxGuests: 1,
    });
    const [error, setError] = useState(null);

    const startEdit = (booking) => {
        setEditingId(booking.id);
        setEditData({
            dateFrom: booking.dateFrom.slice(0, 10),
            dateTo: booking.dateTo.slice(0, 10),
            guests: booking.guests,
            maxGuests: booking.venue.maxGuests,
        });
        setError(null);
    };

    const saveEdit = async () => {
        const clampedGuests = Math.min(
            Math.max(Number(editData.guests), 1),
            editData.maxGuests
        );
        try {
            await editBooking(editingId, {
                dateFrom: new Date(editData.dateFrom).toISOString(),
                dateTo: new Date(editData.dateTo).toISOString(),
                guests: clampedGuests,
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
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Your Upcoming Trips</h2>

            {bookings.length ? (
                bookings.map((booking) => {
                    const isEditingThis = editingId === booking.id;
                    const maxG = booking.venue.maxGuests;

                    return (
                        <div
                            key={booking.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center mb-4 p-4 shadow-lg rounded bg-white gap-4"
                        >
                            {isEditingThis ? (
                                <div className="flex flex-col gap-4 max-w-[400px] w-full">
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <label
                                                htmlFor={`dateFrom-${booking.id}`}
                                                className="text-sm font-medium text-gray-700 mb-1"
                                            >
                                                From
                                            </label>
                                            <input
                                                id={`dateFrom-${booking.id}`}
                                                type="date"
                                                value={editData.dateFrom}
                                                onChange={(e) =>
                                                    setEditData((d) => ({
                                                        ...d,
                                                        dateFrom:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label
                                                htmlFor={`dateTo-${booking.id}`}
                                                className="text-sm font-medium text-gray-700 mb-1"
                                            >
                                                To
                                            </label>
                                            <input
                                                id={`dateTo-${booking.id}`}
                                                type="date"
                                                value={editData.dateTo}
                                                onChange={(e) =>
                                                    setEditData((d) => ({
                                                        ...d,
                                                        dateTo: e.target.value,
                                                    }))
                                                }
                                                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label
                                                htmlFor={`guests-${booking.id}`}
                                                className="text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Guests
                                            </label>
                                            <input
                                                id={`guests-${booking.id}`}
                                                type="number"
                                                min={1}
                                                max={maxG}
                                                value={editData.guests}
                                                onChange={(e) =>
                                                    setEditData((d) => ({
                                                        ...d,
                                                        guests: e.target.value,
                                                    }))
                                                }
                                                onBlur={(e) => {
                                                    let v = Number(
                                                        e.target.value
                                                    );
                                                    v = Math.max(
                                                        1,
                                                        Math.min(v, maxG)
                                                    );
                                                    setEditData((d) => ({
                                                        ...d,
                                                        guests: v,
                                                    }));
                                                }}
                                                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="text-xs text-gray-500 mt-1">
                                                Max: {maxG}
                                            </span>
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
                                        to={`/venues/${booking.venue.id}`}
                                        className="flex-1 flex items-center gap-3 min-w-0"
                                    >
                                        {booking.venue.media[0]?.url && (
                                            <img
                                                src={booking.venue.media[0].url}
                                                alt={booking.venue.name}
                                                className="h-14 w-14 rounded object-cover flex-shrink-0"
                                            />
                                        )}
                                        <div className="min-w-0">
                                            <span className="font-medium block truncate">
                                                {booking.venue.name}
                                            </span>
                                            <p className="text-sm text-gray-600">
                                                {new Date(
                                                    booking.dateFrom
                                                ).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "2-digit",
                                                })}{" "}
                                                -{" "}
                                                {new Date(
                                                    booking.dateTo
                                                ).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "2-digit",
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Guests: {booking.guests}
                                            </p>
                                        </div>
                                    </Link>

                                    <div className="flex gap-2 mt-2 sm:mt-0">
                                        <button
                                            onClick={() => startEdit(booking)}
                                            className="bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded flex items-center cursor-pointer"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(booking.id)
                                            }
                                            className="bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded flex items-center cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-600">No upcoming bookings</p>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
