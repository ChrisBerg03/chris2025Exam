function AuthForm({
    isLogin,
    setIsLogin,
    loginData,
    registerData,
    handleLoginChange,
    handleRegisterChange,
    handleSubmit,
}) {
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
            <h2 className="text-2xl mb-6 text-center">
                {isLogin ? "Login" : "Register"}
            </h2>

            {isLogin ? (
                <>
                    <label className="block mb-2">
                        <span className="text-gray-700">Email</span>
                        <input
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <label className="block mb-4">
                        <span className="text-gray-700">Password</span>
                        <input
                            type="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Login
                    </button>
                    <p className="mt-4 text-center text-gray-600">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className="text-blue-500 hover:underline cursor-pointer"
                        >
                            Register
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <label className="block mb-2">
                        <span className="text-gray-700">Name</span>
                        <input
                            type="text"
                            name="name"
                            value={registerData.name}
                            onChange={handleRegisterChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Email</span>
                        <input
                            type="email"
                            name="email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">password</span>
                        <input
                            type="password"
                            name="password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Bio</span>
                        <textarea
                            name="bio"
                            value={registerData.bio}
                            onChange={handleRegisterChange}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Avatar URL</span>
                        <input
                            type="url"
                            name="avatar.url"
                            value={registerData.avatar.url}
                            onChange={handleRegisterChange}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Avatar Alt Text</span>
                        <input
                            type="text"
                            name="avatar.alt"
                            value={registerData.avatar.alt}
                            onChange={handleRegisterChange}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Banner URL</span>
                        <input
                            type="url"
                            name="banner.url"
                            value={registerData.banner.url}
                            onChange={handleRegisterChange}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Banner Alt Text</span>
                        <input
                            type="text"
                            name="banner.alt"
                            value={registerData.banner.alt}
                            onChange={handleRegisterChange}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    </label>
                    <label className="flex items-center mb-4 cursor-pointer">
                        <input
                            type="checkbox"
                            name="venueManager"
                            checked={registerData.venueManager}
                            onChange={handleRegisterChange}
                            className="mr-2"
                        />
                        <span className="text-gray-700">
                            Register as Venue Manager
                        </span>
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 cursor-pointer"
                    >
                        Register
                    </button>
                    <p className="mt-4 text-center text-gray-600">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className="text-blue-500 hover:underline cursor-pointer"
                        >
                            Login
                        </button>
                    </p>
                </>
            )}
        </form>
    );
}

export default AuthForm;
