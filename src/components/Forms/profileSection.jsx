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
            await updateProfile(profile.id, editData);
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
        <div className="mb-8">
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
                                className="h-20 w-20 rounded-full object-cover"
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
                            type="checkbox"
                            checked={editData.venueManager}
                            onChange={(e) =>
                                handleFieldChange(
                                    "venueManager",
                                    e.target.checked
                                )
                            }
                        />
                        <label className="text-sm text-gray-600">
                            Venue Manager
                        </label>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={confirmEdit}
                            className="flex-1 bg-green-500 text-white py-2 rounded flex items-center justify-center space-x-1 cursor-pointer"
                        >
                            <Save size={16} />
                            <span>Save</span>
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 bg-gray-500 text-white py-2 rounded flex items-center justify-center space-x-1 cursor-pointer"
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
                            className="w-full h-48 object-cover mb-4 rounded"
                        />
                    )}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            {profile.avatar?.url && (
                                <img
                                    src={profile.avatar.url}
                                    alt={profile.avatar.alt}
                                    className="h-20 w-20 rounded-full mr-4 object-cover"
                                />
                            )}
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    {profile.name}
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    {profile.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 text-white p-2 rounded flex items-center cursor-pointer"
                        >
                            <Edit3 size={16} />
                        </button>
                    </div>
                    <p className="text-gray-700 mb-4">{profile.bio}</p>
                </>
            )}
        </div>
    );
}
