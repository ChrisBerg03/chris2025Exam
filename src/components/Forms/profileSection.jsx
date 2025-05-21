import { useState } from "react";
import { Edit3, Save, X } from "lucide-react";
import { updateProfile } from "../../hooks/Profile/profileEdit";

export default function ProfileSection({
    profile,
    setProfile,
    setError,
    setUser,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        bio: profile.bio || "",
        avatar: {
            url: profile.avatar?.url || "",
            alt: profile.avatar?.alt || "",
        },
        banner: {
            url: profile.banner?.url || "",
            alt: profile.banner?.alt || "",
        },
        venueManager: profile.venueManager,
    });

    const handleFieldChange = (field, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (section, field, value) => {
        setEditData((prev) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    };

    const confirmEdit = async () => {
        try {
            await updateProfile(profile.name, editData);
            setProfile((prev) => ({ ...prev, ...editData }));
            const raw = JSON.parse(localStorage.getItem("user") || "{}");
            raw.profilePic = editData.avatar.url;
            raw.venueManager = editData.venueManager;
            localStorage.setItem("user", JSON.stringify(raw));
            setUser(raw);
            setIsEditing(false);
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="space-y-6">
            {isEditing ? (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Edit Profile</h2>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">Bio</label>
                        <input
                            value={editData.bio}
                            onChange={(e) =>
                                handleFieldChange("bio", e.target.value)
                            }
                            className="w-full border p-2 rounded"
                            rows={3}
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
                            className="w-full border p-2 rounded"
                            placeholder="https://..."
                        />
                        {editData.avatar.url && (
                            <img
                                src={editData.avatar.url}
                                alt={editData.avatar.alt}
                                className="h-20 w-20 rounded-full object-cover mx-auto sm:mx-0"
                            />
                        )}
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
                            className="w-full border p-2 rounded"
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
                            className="w-full border p-2 rounded"
                            placeholder="https://..."
                        />
                        {editData.banner.url && (
                            <img
                                src={editData.banner.url}
                                alt={editData.banner.alt}
                                className="w-full h-32 object-cover rounded"
                            />
                        )}
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
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            id="venueManager"
                            className="cursor-pointer"
                            type="checkbox"
                            checked={editData.venueManager}
                            onChange={(e) =>
                                handleFieldChange(
                                    "venueManager",
                                    e.target.checked
                                )
                            }
                        />
                        <label
                            htmlFor="venueManager"
                            className="text-sm text-gray-600 cursor-pointer"
                        >
                            Venue Manager
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <button
                            onClick={confirmEdit}
                            className="w-full bg-green-500 text-white py-2 rounded flex items-center justify-center space-x-1 cursor-pointer"
                        >
                            <Save size={16} />
                            <span>Save</span>
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="w-full bg-gray-500 text-white py-2 rounded flex items-center justify-center space-x-1 cursor-pointer"
                        >
                            <X size={16} />
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {profile.banner?.url && (
                        <img
                            src={profile.banner.url}
                            alt={profile.banner.alt}
                            className="w-full h-40 sm:h-60 object-cover rounded"
                        />
                    )}
                    <div className="flex flex-wrap items-center sm:justify-between gap-4">
                        <div className="flex items-center flex-shrink-0 gap-4">
                            {profile.avatar?.url && (
                                <img
                                    src={profile.avatar.url}
                                    alt={profile.avatar.alt}
                                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover"
                                />
                            )}
                            <div className="text-left">
                                <h1 className="text-xl sm:text-2xl font-semibold">
                                    {profile.name}
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    {profile.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded flex items-center justify-center mt-2 sm:mt-0 cursor-pointer"
                        >
                            <Edit3 size={16} />
                        </button>
                    </div>
                    <p className="text-gray-700 leading-relaxed break-words">
                        {profile.bio}
                    </p>
                </>
            )}
        </div>
    );
}
