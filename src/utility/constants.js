const baseUrl = import.meta.env.VITE_BASE_URL;
const venueList = baseUrl + "holidaze/venues";
const venueDetails = venueList;
const loginUrl = baseUrl + "auth/login";
const registerUrl = baseUrl + "auth/register";

export { baseUrl, venueList, venueDetails, loginUrl, registerUrl };
