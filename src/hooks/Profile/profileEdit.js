import { profileUrl } from "../../utility/constants";
import { toast } from "react-toastify";

export const updateProfile = async (name, data) => {
    const rawUser = localStorage.getItem("user");
    const token = JSON.parse(rawUser)?.token;
    if (!token) throw new Error("User is not authenticated");

    const response = await fetch(`${profileUrl}/${name}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        toast.error("Failed to update profile, please try again");
        window.location.href = "/";
        throw new Error("Failed to update profile");
    }
    toast.success("Profile updated successfully");
    return response.json();
};
