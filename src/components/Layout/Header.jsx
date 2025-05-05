import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { UserContext } from "../../utility/UserContext";

export function Header() {
    const { user, setUser } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchParams, setSearchParams] = useSearchParams();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        setSearchTerm(searchParams.get("q") || "");
        setSortOrder(searchParams.get("sortOrder") || "asc");
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = Object.fromEntries([...searchParams]);
        if (searchTerm) params.q = searchTerm;
        else delete params.q;
        setSearchParams(params);
    };

    const toggleSort = () => {
        const nextSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(nextSortOrder);
        const params = Object.fromEntries([...searchParams]);
        params.sortOrder = nextSortOrder;
        setSearchParams(params);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null); // Clear the user context
        navigate("/auth");
    };

    return (
        <header
            className="fixed top-0 w-full z-50 bg-white shadow"
            role="banner"
        >
            <div className="flex items-center justify-between max-w-[1600px] mx-auto p-4">
                <div className="flex-shrink-0">
                    <Link to="/" aria-label="Home" className="h-16">
                        <img
                            src="./src/assets/images/stay-and-trip.png"
                            alt="Stay and trip Logo"
                            className="h-12 w-auto"
                        />
                    </Link>
                </div>
                <form
                    onSubmit={handleSearch}
                    className="flex items-stretch flex-1 mx-4 max-w-lg"
                    role="search"
                    aria-label="Site search"
                >
                    <input
                        type="text"
                        className="flex-grow px-4 py-2 border-t border-b border-l border-gray-300 rounded-l-md focus:outline-none"
                        placeholder="Search title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search by title or description"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 cursor-pointer"
                        aria-label="Submit search"
                    >
                        Search
                    </button>
                </form>

                <button
                    onClick={toggleSort}
                    className="mr-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                    aria-label={
                        sortOrder === "asc"
                            ? "Sort descending"
                            : "Sort ascending"
                    }
                >
                    {sortOrder === "asc" ? "Asc ↑" : "Desc ↓"}
                </button>

                {user ? (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen((o) => !o)}
                            className="p-0 border-0 bg-transparent"
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            aria-label="User menu"
                            aria-controls="user-menu"
                        >
                            <img
                                src={user.profilePic}
                                alt="User Profile"
                                className="h-8 w-8 rounded-full cursor-pointer"
                            />
                        </button>
                        {menuOpen && (
                            <div
                                id="user-menu"
                                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded"
                                role="menu"
                                aria-label="User options"
                            >
                                <ul>
                                    <li>
                                        <Link
                                            to={`/profile/${user.name}`}
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            My Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            role="menuitem"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-shrink-0">
                        <Link
                            to="/auth"
                            className="mr-4 px-4 py-2 text-blue-500 hover:underline"
                            aria-label="Login"
                        >
                            Login/Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
