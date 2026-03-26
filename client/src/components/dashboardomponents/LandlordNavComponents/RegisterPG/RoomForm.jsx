import React from "react";
import PgOccupancyDropdown from "./PgOccupancyDropdown";
import Radio from "./Radio";

const RoomForm = ({ room, onChange, onRemove }) => {
  // Generic change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...room,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onChange({ ...room, photos: [...room.photos, ...files] });
  };

  // Remove one photo
  const removePhoto = (photoIndex) => {
    const newPhotos = room.photos.filter((_, i) => i !== photoIndex);
    onChange({ ...room, photos: newPhotos });
  };

  // Toggle feature
  const toggleFeature = (feature) => {
    const newFeatures = room.features.includes(feature)
      ? room.features.filter((f) => f !== feature)
      : [...room.features, feature];
    onChange({ ...room, features: newFeatures });
  };

  // Room type dropdown
  const setItem = (value) => {
    onChange({ ...room, roomType: value });
  };

  return (
    <div className="bg-[#e8e8e8] p-4 rounded-lg mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <p className="block text-[20px] text-[#5c5c5c] font-medium">
          Room
        </p>
        {onRemove && (
          <button type="button" onClick={onRemove}>
            <img
              src="../images/close.png"
              alt=""
              className="h-[25px] w-[25px] cursor-pointer"
            />
          </button>
        )}
      </div>

      {/* Room photos */}
      <label className="block text-[#5c5c5c] font-medium mb-1">
        Room Photos
      </label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 bg-[#e2e2e2] rounded-lg mb-3"
      />
      {room.photos.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {room.photos.map((photo, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(photo)}
                alt="Room Preview"
                className="h-[200px] w-[200px] object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-2 right-2 bg-[#e8e8e8] text-white rounded-full text-xs p-1"
              >
                <img
                  src="../images/close.png"
                  alt=""
                  className="h-[15px] w-[15px] cursor-pointer"
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Room type */}
      <div className="flex z-50 relative gap-4 my-3">
        <div className="block text-[#5c5c5c] font-medium mb-1">
          Room Type
        </div>
        <PgOccupancyDropdown value={room.roomType} setItem={setItem} />
      </div>

      {/* Rent */}
      <label className="block text-[#5c5c5c] font-medium mb-1">
        Monthly Rent
      </label>
      <input
        type="number"
        name="rent"
        value={room.rent}
        onChange={handleChange}
        className="w-full p-2 bg-[#e2e2e2] rounded-lg mb-3"
      />

      {/* Room security */}
      <label className="block text-[#5c5c5c] font-medium mb-1">
        Security deposit
      </label>
      <input
        type="number"
        name="security"
        value={room.security}
        onChange={handleChange}
        className="w-full p-2 bg-[#e2e2e2] rounded-lg mb-3"
      />

      {/* Description */}
      <label className="block text-[#5c5c5c] font-medium my-3">
        Description
      </label>
      <textarea
        name="description"
        value={room.description}
        onChange={handleChange}
        rows={3}
        className="w-full p-2 bg-[#e2e2e2] rounded-lg mb-3"
      />

      {/* Features */}
      <p className="font-medium text-[#5c5c5c] mb-2">Features</p>
      <div className="flex flex-wrap gap-2">
        {["Air Conditioner", "Attached Bathroom", "Bed and mattress", "Table & Chair" , "Fan/Tubelight/Bulb"].map(
          (feature, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={`px-3 py-1 rounded-full bg-[#e2e2e2] ${
                room.features.includes(feature)
                  ? "border border-[#d72638]"
                  : ""
              }`}
            >
              {feature}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default RoomForm;
