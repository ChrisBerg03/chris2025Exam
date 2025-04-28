import { loginUrl } from "../../utility/constants.js";

export async function login(email, password) {
    try {
        const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to log in");
        }

        const data = await response.json();
        console.log(data);

        const user = {
            token: data.data.accessToken,
            profilePic: data.data.avatar.url,
            name: data.data.name,
        };

        localStorage.setItem("user", JSON.stringify(user));
        return data;
    } catch (error) {
        console.error("Login error:", error.message);
        throw error;
    }
}
