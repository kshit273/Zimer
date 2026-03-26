import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdatePGInfo = ({ ownedPGsData, ownedPGsRID = [], loadingPGs = false }) => {
  // Selected PG from dropdown
  const [selectedRID, setSelectedRID] = useState("");
  
  // Original data and form states
  const [pgData, setPgData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Edit modes for different sections
  const [editMode, setEditMode] = useState({
    basicInfo: false,
    description: false,
    rules: false,
    amenities: false,
    photos: false
  });
  
  // Form data
  const [formData, setFormData] = useState({
    pgName: "",
    address: "",
    description: "",
    rules: [],
    amenities: []
  });
  
  // New rule/amenity inputs
  const [newRule, setNewRule] = useState("");
  const [newAmenity, setNewAmenity] = useState("");
  
  // Photo management
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [otherPhotosFiles, setOtherPhotosFiles] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]);

  // Auto-select first PG if available
  useEffect(() => {
    if (ownedPGsRID.length > 0 && !selectedRID) {
      setSelectedRID(ownedPGsRID[0]);
    }
  }, [ownedPGsRID]);

  // Fetch PG data when selectedRID changes
  useEffect(() => {
    const fetchPgData = async () => {
      if (!selectedRID) return;
      
      console.log("Fetching PG data for RID:", selectedRID);
      try {
        setLoading(true);
        setError(null);

        const data = ownedPGsData.find(pg => pg.RID === selectedRID);
        
        setPgData(data);
        setFormData({
          pgName: data.pgName || "",
          address: data.address || "",
          description: data.description || "",
          rules: data.rules || [],
          amenities: data.amenities || []
        });
        
        // Reset edit modes when switching PGs
        setEditMode({
          basicInfo: false,
          description: false,
          rules: false,
          amenities: false,
          photos: false
        });
        
        // Reset photo states
        setCoverPhotoFile(null);
        setOtherPhotosFiles([]);
        setDeletedPhotos([]);
      } catch (err) {
        console.error("Error fetching PG data:", err);
        console.error("Error response:", err.response);
        setError(err.response?.data?.message || "Failed to load PG data");
        setPgData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPgData();
  }, [selectedRID]);

  // Toggle edit mode for a section
  const toggleEditMode = (section) => {
    setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add new rule
  const handleAddRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule("");
    }
  };

  // Delete rule
  const handleDeleteRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  // Add new amenity
  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity("");
    }
  };

  // Delete amenity
  const handleDeleteAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  // Mark photo for deletion
  const handleMarkPhotoForDeletion = (photo) => {
    setDeletedPhotos(prev => [...prev, photo]);
  };

  // Unmark photo from deletion
  const handleUnmarkPhotoForDeletion = (photo) => {
    setDeletedPhotos(prev => prev.filter(p => p !== photo));
  };

  // Save section updates
  const handleSaveSection = async (section) => {
    if (!pgData?.RID) {
      alert("PG ID not found");
      return;
    }

    try {
      let updateData = {};
      
      if (section === "basicInfo") {
        updateData = {
          pgName: formData.pgName,
          address: formData.address
        };
      } else if (section === "description") {
        updateData = { description: formData.description };
      } else if (section === "rules") {
        updateData = { rules: formData.rules };
      } else if (section === "amenities") {
        updateData = { amenities: formData.amenities };
      }

      const response = await axios.put(
        `http://localhost:5000/pgs/${pgData.RID}`,
        updateData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setPgData(response.data);
      toggleEditMode(section);
      alert("Updated successfully!");
    } catch (err) {
      console.error("Error updating:", err);
      console.error("Error response:", err.response);
      alert(err.response?.data?.error || "Failed to update. Please try again.");
    }
  };

  // Handle photo uploads
  const handlePhotoUpload = async () => {
  if (!pgData?.RID) {
    alert("PG ID not found");
    return;
  }

  try {
    const formDataObj = new FormData();

    if (coverPhotoFile) formDataObj.append("coverPhoto", coverPhotoFile);
    otherPhotosFiles.forEach(file => formDataObj.append("otherPhotos", file));
    if (deletedPhotos.length > 0) formDataObj.append("deletedPhotos", JSON.stringify(deletedPhotos));

    const response = await axios.put(
      `http://localhost:5000/pgs/${pgData.RID}/photos`,
      formDataObj,
      {
        withCredentials: true
      }
    );

    setPgData(response.data);
    setCoverPhotoFile(null);
    setOtherPhotosFiles([]);
    setDeletedPhotos([]);
    toggleEditMode("photos");
    alert("Photos updated successfully!");
  } catch (err) {
    console.error("Error updating photos:", err);
    alert(err.response?.data?.error || "Failed to update photos. Please try again.");
  }
};

  // Show loading state from parent
  if (loadingPGs) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-2xl text-gray-600">Loading your PGs...</p>
        </div>
      </div>
    );
  }

  // Show message if no PGs owned
  if (!ownedPGsRID || ownedPGsRID.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
          <p className="text-2xl text-gray-600 mb-4">No PGs found</p>
          <p className="text-gray-500">You don't own any PGs yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen  pb-10">
      {/* Header with PG Selector */}
      <div className="w-full  top-0 z-50">
        <div className=" mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-gray-800">Update PG Information</h1>
            
            {/* PG Selector Dropdown */}
            {ownedPGsRID.length > 1 && (
              <div className="flex items-center gap-4">
                <label className="text-lg font-medium text-gray-700">Select PG:</label>
                <select
                  value={selectedRID}
                  onChange={(e) => setSelectedRID(e.target.value)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {ownedPGsRID.map((rid, index) => (
                    <option key={rid} value={rid}>
                      PG {index + 1} ({rid})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {ownedPGsRID.length === 1 && (
              <div className="text-sm text-gray-500">
                PG ID: {selectedRID}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-2xl text-gray-600">Loading PG details...</p>
            <p className="text-sm text-gray-400 mt-2">RID: {selectedRID}</p>
          </div>
        </div>
      ) : error || !pgData ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center p-12 rounded-2xl shadow-lg">
            <p className="text-xl text-red-500 mb-4">{error || "PG not found."}</p>
            <p className="text-sm text-gray-500 mb-4">RID: {selectedRID}</p>
            <button 
              onClick={() => setSelectedRID(selectedRID)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className=" mx-auto px-8 mt-8">
          {/* Photos Section */}
          <section className=" rounded-2xl  p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Photos</h2>
              <button
                onClick={() => toggleEditMode("photos")}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {editMode.photos ? "Cancel" : "Edit Photos"}
              </button>
            </div>

            {editMode.photos ? (
              <div className="space-y-6">
                {/* Cover Photo */}
                <div>
                  <label className="block text-lg font-medium mb-2">Cover Photo</label>
                  <div className="flex gap-4 items-center">
                    {pgData.coverPhoto && (
                      <img
                        src={`http://localhost:5000${pgData.coverPhoto}`}
                        alt="cover"
                        className="w-80 h-80 object-cover rounded-lg"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverPhotoFile(e.target.files[0])}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  {coverPhotoFile && (
                    <p className="text-sm text-green-600 mt-2">New file selected: {coverPhotoFile.name}</p>
                  )}
                </div>

                {/* Other Photos */}
                <div>
                  <label className="block text-lg font-medium mb-2">Other Photos</label>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {pgData.otherPhotos?.map((photo, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={`http://localhost:5000${photo}`}
                          alt={`photo-${idx}`}
                          className={`w-full h-80 object-cover rounded-lg ${
                            deletedPhotos.includes(photo) ? 'opacity-30' : ''
                          }`}
                        />
                        {deletedPhotos.includes(photo) ? (
                          <button
                            onClick={() => handleUnmarkPhotoForDeletion(photo)}
                            className="absolute top-2 right-2 bg-green-500 text-white rounded-full px-3 py-1 text-xs hover:bg-green-600 shadow-lg"
                          >
                            Undo
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkPhotoForDeletion(photo)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setOtherPhotosFiles(Array.from(e.target.files))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {otherPhotosFiles.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">{otherPhotosFiles.length} new file(s) selected</p>
                  )}
                  {deletedPhotos.length > 0 && (
                    <p className="text-sm text-red-600 mt-2">{deletedPhotos.length} photo(s) marked for deletion</p>
                  )}
                </div>

                <button
                  onClick={handlePhotoUpload}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                >
                  Save Photos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {pgData.coverPhoto && (
                  <div className="col-span-2 row-span-2">
                    <img
                      src={`http://localhost:5000${pgData.coverPhoto}`}
                      alt="cover"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
                {pgData.otherPhotos?.slice(0, 4).map((photo, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:5000${photo}`}
                    alt={`photo-${idx}`}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </section>

          {/* Basic Info Section */}
          <section className=" rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Basic Information</h2>
              <div className="flex gap-3">
                {editMode.basicInfo && (
                  <button
                    onClick={() => handleSaveSection("basicInfo")}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={() => toggleEditMode("basicInfo")}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  {editMode.basicInfo ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            {editMode.basicInfo ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-2">PG Name</label>
                  <input
                    type="text"
                    name="pgName"
                    value={formData.pgName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter PG name"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold mb-2">{pgData.pgName || "No name set"}</h3>
                <p className="text-lg text-gray-600">{pgData.address || "No address set"}</p>
              </div>
            )}
          </section>

          {/* Description Section */}
          <section className=" rounded-2xl  p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Description</h2>
              <div className="flex gap-3">
                {editMode.description && (
                  <button
                    onClick={() => handleSaveSection("description")}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={() => toggleEditMode("description")}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  {editMode.description ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            {editMode.description ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description"
              />
            ) : (
              <p className="text-lg text-gray-600">{pgData.description || "No description available"}</p>
            )}
          </section>

          {/* Rules Section */}
          <section className=" p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Rules</h2>
              <div className="flex gap-3">
                {editMode.rules && (
                  <button
                    onClick={() => handleSaveSection("rules")}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={() => toggleEditMode("rules")}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  {editMode.rules ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            {editMode.rules ? (
              <div className="space-y-4">
                {formData.rules.length === 0 ? (
                  <p className="text-gray-400 italic">No rules added yet</p>
                ) : (
                  formData.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      <span className="text-lg flex-1">{rule}</span>
                      <button
                        onClick={() => handleDeleteRule(idx)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
                <div className="flex gap-3 mt-4">
                  <input
                    type="text"
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                    placeholder="Add new rule"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddRule}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Add Rule
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.rules.length === 0 ? (
                  <p className="text-gray-400 italic">No rules set</p>
                ) : (
                  formData.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                      <span className="text-lg text-gray-600">{rule}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>

          {/* Amenities Section */}
          <section className=" p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Amenities</h2>
              <div className="flex gap-3">
                {editMode.amenities && (
                  <button
                    onClick={() => handleSaveSection("amenities")}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={() => toggleEditMode("amenities")}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  {editMode.amenities ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            {editMode.amenities ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {formData.amenities.length === 0 ? (
                    <p className="text-gray-400 italic col-span-2">No amenities added yet</p>
                  ) : (
                    formData.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-lg">{amenity}</span>
                        <button
                          onClick={() => handleDeleteAmenity(idx)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-3 mt-4">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAmenity()}
                    placeholder="Add new amenity"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddAmenity}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Add Amenity
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {formData.amenities.length === 0 ? (
                  <p className="text-gray-400 italic col-span-2">No amenities available</p>
                ) : (
                  formData.amenities.map((amenity, idx) => (
                    <div key={idx} className="text-lg text-gray-600">
                      • {amenity}
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default UpdatePGInfo;