import ProfileCard from "../components/Cards/profileCard.jsx";
import { useParams } from "react-router-dom";

export function Profile() {
    const { id } = useParams();
    return <ProfileCard id={id} />;
}
