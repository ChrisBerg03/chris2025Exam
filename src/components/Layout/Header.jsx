import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { UserContext } from "../../utility/UserContext";
import logo from "../../assets/images/stay-and-trip.png";
import { ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "react-toastify";

export function Header() {
    const { user, setUser } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchParams, setSearchParams] = useSearchParams();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();
    const rawUser = localStorage.getItem("user");
    const venueManager = JSON.parse(rawUser)?.venueManager;

    useEffect(() => {
        setSearchTerm(searchParams.get("q") || "");
        setSortOrder(searchParams.get("sortOrder") || "asc");
    }, [searchParams]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = Object.fromEntries([...searchParams]);
        if (searchTerm) params.q = searchTerm;
        else delete params.q;
        setSearchParams(params);
    };

    const toggleSort = () => {
        const next = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(next);
        setSearchParams({
            ...Object.fromEntries([...searchParams]),
            sortOrder: next,
        });
    };

    const handleLogout = () => {
        toast.success("Logged out successfully!");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/auth");
    };

    return (
        <header
            className="fixed top-0 w-full z-50 bg-[#FAF9F6] shadow-md"
            role="banner"
        >
            <div className="flex items-center justify-between max-w-[1600px] mx-auto p-4">
                <Link
                    to="/"
                    aria-label="Home"
                    className="flex items-center h-16"
                >
                    <img
                        src={logo}
                        alt="Stay and Trip Logo"
                        className="h-12 w-auto"
                    />
                </Link>

                <form
                    onSubmit={handleSearch}
                    className="flex flex-1 mx-4 max-w-lg rounded-lg overflow-hidden shadow-lg"
                    role="search"
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-4 py-2 bg-white focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-medium cursor-pointer"
                    >
                        Search
                    </button>
                </form>

                <button
                    onClick={toggleSort}
                    className="mr-4 px-4 py-2 bg-white hover:bg-[#FAF9F6] border text-gray-700 shadow-lg rounded-lg flex items-center gap-1 cursor-pointer"
                    aria-label={`Sort ${
                        sortOrder === "asc" ? "descending" : "ascending"
                    }`}
                >
                    {sortOrder === "asc" ? (
                        <ArrowUp size={16} />
                    ) : (
                        <ArrowDown size={16} />
                    )}
                    {sortOrder.toUpperCase()}
                </button>

                {user ? (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen((open) => !open)}
                            className={`p-0 bg-transparent cursor-pointer ${
                                menuOpen ? "ring-2 ring-[#38BDF8]" : ""
                            }`}
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                        >
                            <img
                                src={user.profilePic}
                                alt="Profile"
                                className="h-8 w-8 rounded-full"
                            />
                        </button>
                        <div
                            id="user-menu"
                            className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg transition-opacity ${
                                menuOpen
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none"
                            }`}
                            role="menu"
                        >
                            <ul>
                                <li>
                                    <Link
                                        to={`/profile/${user.name}`}
                                        className="block px-4 py-2 hover:bg-[#FAF9F6]"
                                    >
                                        My Profile
                                    </Link>
                                </li>
                                {venueManager && (
                                    <li>
                                        <Link
                                            to="/venues/createVenue"
                                            className="block px-4 py-2 hover:bg-[#FAF9F6]"
                                        >
                                            Create Listing
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-[#FAF9F6] cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <Link
                        to="/auth"
                        className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-lg cursor-pointer"
                    >
                        Login / Register
                    </Link>
                )}
            </div>
        </header>
    );
}
