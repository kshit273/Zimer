import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const MapComp = ({ plan = "basic", location }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapError, setMapError] = useState("");

  const getLatLng = (loc) => {
    if (!loc) return null;
    // GeoJSON { type: "Point", coordinates: [lng, lat] }
    if (typeof loc === "object" && !Array.isArray(loc) && Array.isArray(loc.coordinates)) {
      const [lng, lat] = loc.coordinates;
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }
    // [lat, lng]
    if (Array.isArray(loc) && loc.length === 2) {
      const lat = Number(loc[0]);
      const lng = Number(loc[1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }
    // {lat, lng}
    if (typeof loc === "object" && loc !== null && "lat" in loc && "lng" in loc) {
      const lat = Number(loc.lat);
      const lng = Number(loc.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }
    return null;
  };

  useEffect(() => {
    if (plan === "basic") return;

    const pos = getLatLng(location);
    if (!pos) {
      setMapError("Location not available for this PG.");
      return;
    }

    let isMounted = true;

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader
      .load()
      .then((google) => {
        if (!isMounted) return;
        setMapError("");

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center: pos,
            zoom: 16,
            mapId: import.meta.env.VITE_GOOGLE_MAP_ID || undefined,
          });
        } else {
          mapInstanceRef.current.panTo(pos);
        }

        if (!markerRef.current) {
          markerRef.current = new google.maps.Marker({
            position: pos,
            map: mapInstanceRef.current,
          });
        } else {
          markerRef.current.setPosition(pos);
        }
      })
      .catch((err) => {
        console.error("[MapComp] Google Maps load error:", err);
        if (!isMounted) return;
        setMapError("Failed to load map. Please try again later.");
      });

    return () => {
      isMounted = false;
    };
  }, [plan, location]);

  return (
    <div className="w-[420px] h-[470px] bg-[#d9d9d9] rounded-[20px] flex flex-col gap-[15px] px-[10px] py-[8px] ">
      <div className="flex justify-between items-center px-[15px]">
        <div className=" flex flex-col gap-0 mt-[7px]">
          <p className="text-[#1a1a1a] text-[24px] font-medium   ">
            Where you'll be
          </p>
          <p className="text-[#8c8c8c] text-[16px] font-medium ">
            Explore the location of this PG on the map
          </p>
        </div>
        <div className="p-[5px] bg-[#c6c6c6] rounded-full hover:bg-[#9f9f9f] duration-300 cursor-pointer">
          <img src="/images/info.png" alt="" className="h-[16px] w-[16px]" />
        </div>
      </div>

      <div className="flex items-center justify-center">
        {plan === "basic" ? (
          <>
            <img src="/images/mapComp.png" alt="" className="blur-xs w-[470px]" />
            <div className="absolute bg-[#e9e9e9] px-5 py-3 rounded-[20px] flex items-center gap-[20px]">
              <div>
                <img src="/images/lock.png" alt="" className="h-[25px] w-[25px]" />
              </div>
              <p className="text-[20px]">{mapError || "For verified PGs"}</p>
            </div>
          </>
        ) : mapError ? (
          <div className="w-[390px] h-[360px] bg-[#e9e9e9] rounded-[16px] flex items-center justify-center px-6 text-center text-[#1a1a1a]">
            {mapError}
          </div>
        ) : (
          <div
            ref={mapRef}
            className="w-[390px] h-[360px] rounded-[16px] overflow-hidden"
          />
        )}
      </div>
    </div>
  );
};

export default MapComp;
