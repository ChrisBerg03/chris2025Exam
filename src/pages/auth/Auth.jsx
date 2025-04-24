import React, { useState } from "react";
import AuthForm from "../../components/Forms/auth";
import { login } from "../../hooks/auth/Login";
import { register } from "../../hooks/auth/Register";

export function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        avatar: { url: "", alt: "" },
        banner: { url: "", alt: "" },
        venueManager: false,
    });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith("avatar.") || name.startsWith("banner.")) {
            const [group, field] = name.split(".");
            setRegisterData((prev) => ({
                ...prev,
                [group]: { ...prev[group], [field]: value },
            }));
        } else if (type === "checkbox") {
            setRegisterData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setRegisterData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            try {
                const response = await login(
                    loginData.email,
                    loginData.password
                );
                console.log("Login successful:", response);
            } catch (error) {
                console.error("Login failed:", error.message);
            }
        } else {
            try {
                const filteredRegisterData = {
                    name: registerData.name,
                    email: registerData.email,
                    password: registerData.password,
                    ...(registerData.bio && { bio: registerData.bio }),
                    ...(registerData.avatar.url && {
                        avatar: {
                            url: registerData.avatar.url,
                            ...(registerData.avatar.alt && {
                                alt: registerData.avatar.alt,
                            }),
                        },
                    }),
                    ...(registerData.banner.url && {
                        banner: {
                            url: registerData.banner.url,
                            ...(registerData.banner.alt && {
                                alt: registerData.banner.alt,
                            }),
                        },
                    }),
                    ...(registerData.venueManager && {
                        venueManager: registerData.venueManager,
                    }),
                };

                const response = await register(filteredRegisterData);
                console.log("Registration successful:", response);
            } catch (error) {
                console.error("Registration failed:", error.message);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <AuthForm
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                loginData={loginData}
                registerData={registerData}
                handleLoginChange={handleLoginChange}
                handleRegisterChange={handleRegisterChange}
                handleSubmit={handleSubmit}
            />
        </div>
    );
}
