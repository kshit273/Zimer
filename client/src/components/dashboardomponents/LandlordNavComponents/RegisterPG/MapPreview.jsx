
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const containerStyle = {
  width: "100%",
  height: "800px",
  borderRadius: "16px",
};

const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi fallback

const MapPreview = ({ address, pincode, onLocationSelect, onAddressSelect }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const googleRef = useRef(null);
  const clickListenerRef = useRef(null);
  
  // Track if user has manually placed a pin
  const userHasClickedMap = useRef(false);

  // --- Initialize Google Maps once ---
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    let isMounted = true;

    loader.load().then((google) => {
      if (!isMounted) return;
      googleRef.current = google;
      geocoderRef.current = new google.maps.Geocoder();

      // Initialize map with default center
      if (!mapInstance.current) {
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 12, // City level zoom
          mapId: import.meta.env.VITE_GOOGLE_MAP_ID || undefined,
        });
      }

      // Add click listener - this is the ONLY way to place a pin
      if (!clickListenerRef.current) {
        clickListenerRef.current = mapInstance.current.addListener("click", (e) => {
          const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          console.log("[MapPreview] Map clicked:", pos);

          // Mark that user has clicked
          userHasClickedMap.current = true;

          // Create or move marker
          if (!markerRef.current) {
            markerRef.current = new google.maps.Marker({
              position: pos,
              map: mapInstance.current,
            });
          } else {
            markerRef.current.setPosition(pos);
          }

          // Inform parent about location
          onLocationSelect?.(pos);

          // Reverse geocode clicked location
          geocoderRef.current
            .geocode({ location: pos })
            .then((res) => {
              if (res && res.results && res.results[0]) {
                try {
                  const comps = res.results[0].address_components || [];
                  let addressline1 = "";
                  let addressline2 = "";
                  let city = "";
                  let state = "";
                  let pin = "";

                  comps.forEach((comp) => {
                    if (comp.types.includes("street_number")) {
                      addressline1 = comp.long_name + (addressline1 ? " " + addressline1 : "");
                    }
                    if (comp.types.includes("route")) {
                      addressline1 = (addressline1 ? addressline1 + " " : "") + comp.long_name;
                    }
                    if (comp.types.includes("neighborhood")) {
                      addressline1 = (addressline1 ? addressline1 + " " : "") + comp.long_name;
                    }
                    if (comp.types.includes("sublocality") || comp.types.includes("sublocality_level_1")) {
                      addressline2 = comp.long_name;
                    }
                    if (comp.types.includes("locality")) {
                      city = comp.long_name;
                    }
                    if (comp.types.includes("administrative_area_level_1")) {
                      state = comp.long_name;
                    }
                  });

                  const addrObj = {
                    line1: addressline1, 
                    line2: addressline2,
                    landmark: "",
                    city,
                    state,
                    pin,
                  };

                  onAddressSelect?.(addrObj);
                } catch (err) {
                  console.error("[DEBUG] geocode parsing error:", err);
                }
              }
            })
            .catch((err) => console.error("[MapPreview] Reverse geocode error:", err));

        });
      }

      // Get user's location for fallback
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (!isMounted) return;
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            
            // Only use user location if no pincode is provided
            if (!pincode && mapInstance.current) {
              // Geocode user location to get city
              geocoderRef.current
                .geocode({ location: userPos })
                .then((res) => {
                  if (res.results && res.results[0]) {
                    const comps = res.results[0].address_components || [];
                    const city = comps.find(comp => comp.types.includes("locality"))?.long_name;
                    if (city && mapInstance.current) {
                      // Pan to city center, not exact user location
                      mapInstance.current.panTo(userPos);
                      mapInstance.current.setZoom(12);
                    }
                  }
                })
                .catch((err) => console.error("[MapPreview] User location geocode error:", err));
            }
          },
          (error) => {
            console.log("[MapPreview] Geolocation error:", error);
          }
        );
      }
    });

    return () => {
      isMounted = false;
      if (clickListenerRef.current && clickListenerRef.current.remove) {
        clickListenerRef.current.remove();
      } else if (clickListenerRef.current) {
        googleRef.current?.maps?.event?.clearListeners(mapInstance.current, "click");
      }
      mapInstance.current = null;
      markerRef.current = null;
      geocoderRef.current = null;
      googleRef.current = null;
    };
  }, []);

  // --- Handle pincode changes (show city level) ---
  useEffect(() => {
    if (!pincode || !geocoderRef.current || !mapInstance.current) return;
    if (userHasClickedMap.current) return; // Don't move map if user has already placed a pin

    console.log("[MapPreview] Geocoding pincode:", pincode);

    geocoderRef.current
      .geocode({ address: pincode + ", India" })
      .then((res) => {
        if (res.results && res.results[0]) {
          const loc = res.results[0].geometry.location;
          const pos = { lat: loc.lat(), lng: loc.lng() };
          
          // Pan to city center with city-level zoom
          mapInstance.current.panTo(pos);
          mapInstance.current.setZoom(12);
        }
      })
      .catch((err) => console.error("[MapPreview] Pincode geocode error:", err));
  }, [pincode]);

  // --- Handle full address changes (show area, no pin) ---
  useEffect(() => {
    if (!address || !address.trim() || !geocoderRef.current || !mapInstance.current) return;
    if (userHasClickedMap.current) return; // Don't move map if user has already placed a pin

    console.log("[MapPreview] Geocoding full address:", address);

    geocoderRef.current
      .geocode({ address })
      .then((res) => {
        if (res.results && res.results[0]) {
          const loc = res.results[0].geometry.location;
          const pos = { lat: loc.lat(), lng: loc.lng() };
          
          // Pan to address area with street-level zoom, but NO PIN
          mapInstance.current.panTo(pos);
          mapInstance.current.setZoom(16);
        }
      })
      .catch((err) => console.error("[MapPreview] Address geocode error:", err));
  }, [address]);

  return <div ref={mapRef} style={containerStyle} />;
};

export default MapPreview;