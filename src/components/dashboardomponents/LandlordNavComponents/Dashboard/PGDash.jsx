import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomTemp from "./RoomTemp";
import Loader from "../RegisterPG/Loader";

const PGDash = ({ pgData, loading, error }) => {
  const [roomsWithTenantData, setRoomsWithTenantData] = useState([]);
  const [tenantDataLoading, setTenantDataLoading] = useState(false);
  const [tenantDataError, setTenantDataError] = useState(null);

  const API_BASE = "http://localhost:5000"; // backend port

  // Function to fetch multiple tenants in a single API call
  const fetchTenantsInBatch = async (tenantIds) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/tenants-batch`, {
        tenantIds
      }, {
        headers: { 
          "Content-Type": "application/json"
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error fetching tenants in batch:", error);
      if (error.response) {
        // Server responded with error status
        throw new Error(`Failed to fetch tenant data: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("No response from server. Please check your connection.");
      } else {
        // Something else happened
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  };

  // Function to process rooms with tenant data
  const processRoomsWithTenantData = async (rooms) => {
    setTenantDataLoading(true);
    setTenantDataError(null);

    try {
      // Collect all unique tenant IDs from all rooms (but keep room relationship)
      const allTenantIds = [];
      const roomTenantMap = {}; // roomIndex -> tenantId[]

      rooms.forEach((room, roomIndex) => {
        // extract just tenantId from each tenant object
        const tenantIds = (room.tenants || [])
          .map(t => t.tenantId)
          .filter(Boolean); 
        roomTenantMap[roomIndex] = tenantIds;

        if (tenantIds.length > 0) {
          allTenantIds.push(...tenantIds);
        }
      });

      // Remove duplicates for API efficiency
      const uniqueTenantIds = [
        ...new Set(
          allTenantIds
            .filter(id => id) // only keep defined ids
            .map(id => id.toString())
        )
      ];

      if (uniqueTenantIds.length === 0) {
        // No tenants to fetch
        const roomsWithEmptyTenants = rooms.map(room => ({
          ...room,
          tenants: []
        }));
        setRoomsWithTenantData(roomsWithEmptyTenants);
        return;
      }

      // Fetch all tenant data in batch
      const tenantDataArray = await fetchTenantsInBatch(uniqueTenantIds);

      // Create a lookup map for quick tenant data access
      const tenantDataMap = {};
      tenantDataArray.tenants.forEach(tenant => {
        tenantDataMap[tenant._id.toString()] = tenant;
      });

      // Map tenant data back to their respective rooms
      const roomsWithData = rooms.map((room, roomIndex) => {
        const tenantIds = roomTenantMap[roomIndex];

        if (!tenantIds || tenantIds.length === 0) {
          return { ...room, tenants: [] };
        }

        // Merge tenant data with room tenant info (keeping payments, joinDate, etc.)
        const roomTenants = room.tenants.map(roomTenant => {
          const tenantData = tenantDataMap[roomTenant.tenantId.toString()];
          if (tenantData) {
            return {
              ...roomTenant, // Keep original tenant info (joinDate, payments, etc.)
              tenantDetails: tenantData // Add fetched tenant details
            };
          }
          return roomTenant;
        }).filter(tenant => tenant.tenantDetails); // Only keep tenants with valid data

        return {
          ...room,
          tenants: roomTenants
        };
      });

      setRoomsWithTenantData(roomsWithData);
    } catch (error) {
      console.error("Error processing tenant data:", error);
      setTenantDataError("Failed to load tenant information");

      // Fallback: set rooms with empty tenant arrays
      const fallbackRooms = rooms.map(room => ({
        ...room,
        tenants: []
      }));
      setRoomsWithTenantData(fallbackRooms);
    } finally {
      setTenantDataLoading(false);
    }
  };

  // Process rooms when pgData changes
  useEffect(() => {
    if (pgData && pgData.rooms && pgData.rooms.length > 0) {
      processRoomsWithTenantData(pgData.rooms);
    } else if (pgData && pgData.rooms) {
      // Handle case with empty rooms array
      setRoomsWithTenantData([]);
    }
  }, [pgData]);

  // Handle case where pgData is not available
  if (!pgData || !pgData.rooms) {
    return (
      <div className="w-full bg-[#d9d9d9] p-4 rounded-[20px]">
        <div className="text-[28px] font-medium text-[#5c5c5c]">
          No PG data available
        </div>
      </div>
    );
  }
  
  // Loading State
  if (loading || tenantDataLoading) {
    return (
      <div className="w-full rounded-lg p-8 flex flex-col gap-4 items-center justify-center">
        <Loader/>
        <div className="text-center">
          <p className="text-gray-600 font-medium text-[18px]">
            {loading ? "Loading PG data..." : "Loading tenant information..."}
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || tenantDataError) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error || tenantDataError}</p>
        {tenantDataError && roomsWithTenantData.length > 0 && (
          <p className="text-orange-600 mt-2">
            Showing rooms without tenant details due to loading error.
          </p>
        )}
      </div>
    );
  }

  // No rooms available
  if (pgData.rooms.length === 0) {
    return (
      <div className="w-full bg-[#d9d9d9] p-4 rounded-[20px]">
        <div className="text-[28px] font-medium text-[#5c5c5c]">
          Rooms in {pgData.pgName || "PG"}
        </div>
        <div className="text-center text-[#5c5c5c] text-lg mt-8">
          No rooms available in this PG
        </div>
      </div>
    );
  }

  // Main render with tenant data
  return (
    <div className="w-full bg-[#d9d9d9] p-4 rounded-[20px]">
      <div className="text-[28px] font-medium text-[#5c5c5c]">
        Rooms in {pgData.pgName || "PG"}
      </div>

      {/* Masonry Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 my-4">
        {roomsWithTenantData.map((room, index) => (
          <div key={room.roomId || index} className="mb-4 break-inside-avoid">
            <RoomTemp
              roomId={room.roomId}
              roomType={room.roomType}
              tenants={room.tenants || []}
              rent={room.rent}
              furnished={room.furnished}
              amenities={room.amenities || []}
              photos={room.photos || []}
              security={room.security}
              availableFrom={room.availableFrom}
              description={room.description}
              PGID={pgData.RID}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PGDash;