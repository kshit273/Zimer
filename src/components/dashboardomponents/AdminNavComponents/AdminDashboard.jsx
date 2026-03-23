import AdminCard from "./AdminCard";
import DropdownComp from "./DropdownComp";
import PGList from "./PGList";
import AdminStyles from "./AdminStyles";
import { useState } from "react";
import PGDetail from "./PGDetail";

const AdminDashboard = () => {
  const [selectedPG, setSelectedPG] = useState(null);
  const back = () => window.history.back();

  return (
    <>
      <AdminStyles />

      <div className="font-dm-mono min-h-screen bg-[#0a0a0a] text-[#e8e8e0] relative overflow-x-hidden">

        {/* Fixed dot-grid backdrop */}
        <div className="admin-grid-bg fixed inset-0 pointer-events-none z-0" />

        {/* Diagonal accent glow — top right */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none z-0"
          style={{ background: "radial-gradient(circle at 80% 10%, rgba(200,241,53,0.04) 0%, transparent 60%)" }} />

        <div className="relative z-10 px-6 py-8 md:px-10 md:py-10 mx-auto flex flex-col gap-8">

          {/* ── Top bar ── */}
          <div className="fade-up flex items-center justify-between">
            <button
              onClick={back}
              className="flex items-center gap-2 text-[1rem] tracking-[0.2em] uppercase text-[#555550] hover:text-[#d72638] transition-colors duration-200 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">←</span>
              Back
            </button>

            <div className="flex items-center gap-2">
              <span className="pulse-dot block w-1.5 h-1.5 rounded-full bg-[#d72638]" />
              <span className="text-[0.95rem] tracking-[0.2em] text-[#555550] uppercase hidden sm:block">
                System operational
              </span>
            </div>
          </div>

          {/* ── Page heading ── */}
          <div className="fade-up fade-up-d1 border-b border-[#1f1f1f] pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-5 h-px bg-[#d72638]" />
              <span className="text-[0.95rem] tracking-[0.25em] text-[#555550] uppercase">
                Zimer // Restricted access
              </span>
            </div>
            <h1
              className="font-bebas text-[#e8e8e0] leading-none tracking-wide"
              style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)" }}
            >
              ADMIN DASHBOARD
            </h1>
          </div>

          {/* ── Main grid ── */}
          <div className="fade-up fade-up-d2 flex flex-col xl:flex-row gap-6">

            {/* Left — PG list */}
            <div className="xl:w-[75%] bg-[#111111] border border-[#1f1f1f] rounded-2xl p-5 min-h-[500px] flex flex-col">
 
              {/* Section label — changes based on view */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#1f1f1f] flex-shrink-0">
                <div className="w-3 h-px bg-[#c8f135]" />
                <span className="text-[0.6rem] tracking-[0.22em] text-[#555550] uppercase">
                  {selectedPG ? "Property Detail" : "Managed Properties"}
                </span>
                {selectedPG && (
                  <span className="ml-auto text-[0.55rem] tracking-[0.12em] text-[#2a2a2a] uppercase">
                    {selectedPG.RID || "—"}
                  </span>
                )}
              </div>
 
              {/* Swap zone */}
              <div className="flex-1 overflow-hidden">
                {selectedPG ? (
                  <PGDetail
                    pg={selectedPG}
                    onBack={() => setSelectedPG(null)}
                  />
                ) : (
                  <PGList
                    managedPGs={[{
                        RID: "DEH001",
                        pgName: "Sunrise Boys PG",
                        coverPhoto: "https://example.com/cover1.jpg",
                        otherPhotos: [
                          "https://example.com/room1.jpg",
                          "https://example.com/room2.jpg"
                        ],
                        address: "Rajpur Road, Dehradun",
                        description: "Comfortable PG with modern facilities and great location.",
                        amenities: ["WiFi", "Laundry", "Parking", "Power Backup"],

                        LID: "65f1a1a1a1a1a1a1a1a1a1a1",

                        gender: "boys",

                        rooms: [
                          {
                            roomId: "R101",
                            roomType: "double",
                            rent: 8000,
                            amenities: ["AC", "Attached Bathroom"],
                            photos: ["https://example.com/r101.jpg"],
                            security: 5000,
                            description: "Spacious double sharing room",

                            tenants: [
                              {
                                tenantId: "65f2b2b2b2b2b2b2b2b2b2b2",
                                joinDate: new Date("2026-01-10"),
                                payments: [
                                  {
                                    month: "January",
                                    amount: 8000,
                                    paidOn: new Date("2026-01-05")
                                  }
                                ]
                              }
                            ]
                          }
                        ],

                        additionalInfo: "Near main market",
                        rules: ["No smoking", "No loud music after 10 PM"],

                        foodAvailable: true,
                        foodDescription: "Veg meals twice a day",
                        menu: ["Dal", "Rice", "Roti", "Sabzi"],
                        selfCookingAllowed: false,
                        tiffinServiceAvailable: true,

                        reviews: [
                          {
                            userId: "65f3c3c3c3c3c3c3c3c3c3c3",
                            reviewText: "Very nice PG, clean and safe.",
                            ratings: {
                              community: 4,
                              value: 5,
                              location: 5,
                              landlord: 4
                            },
                            overallRating: 4.5
                          }
                        ],

                        averageRatings: {
                          community: 4,
                          value: 5,
                          location: 5,
                          landlord: 4,
                          overall: 4.5
                        },

                        totalReviews: 1,
                        plan: "popular"
                      },

                      {
                        RID: "DEH002",
                        pgName: "Maya Girls PG",
                        coverPhoto: "https://example.com/cover2.jpg",
                        otherPhotos: [
                          "https://example.com/room3.jpg"
                        ],
                        address: "Prem Nagar, Dehradun",
                        description: "Affordable PG for students with peaceful environment.",
                        amenities: ["WiFi", "CCTV"],

                        LID: "65f4d4d4d4d4d4d4d4d4d4d4",

                        gender: "girls",

                        rooms: [
                          {
                            roomId: "R201",
                            roomType: "triple",
                            rent: 6000,
                            amenities: ["Fan", "Shared Bathroom"],
                            photos: [],
                            security: 3000,
                            description: "Budget-friendly triple sharing",

                            tenants: []
                          }
                        ],

                        additionalInfo: "Close to colleges",
                        rules: ["Entry before 9 PM"],

                        foodAvailable: false,
                        selfCookingAllowed: true,
                        tiffinServiceAvailable: false,

                        reviews: [],

                        averageRatings: {
                          community: 0,
                          value: 0,
                          location: 0,
                          landlord: 0,
                          overall: 0
                        },

                        totalReviews: 0,
                        plan: "basic"
                      },

                      {
                        RID: "DEH003",
                        pgName: "Elite Co-Living Space",
                        coverPhoto: "https://example.com/cover3.jpg",
                        otherPhotos: [],
                        address: "IT Park, Dehradun",
                        description: "Premium co-living with luxury facilities.",
                        amenities: ["WiFi", "Gym", "Housekeeping", "AC", "Lift"],

                        LID: "65f5e5e5e5e5e5e5e5e5e5e5",

                        gender: "both",

                        rooms: [
                          {
                            roomId: "R301",
                            roomType: "single",
                            rent: 15000,
                            amenities: ["AC", "Private Bathroom", "Balcony"],
                            photos: [],
                            security: 10000,
                            description: "Luxury single room",

                            tenants: []
                          }
                        ],

                        additionalInfo: "High-end living",
                        rules: ["No parties", "Guests allowed with permission"],

                        foodAvailable: true,
                        foodDescription: "Premium meal plan",
                        menu: ["Paneer", "Salad", "Juice"],
                        selfCookingAllowed: false,
                        tiffinServiceAvailable: false,

                        reviews: [],

                        averageRatings: {
                          community: 0,
                          value: 0,
                          location: 0,
                          landlord: 0,
                          overall: 0
                        },

                        totalReviews: 0,
                        plan: "premium"
                      }
                    ]}
                    onSelectPG={(pg) => setSelectedPG(pg)}
                  />
                )}
              </div>
 
            </div>

            {/* Right — Admin card + dropdowns */}
            <div className="xl:w-[25%] flex flex-col gap-4">
              <div className="fade-up fade-up-d2">
                <AdminCard />
              </div>

              {/* Notifications section label */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-3 h-px bg-[#d72638]" />
                <span className="text-[0.9rem] tracking-[0.22em] text-[#555550] uppercase">
                  Notifications
                </span>
              </div>

              <div className="flex flex-col gap-3 fade-up fade-up-d3">
                <DropdownComp
                  heading="Booking"
                  data={[
                    { name: "Peter Beniwal",  contact: "+91 9368578171", email: "petermjben@gmail.com",    reqTime: "04:13 pm 12 Feb,2026", RID: "ROORAM49c80", pgName: "Arora PG" },
                    { name: "Jesse Pinkman",  contact: "+91 9368578172", email: "jessepinkman@gmail.com",  reqTime: "04:13 pm 12 Feb,2026", RID: "DEHDIT49c80", pgName: "Maya PG" },
                    { name: "Walter White",   contact: "+91 9368578173", email: "walterhwhite@gmail.com",  reqTime: "04:13 pm 12 Feb,2026", RID: "DEHUIT49c80", pgName: "Parihars home" },
                  ]}
                />
                <DropdownComp
                  heading="Join"
                  data={[
                    { tenantEmail: "tenant@gmail.com", tenantPhone: "+91 9368578171", RID: "DEHPREe5be03", roomId: "1000026309", message: "Kshitij Sharma has requested to join room 1769934860787", status: "pending", metadata: { tenantName: "Kshitij Sharma", moveInDate: "2026-02-15T09:07:30.285+00:00", reason: "blah blah blah" }, createdAt: "2026-02-15T09:07:30.484+00:00" },
                    { tenantEmail: "tenant@gmail.com", tenantPhone: "+91 9368578171", RID: "DEHPREe5be03", roomId: "1000026309", message: "Kshitij Sharma has requested to join room 1769934860787", status: "pending", metadata: { tenantName: "Kshitij Sharma", moveInDate: "2026-02-15T09:07:30.285+00:00", reason: "blah blah blah" }, createdAt: "2026-02-15T09:07:30.484+00:00" },
                  ]}
                />
                <DropdownComp
                  heading="Leave"
                  data={[
                    { RID: "DEHPREe5be03", message: "Kshitij Sharma has requested to leave room 1769934860787", status: "pending", metadata: { tenantName: "Kshitij Sharma", moveOutDate: "2026-02-15T09:07:30.285+00:00", reason: "blah blah blah" }, createdAt: "2026-02-15T09:07:30.484+00:00" },
                    { RID: "DEHPREe5be03", message: "Kshitij Sharma has requested to leave room 1769934860787", status: "pending", metadata: { tenantName: "Kshitij Sharma", moveOutDate: "2026-02-15T09:07:30.285+00:00", reason: "blah blah blah" }, createdAt: "2026-02-15T09:07:30.484+00:00" },
                  ]}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;