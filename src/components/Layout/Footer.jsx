import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="bg-gray-700 text-white shadow-lg">
            <div className="max-w-[1600px] mx-auto h-[75px] flex flex-col sm:flex-row items-center justify-between px-4">
                <div className="text-sm">&copy; 2025 Trip&stay</div>
                <div className="flex gap-4 text-sm mt-2 sm:mt-0">
                    <Link to={"/"} className="hover:underline cursor-pointer">
                        About Us
                    </Link>
                    <Link to={"/"} className="hover:underline cursor-pointer">
                        Contact
                    </Link>
                    <Link to={"/"} className="hover:underline cursor-pointer">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}
