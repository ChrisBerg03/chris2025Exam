import VenueForm from "../components/Forms/createVenue";
import { useState } from "react";
import { createVenue } from "../hooks/Venue/createVenue";
import { useNavigate } from "react-router-dom";

export function CreateVenue() {
    const rawUser = localStorage.getItem("user");
    const name = JSON.parse(rawUser || "{}").name;

    const Navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        media: [{ url: "", alt: "" }],
        price: Number(0),
        maxGuests: Number(0),
        rating: Number(0),
        meta: {
            wifi: false,
            parking: false,
            breakfast: false,
            pets: false,
        },
        location: {
            address: "",
            city: "",
            zip: "",
            country: "",
            continent: "",
            lat: Number(0),
            lng: Number(0),
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMetaChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            meta: { ...prev.meta, [name]: checked },
        }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            location: { ...prev.location, [name]: value },
        }));
    };

    const handleMediaChange = (index, e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newMedia = [...prev.media];
            newMedia[index][name] = value;
            return { ...prev, media: newMedia };
        });
    };

    const addMedia = () => {
        setFormData((prev) => ({
            ...prev,
            media: [...prev.media, { url: "", alt: "" }],
        }));
    };

    const removeMedia = (index) => {
        setFormData((prev) => {
            const newMedia = prev.media.filter((_, i) => i !== index);
            return { ...prev, media: newMedia };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...formData,
                media: formData.media.filter(
                    (media) => media.url.trim() !== ""
                ),
                price: Number(formData.price),
                maxGuests: Number(formData.maxGuests),
                rating: Number(formData.rating),
                location: {
                    ...formData.location,
                    lat: Number(formData.location.lat),
                    lng: Number(formData.location.lng),
                },
            };

            if (
                !submissionData.location.address &&
                !submissionData.location.city &&
                !submissionData.location.zip &&
                !submissionData.location.country &&
                !submissionData.location.continent &&
                submissionData.location.lat === 0 &&
                submissionData.location.lng === 0
            ) {
                delete submissionData.location;
            }

            await createVenue(submissionData);
            Navigate(`/profile/${name}`);
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    return (
        <VenueForm
            formData={formData}
            handleChange={handleChange}
            handleMetaChange={handleMetaChange}
            handleLocationChange={handleLocationChange}
            handleMediaChange={handleMediaChange}
            addMedia={addMedia}
            removeMedia={removeMedia}
            handleSubmit={handleSubmit}
        />
    );
}
