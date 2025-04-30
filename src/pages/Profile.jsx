import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchProfile from "../hooks/Profile/profile";
import { Link } from "react-router-dom";

export function Profile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        fetchProfile(id)
            .then((data) => setProfile(data))
            .catch((err) => setError(err));
    }, [id]);

    if (error) return <div>Error loading profile: {error.message}</div>;
    if (!profile) return <div>Loading profile...</div>;

    const { name, email, bio, avatar, banner, venueManager, venues } = profile;

    return (
        <div className="p-4 max-w-3xl mx-auto">
            {banner?.url && (
                <img
                    src={banner.url}
                    alt={banner.alt || "Banner image"}
                    className="w-full h-56 object-cover rounded mb-6"
                />
            )}

            <div className="flex items-center mb-6">
                {avatar?.url && (
                    <img
                        src={avatar.url}
                        alt={avatar.alt || "Avatar"}
                        className="h-24 w-24 rounded-full mr-4"
                    />
                )}
                <div>
                    <h1 className="text-3xl font-bold">{name}</h1>
                    <p className="text-gray-600">{email}</p>
                </div>
            </div>

            {bio && <p className="mb-4">{bio}</p>}

            <p className="mb-4">
                <strong>Venue Manager:</strong> {venueManager ? "Yes" : "No"}
            </p>

            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold mb-2">My Venues</h2>
                {venues && venues.length > 0 ? (
                    venues.map((venue) => (
                        <Link
                            to={`/venues/${venue.id}`}
                            key={venue.id}
                            className="flex items-center gap-4 p-4 bg-white shadow rounded-lg"
                        >
                            {venue.media[0]?.url && (
                                <img
                                    src={venue.media[0].url}
                                    alt={venue.media[0].alt || venue.name}
                                    className="h-16 w-16 object-cover rounded"
                                />
                            )}
                            <span className="text-gray-800 font-medium">
                                {venue.name}
                            </span>
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-600">No available venues</p>
                )}
            </div>
        </div>
    );
}
