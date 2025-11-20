import React, { useEffect, useState } from "react";
import RoomForm from "./RoomForm";
import Radio from "./Radio";
import Loader from "./Loader";
import Checkbox from "../../TenantNavComponents/LeavePG/Checkbox";
import MapPreview from "./MapPreview"
import AreaDropDown from "./AreaDropDown";
import { cityAreaMap } from"../../../../utils/areaCodes"
import axios from "axios";

const RegisterPG = ({setUser,setBar,coords}) => {
    const [formData, setFormData] = useState({
    pgName: "",
    description: "",
    address: {
      line1: "",
      line2: "",
      landmark: "",
      city: "",
      state: "",
      pin: "",
      areaCode:"",
    },
    features: [],
    otherFeatures:"",
    rooms: [],
    pgType: "",
    rules: "",
    addInfo: "",
    foodAvailable: false, 
    foodAvailabilityDesc:"", 
    menuImage: null,
    selfCooking: false,
    tiffin: false,
    confirmInfo: false, 
    agreeTerms: false,
    allowPromo: false,
    coverPhoto: null, 
    otherPhotos: [], 
    location: null,
});
  const [rooms, setRooms] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("")

  useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    rooms: rooms,
  }));
    }, [rooms]);

  const handleRoomChange = (id, newData) => {
    setRooms((prev) =>
      prev.map((room) => (room.id === id ? { ...room, ...newData } : room))
    );
  };

  const addRoom = () => {
    const newRoom = {
      id: Date.now(), // unique id
      photos: [],
      roomType: "Select here",
      furnished: "",
      rent: "",
      security:"",
      available: false,
      availableFrom: "",
      description: "",
      features: [],
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const removeRoom = (id) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
  };

  const handleChange = (e) => {
    const { name, type, files, checked, value } = e.target;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

    if (type === "file") {
      // Single file
      if (name === "coverPhoto" || name === "menuImage") {
        const file = files[0];
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
          alert("Only JPG, PNG, or WEBP files are allowed.");
          return;
        }

        if (file.size > MAX_SIZE) {
          alert("File size must be less than 5MB.");
          return;
        }

        setFormData((prev) => ({ ...prev, [name]: file }));
      }

      // Multiple files (otherPhotos)
      else if (name === "otherPhotos") {
        const validFiles = Array.from(files).filter(file => {
          if (!ALLOWED_TYPES.includes(file.type)) {
            alert(`${file.name} has unsupported format.`);
            return false;
          }
          if (file.size > MAX_SIZE) {
            alert(`${file.name} is too large (>5MB).`);
            return false;
          }
          return true;
        });

        setFormData((prev) => ({
          ...prev,
          otherPhotos: validFiles,
        }));
      }
    } 
    else if (["selfCooking", "tiffin", "confirmInfo", "agreeTerms", "allowPromo", "foodAvailable"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    }
    // Address fields
    else if (["line1", "line2", "landmark", "city", "state", "pin", "areaCode"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } 
    // All other text/number fields
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

    const validateRooms = (rooms) => {
    rooms.forEach((room, index) => {
      if (room.available && !room.availableFrom) {
        setError(`Room ${index + 1}: Available from date is required when room is marked as available`);
        return ;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Mandatory PG fields validation
    if (
      !formData.pgName ||
      !formData.description ||
      !formData.address.city ||
      !formData.address.state ||
      !formData.address.pin ||
      !formData.address.line1 ||
      !formData.address.areaCode ||
      !formData.coverPhoto ||
      !formData.pgType 
    ) {
      setSuccess("");
      setError("Please fill all mandatory fields: Name, Description, Address, PG Type, Cover Photo");
      return;
    }

    // ✅ Terms validation
    if (!formData.confirmInfo || !formData.agreeTerms) {
      setSuccess("");
      setError("Please confirm the information accuracy and agree to terms & conditions");
      return;
    }

    // ✅ Food availability validation
    if (formData.foodAvailable && !formData.foodAvailabilityDesc.trim()) {
      setSuccess("");
      setError("Please describe food availability when food is marked as available");
      return;
    }

    if(formData.rooms.length === 0){
      setSuccess("");
      setError("Please input rooms");
      return;
    }

    // 2️⃣ Room-level validation
    for (let i = 0; i < formData.rooms.length; i++) {
      const room = formData.rooms[i];
      if (
        room.photos.length === 0 ||
        room.roomType === "Select here" ||
        !room.rent ||
        !room.furnished ||
        (room.available && !room.availableFrom)
      ) {
        setSuccess("");
        setError(`Please complete all required fields for Room ${i + 1}`);
        return;
      }
    }

    validateRooms(formData.rooms);

    try {
      const fd = new FormData();
      fd.append("pgName", formData.pgName);
      fd.append("description", formData.description);
      fd.append("pgType", formData.pgType);
      fd.append("coverPhoto", formData.coverPhoto);
      fd.append("foodAvailable", formData.foodAvailable);
      fd.append("foodAvailabilityDesc", formData.foodAvailabilityDesc);
      fd.append("selfCooking", formData.selfCooking);
      fd.append("tiffin", formData.tiffin);
      fd.append("addInfo", formData.addInfo);
      fd.append("rules", formData.rules);
      fd.append("features", JSON.stringify(formData.features));
      fd.append("otherFeatures", formData.otherFeatures);

      formData.otherPhotos.forEach((file) => fd.append("otherPhotos", file));

      // Fix room photos with indexed field names
      formData.rooms.forEach((room, i) => {
        room.photos.forEach((file) => fd.append(`roomPhotos_${i}`, file));
      });

      if (formData.menuImage) {
        fd.append("menuImage", formData.menuImage);
      }

      fd.append("address", JSON.stringify(formData.address));
      fd.append("rooms", JSON.stringify(formData.rooms));

      // 📌 Register the PG
      const res = await axios.post("http://localhost:5000/pgs/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true // Important for authentication
      });
      
      // 📌 Update user's ownedPGs array with the new RID
      try {
        // Get current user data first
        const userRes = await axios.get("http://localhost:5000/auth/me", {
          withCredentials: true
        });
        
        const currentOwnedPGs = userRes.data.ownedPGs || [];
        
        // Update user with new PG RID
        const updateRes = await axios.put(
          "http://localhost:5000/auth/update-landlord-pgs",
          {
            ownedPGs: [...currentOwnedPGs, res.data.RID]
          },
          { withCredentials: true }
        );
        
        
        // Update the user state if setUser is available
        if (setUser) {
          setUser(updateRes.data);
        }
        
      } catch (updateErr) {
        console.error("Failed to update user's owned PGs:", updateErr);
        // PG is registered but user update failed - you might want to handle this
        setError("PG registered but failed to update your profile. Please contact support.");
      }
      
      setError("");
      setSuccess(`Your PG has been registered: ${res.data.RID}`);
      
    } catch (err) {
      console.error("Registration failed", err);
      setSuccess("");
      setError("Failed to register PG. Please try again.");
    }
  };

  const addressParts = [
  formData.address.line1,
  formData.address.line2,
  formData.address.landmark,
  formData.address.city,
  formData.address.state,
  formData.address.pin,
].filter(Boolean); 

const fullAddress = addressParts.join(", ");

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4 p-6 rounded-[20px]">
        
      {/* PG Photos */}
     <div className="grid grid-cols-2 gap-4">

      {/* Cover Photo */}
      <label className="h-100  flex items-center justify-center rounded-lg bg-[#e8e8e8] cursor-pointer relative overflow-hidden">
        {formData.coverPhoto ? (
          <img
            src={URL.createObjectURL(formData.coverPhoto)}
            alt="Cover Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          "Add the cover photo here"
        )}
        <input
          type="file"
          name="coverPhoto"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {/* Other Photos */}
      <label className="min-h-100  flex items-center justify-center rounded-lg bg-[#e8e8e8] cursor-pointer relative overflow-hidden">
        {formData.otherPhotos.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 w-full p-2">
            {formData.otherPhotos.map((photo, index) => (
              <img
                key={index}
                src={URL.createObjectURL(photo)}
                alt={`Preview ${index}`}
                className="w-full h-48 object-cover rounded"
              />
            ))}
          </div>
        ) : (
          "Add other photos"
        )}
        <input
          type="file"
          name="otherPhotos"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleChange}
        />
      </label>

      </div>
      {/* Basic Info */}
      <div className=" p-4 rounded-lg ">
        <label className="block text-[20px] text-[#5c5c5c] font-medium">Name of the PG</label>
        <input
          type="text"
          name="pgName"
          value={formData.pgName}
          onChange={handleChange}
          className="w-full p-2 bg-[#e8e8e8] rounded-lg mt-2 mb-4"
        />

        <label className="block text-[20px] text-[#5c5c5c] font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 bg-[#e8e8e8] rounded-lg mt-2"
          rows={3}
        />
      </div>

      {/* Location Details */}
      <div className="p-4 rounded-lg">
        <p className="block text-[20px] text-[#5c5c5c] font-medium">Location</p>
        
        <MapPreview
          address={fullAddress}
          pincode={formData.address.pin}
          onLocationSelect={(pos) =>
            setFormData((prev) => ({ ...prev, location: [pos.lat, pos.lng] }))
          }
          onAddressSelect={(addr) =>
            setFormData((prev) => ({
              ...prev,
              address: { ...prev.address, ...addr },
            }))
          }
        />
        </div>

      {/* Address Details */}
      <div className=" p-4 rounded-lg ">
        <p className="block text-[20px] text-[#5c5c5c] font-medium">Address Details</p>
        <input
          type="text"
          placeholder="House no. / Building name / Lane no."
          name="line1"
          value={formData.address.line1 || ""}
          onChange={handleChange}
          className="w-full p-2 bg-[#e8e8e8] rounded-lg mt-2 mb-2"
        />
        <input
          type="text"
          placeholder="Address line 2"
          name="line2"
          value={formData.address.line2 || ""}
          onChange={handleChange}
          className="w-full p-2 bg-[#e8e8e8] rounded-lg mb-2"
        />
        <input
          type="text"
          placeholder="Nearby landmark (optional)"
          name="landmark"
          value={formData.address.landmark || ""}
          onChange={handleChange}
          className="w-full p-2 bg-[#e8e8e8] rounded-lg mb-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="City name"
            name="city"
            value={formData.address.city || ""}
            onChange={handleChange}
            className="w-full p-2 bg-[#e8e8e8] rounded-lg"
          />
          <input
            type="text"
            placeholder="State"
            name="state"
            value={formData.address.state || ""}
            onChange={handleChange}
            className="w-full p-2 bg-[#e8e8e8] rounded-lg"
          />
        </div>
        <input
          type="text"
          placeholder="Pin Code"
          name="pin"
          value={formData.address.pin || ""}
          onChange={(e) => {
            const pin = e.target.value;
            setFormData(prev => ({
              ...prev,
              address: { ...prev.address, pin: pin }
            }));

            if (cityAreaMap[pin]) {
              // Valid pin → auto-fill city & areas
              setFormData(prev => ({
                ...prev,
                address: {
                  ...prev.address,
                  city: cityAreaMap[pin].city,
                  areaCode: "" // reset selected area
                }
              }));
              setAvailableAreas(cityAreaMap[pin].areas);
            } else {
              // Invalid pin → reset city & areas
              setFormData(prev => ({
                ...prev,
                address: {
                  ...prev.address,
                  city: "",
                  areaCode: ""
                }
              }));
              setAvailableAreas([]);
            }
          }}
          className="w-full p-2 bg-[#e8e8e8] rounded-lg mt-2"
        />
        
        {availableAreas.length > 0 && (
          <AreaDropDown
            areas={availableAreas}
            value={formData.areaCode}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, areaCode: val }
              }))
            }
          />
        )}

      </div>

      {/* Features */}
      <div className=" p-6 rounded-lg ">
        <p className="block text-[20px] text-[#5c5c5c] font-medium mb-4">PG Features</p>
        <div className="flex flex-wrap gap-2">
          {[{ imgPath: "../images/serviceImgs/spatula.png", featureName: "Kitchen" },
          { imgPath: "../images/serviceImgs/wifi-signal.png", featureName: "WiFI" },
          { imgPath: "../images/serviceImgs/air-conditioner.png", featureName: "Air Conditioner" },
          { imgPath: "../images/serviceImgs/cctv.png", featureName: "CCTV" },
          { imgPath: "../images/serviceImgs/car-parking.png", featureName: "Parking" },
          { imgPath: "../images/serviceImgs/hot.png", featureName: "Geyser" },
          { imgPath: "../images/serviceImgs/thunderbolt.png", featureName: "Power Backup" },
          { imgPath: "../images/serviceImgs/washing-machine.png", featureName: "Washing Machine" },
          { imgPath: "../images/serviceImgs/water.png", featureName: "Drinking water" },
          { imgPath: "../images/serviceImgs/fridge.png", featureName: "Refridgerator" },].map((feature, i) => (
            <button
              key={i}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  features: prev.features.includes(feature.featureName)
                    ? prev.features.filter((f) => f !== feature.featureName)
                    : [...prev.features, feature.featureName],
                }))
              }
              className={` flex items-center gap-4 px-4 py-1.5 rounded-full bg-[#e8e8e8] cursor-pointer ${
                formData.features.includes(feature.featureName)
                  ? "border border-[#d72638]"
                  : ""
              }`}
            >
              <div>
                <img src={feature.imgPath} alt="" className="h-[30px] w-[30px]"/>
              </div>
              <div className="text-[16px] text-[#5c5c5c]">{feature.featureName}</div>
            </button>
          ))}
          </div>
        <label className="block text-[16px] text-[#5c5c5c] font-medium mt-4">Other features, seperated by commas</label>
        <textarea
          name="otherFeatures"
          value={formData.otherFeatures}
          onChange={handleChange}
          className="w-full p-2 bg-[#e8e8e8] rounded-lg mt-2"
          rows={3}
        />
        
      </div>

      {/* Rooms */}
      <div className=" p-4 rounded-lg ">
        <p className="block text-[22px] text-[#5c5c5c] font-medium mb-2">Rooms</p>
        {rooms.map((room, index) => (
          <RoomForm
            key={room.id}
            room={room}
            onChange={(newData) => handleRoomChange(room.id, newData)}
            onRemove={() => removeRoom(room.id)}
          />
        ))}
        <button
          type="button"
          onClick={addRoom}
          className="mt-2 px-4 py-2 bg-[#1a1a1a] text-[#e8e8e8] rounded-[40px] cursor-pointer"
        >
          + Add another room
        </button>
      </div>

      {/* Other Info */}
      <div className=" p-4 rounded-lg">
        <p className="block text-[22px] text-[#5c5c5c] font-medium mb-2">Other Info</p>
        <div className="flex items-center gap-4">
          <p>PG type</p>
          <Radio
            name="pgType"
            option1="boys"
            option2="girls"
            option3="both"
            value={formData.pgType}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                pgType: val,
              }))
            }
          />
        </div>
        

        <label className="block mt-4">PG Rules & Conditions , seperated by commas</label>
        <textarea
          name="rules"
          onChange={handleChange}
          className="w-full p-2 bg-[#e8e8e8] rounded-lg mt-2"
          rows={3}
        />
        <label className="block mt-4">Additional info</label>
        <textarea
          name="addInfo"
          onChange={handleChange}
          className="w-full p-2 bg-[#e8e8e8] rounded-lg mt-2"
          rows={3}
        />
      </div>

      {/* Food availability */}
      <div className=" p-4 rounded-lg ">
        <p className="block text-[22px] text-[#5c5c5c] font-medium mb-2">Food Availability</p>
        
        {/* Main checkbox for food availability */}
        <div className="flex items-center gap-3 mb-4">
          <Checkbox
            checked={formData.foodAvailable}
            onChange={(checked) => {
              setFormData((prev) => ({
                ...prev,
                foodAvailable: checked,
                // Clear food-related fields when unchecked
                ...(checked ? {} : {
                  foodAvailabilityDesc: "",
                  menuImage: null,
                  selfCooking: false,
                  tiffin: false,
                })
              }))
            }}
          />
          <span className="text-[18px] text-[#5c5c5c] font-medium">Food Available?</span>
        </div>

        {/* Conditionally render food details */}
        {formData.foodAvailable && (
          <>
            <textarea
              name="foodAvailabilityDesc"
              value={formData.foodAvailabilityDesc}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 bg-[#e8e8e8] rounded-lg mb-3"
              placeholder="Describe the food availability..."
            />
            
            <div className="mt-3">
              <label className="block font-medium mb-1">Upload Menu Image</label>
              <input
                type="file"
                name="menuImage"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 bg-[#e8e8e8] rounded-lg"
              />

              {/* Image Preview */}
              {formData.menuImage && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
                  <img
                    src={URL.createObjectURL(formData.menuImage)}
                    alt="Menu Preview"
                    className="max-h-40 rounded-lg border"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-4 mt-3">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={formData.selfCooking}
                  onChange={(checked) =>
                    setFormData((prev) => ({ ...prev, selfCooking: checked }))
                  }
                />
                Self-Cooking Allowed?
              </div>
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={formData.tiffin}
                  onChange={(checked) =>
                    setFormData((prev) => ({ ...prev, tiffin: checked }))
                  }
                />
                Tiffin Service Available?
              </div>
            </div>
          </>
        )}
      </div>

      {/* Terms */}
      <div className="p-4 rounded-lg shadow flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <Checkbox
            checked={formData.confirmInfo}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, confirmInfo: checked }))
            }
          />
          I confirm that the above information is true and accurate.
        </div>
        <div className="flex gap-4 items-center">
          <Checkbox
            checked={formData.agreeTerms}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, agreeTerms: checked }))
            }
          />
          I agree to Zimer's terms & conditions and privacy policy.
        </div>
        <div className="flex gap-4 items-center">
          <Checkbox
            checked={formData.allowPromo}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, allowPromo: checked }))
            }
          />
          I allow Zimer to use my listing data for promotional purposes.{" "}
          <span className="text-gray-500">(optional)</span>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="bg-[#d72638] text-[#e8e8e8] p-3 rounded-lg font-medium hover:bg-[#9b1b30] duration-200"
      >
        Save and Continue
      </button>
    </form>
  );
};

export default RegisterPG;
