import React from "react";

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
    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6"
        >
            <h2 className="text-2xl font-semibold text-gray-800">
                Create a New Venue
            </h2>

            <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="mb-1 text-gray-600 block">
                        Title<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="mb-1 text-gray-600 block">
                        Price<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-gray-600">
                    Description<span className="text-red-500">*</span>
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 h-32 resize-none"
                />
            </div>

            <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="mb-1 text-gray-600 block">
                        Max Guests<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="maxGuests"
                        value={formData.maxGuests}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="mb-1 text-gray-600 block">Rating</label>
                    <input
                        type="number"
                        name="rating"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
            </div>

            <fieldset className="border-t border-gray-200 pt-4">
                <legend className="text-gray-700 font-medium">Amenities</legend>
                <div className="flex flex-wrap space-x-6 mt-3">
                    {Object.keys(formData.meta).map((key) => (
                        <label
                            key={key}
                            className="flex items-center space-x-2 mb-2"
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

            <fieldset className="border-t border-gray-200 pt-4">
                <legend className="text-gray-700 font-medium">Location</legend>
                <div className="flex flex-wrap -mx-2 mt-3">
                    {Object.keys(formData.location).map((key) => (
                        <div key={key} className="w-full md:w-1/3 px-2 mb-4">
                            <label className="mb-1 text-gray-600 capitalize block">
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    ))}
                </div>
            </fieldset>

            <fieldset className="border-t border-gray-200 pt-4">
                <legend className="text-gray-700 font-medium">Media</legend>
                <div className="space-y-4 mt-3">
                    {formData.media.map((item, index) => (
                        <div key={index} className="flex flex-col space-y-2">
                            <input
                                type="url"
                                name="url"
                                placeholder="Image URL"
                                value={item.url}
                                onChange={(e) => handleMediaChange(index, e)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <input
                                type="text"
                                name="alt"
                                placeholder="Alt text"
                                value={item.alt}
                                onChange={(e) => handleMediaChange(index, e)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <button
                                type="button"
                                onClick={() => removeMedia(index)}
                                className="self-start text-red-600 hover:underline cursor-pointer"
                            >
                                Remove Image
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMedia}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        + Add Another Image
                    </button>
                </div>
            </fieldset>

            <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-2xl shadow hover:bg-indigo-700 transition"
            >
                Create Venue
            </button>
        </form>
    );
}
