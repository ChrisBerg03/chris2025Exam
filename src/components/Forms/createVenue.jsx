import { useState } from "react";

export default function VenueForm({
    formData,
    handleChange,
    handleMetaChange,
    handleLocationChange,
    handleMediaChange,
    addMedia,
    removeMedia,
    handleSubmit,
}) {
    const [previews, setPreviews] = useState(formData.media.map((m) => m.url));

    const onUrlChange = (index, e) => {
        handleMediaChange(index, e);
        const newUrl = e.target.value;
        setPreviews((prev) => {
            const copy = [...prev];
            copy[index] = newUrl;
            return copy;
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl space-y-8"
        >
            <h2 className="text-3xl font-bold text-indigo-700 text-center">
                Create a New Venue
            </h2>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-gray-700 mb-2 font-medium">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
                />
            </div>

            {/* Guests & Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Max Guests <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="maxGuests"
                        value={formData.maxGuests}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Rating
                    </label>
                    <input
                        type="number"
                        name="rating"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                </div>
            </div>

            {/* Amenities */}
            <fieldset className="border-t border-gray-200 pt-6">
                <legend className="text-lg font-medium text-gray-700">
                    Amenities
                </legend>
                <div className="flex flex-wrap gap-4 mt-4">
                    {Object.keys(formData.meta).map((key) => (
                        <label
                            key={key}
                            className="flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                name={key}
                                checked={formData.meta[key]}
                                onChange={handleMetaChange}
                                className="h-5 w-5 text-indigo-600 rounded"
                            />
                            <span className="text-gray-600 capitalize">
                                {key}
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>

            {/* Location */}
            <fieldset className="border-t border-gray-200 pt-6">
                <legend className="text-lg font-medium text-gray-700">
                    Location
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {Object.keys(formData.location).map((key) => (
                        <div key={key}>
                            <label className="block text-gray-700 mb-2 capitalize font-medium">
                                {key}
                            </label>
                            <input
                                type={
                                    key === "lat" || key === "lng"
                                        ? "number"
                                        : "text"
                                }
                                name={key}
                                value={formData.location[key]}
                                onChange={handleLocationChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            />
                        </div>
                    ))}
                </div>
            </fieldset>

            {/* Media with preview */}
            <fieldset className="border-t border-gray-200 pt-6">
                <legend className="text-lg font-medium text-gray-700">
                    Media & Image Preview
                </legend>
                <div className="space-y-6 mt-4">
                    {formData.media.map((item, index) => (
                        <div key={index} className="flex flex-col">
                            {/* Preview */}
                            {previews[index] && (
                                <img
                                    src={previews[index]}
                                    alt={item.alt || "Preview"}
                                    className="w-full h-48 object-cover rounded-lg mb-2"
                                />
                            )}
                            <input
                                type="url"
                                name="url"
                                placeholder="Image URL"
                                value={item.url}
                                onChange={(e) => onUrlChange(index, e)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            />
                            <input
                                type="text"
                                name="alt"
                                placeholder="Alt text"
                                value={item.alt}
                                onChange={(e) => handleMediaChange(index, e)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition mt-2"
                            />
                            <button
                                type="button"
                                onClick={() => removeMedia(index)}
                                className="self-start text-red-600 hover:underline mt-2"
                            >
                                Remove Image
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMedia}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                        + Add Another Image
                    </button>
                </div>
            </fieldset>

            <button
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-indigo-700 transition"
            >
                Create Venue
            </button>
        </form>
    );
}
