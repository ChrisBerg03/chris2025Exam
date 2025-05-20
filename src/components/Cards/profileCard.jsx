import { useState, useEffect, useContext } from "react";
import fetchProfile from "../../hooks/Profile/profile";
import { UserContext } from "../../utility/UserContext";
import ProfileSection from "../Forms/profileSection.jsx";
import VenuesSection from "../Forms/venueSection.jsx";
import BookingsSection from "../Forms/bookingSection.jsx";

export default function ProfileCard({ id }) {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const { setUser } = useContext(UserContext);
    const rawUser = localStorage.getItem("user");
    const currentUserName = JSON.parse(rawUser || "{}").name;

    useEffect(() => {
        if (!id) return;
        fetchProfile(id)
            .then((data) => setProfile(data))
            .catch((err) => setError(err));
    }, [id]);

    if (error)
        return <div className="text-red-500 p-4">Error: {error.message}</div>;
    if (!profile) return <div className="p-4">Loading profile...</div>;

    const isOwner = currentUserName === profile.name;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg">
            <ProfileSection
                profile={profile}
                setProfile={setProfile}
                setError={setError}
                setUser={setUser}
            />
            {profile.venueManager && (
                <VenuesSection
                    id={id}
                    venues={profile.venues}
                    reloadProfile={() => fetchProfile(id).then(setProfile)}
                />
            )}
            {isOwner && (
                <BookingsSection
                    id={id}
                    bookings={profile.bookings}
                    reloadProfile={() => fetchProfile(id).then(setProfile)}
                />
            )}
        </div>
    );
}
