import { loginUrl } from "../../utility/constants.js";
import { toast } from "react-toastify";

export async function login(email, password) {
    try {
        const response = await fetch(`${loginUrl}?_holidaze=true`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            toast.error("Login failed, please check your credentials");

            throw new Error("Failed to log in");
        }

        const data = await response.json();
        toast.success("Login successful!");
        const user = {
            token: data.data.accessToken,
            profilePic: data.data.avatar.url,
            name: data.data.name,
            venueManager: data.data.venueManager,
        };

        localStorage.setItem("user", JSON.stringify(user));
        return data;
    } catch (error) {
        throw error;
    }
}
