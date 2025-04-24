import { registerUrl } from "../../utility/constants.js";

export async function register(registerData) {
    try {
        console.log(registerData);

        const response = await fetch(registerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to register");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Register error:", error.message);
        throw error;
    }
}
