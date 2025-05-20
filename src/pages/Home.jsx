// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchVenueList } from "../hooks/Venue/venueList";
import MainCard from "../components/Cards/mainCard.jsx";

export function Home() {
    const [venues, setVenues] = useState([]);
    const [page, setPage] = useState(1);
    const [searchParams] = useSearchParams();

    const query = searchParams.get("q") || "";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    useEffect(() => {
        setPage(1);
    }, [sortOrder, query]);

    useEffect(() => {
        fetchVenueList(page, query, sortOrder).then(setVenues);
    }, [page, query, sortOrder]);

    const handleNextPage = () => {
        setPage((prev) => prev + 1);
        scrollToTop();
    };

    const handlePreviousPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
        scrollToTop();
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="p-4">
            <div className="flex flex-wrap justify-center items-center gap-5">
                {venues.map((venue) => (
                    <MainCard key={venue.id} venue={venue} />
                ))}
            </div>
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 cursor-pointer"
                >
                    Previous
                </button>
                <span className="text-gray-700">Page {page}</span>
                <button
                    onClick={handleNextPage}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
