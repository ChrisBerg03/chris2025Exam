import { registerUrl } from "../../utility/constants.js";
import { toast } from "react-toastify";

export async function register(registerData, setIsLogin) {
    try {
        const response = await fetch(registerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
        });

        if (!response.ok) {
            toast.error(
                "Registration failed, make sure all fields are filled in correctly"
            );
            throw new Error("Failed to register");
        }

        const data = await response.json();
        toast.success("Registration successful!");
        setTimeout(() => setIsLogin(true), 1000);
        return data;
    } catch (error) {
        throw error;
    }
}
