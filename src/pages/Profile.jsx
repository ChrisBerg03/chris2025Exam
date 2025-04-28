import React, { useEffect, useState } from "react";
import fetchProfile from "../hooks/Profile/profile";

export function Profile() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const rawUser = localStorage.getItem("user");
        if (!rawUser) return;

        const user = JSON.parse(rawUser);
        const id = user?.name;
        if (!id) return;

        fetchProfile(id)
            .then((data) => setProfile(data))
            .catch((err) => setError(err));
    }, []);

    if (error) return <div>Error loading profile: {error.message}</div>;
    if (!profile) return <div>Loading profile...</div>;

    const { name, email, bio, avatar, banner, venueManager, _count } = profile;

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

            <p className="mb-2">
                <strong>Venue Manager:</strong> {venueManager ? "Yes" : "No"}
            </p>

            {/* <p>
                <strong>Venues:</strong> {_count.venues} &nbsp;
                <strong>Bookings:</strong> {_count.bookings}
            </p> */}
        </div>
    );
}
