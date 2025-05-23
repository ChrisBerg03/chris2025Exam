const baseUrl = import.meta.env.VITE_BASE_URL || "";
const venueList = baseUrl + "holidaze/venues";
const venueDetails = venueList;
const loginUrl = baseUrl + "auth/login";
const registerUrl = baseUrl + "auth/register";
const profileUrl = baseUrl + "holidaze/profiles";
const bookingUrl = baseUrl + "holidaze/bookings";

export {
    baseUrl,
    venueList,
    venueDetails,
    loginUrl,
    registerUrl,
    profileUrl,
    bookingUrl,
};
