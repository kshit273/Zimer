import AdminCard from "./AdminCard";
import DropdownComp from "./DropdownComp";
import PGList from "./PGList";
import AdminStyles from "./AdminStyles";
import { useState, useEffect } from "react";
import PGDetail from "./PGDetail";
import TenantDetail from "./TenantDetail";
import axios from "axios";

// ── View enum ──
const VIEW = { LIST: "list", PG: "pg", TENANT: "tenant" };

// ── Axios instance with admin token ──
const adminAxios = axios.create({ baseURL: "http://localhost:5000", withCredentials: true,});

const AdminDashboard = ({ adminUser, setAdminUser }) => {
  const [view,           setView]           = useState(VIEW.LIST);
  const [selectedPG,     setSelectedPG]     = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null); // { tenantDoc, pgContext }

  // ── API data ──
  const [pgList,      setPgList]      = useState([]);           // from /admin/pgs
  const [pgDetail,    setPgDetail]    = useState(null);         // from /admin/:pgId
  const [tenantData,  setTenantData]  = useState(null);         // from /admin/tenant/:tenantId

  // ── Loading / error states ──
  const [pgListLoading,     setPgListLoading]     = useState(false);
  const [pgDetailLoading,   setPgDetailLoading]   = useState(false);
  const [tenantDataLoading, setTenantDataLoading] = useState(false);
  const [pgListError,       setPgListError]       = useState(null);
  const [pgDetailError,     setPgDetailError]     = useState(null);
  const [tenantDataError,   setTenantDataError]   = useState(null);

  const back = () => window.history.back();

  // ── 1. Fetch PG list on mount (uses adminUser.managedPGs) ────────────────────
  useEffect(() => {
    if (!adminUser?.managedPGs?.length) return;

    const fetchPGList = async () => {
      setPgListLoading(true);
      setPgListError(null);
      try {
        const res = await adminAxios.get("/admin/pgs", {
          params: { rids: adminUser.managedPGs },
        });
        setPgList(res.data.pgs || []);
      } catch (err) {
        setPgListError(
          err?.response?.data?.message || "Failed to load properties."
        );
      } finally {
        setPgListLoading(false);
      }
    };

    fetchPGList();
  }, [adminUser?.managedPGs]);

  // ── 2. Fetch full PG details when a PG card is clicked ──────────────────────
  const fetchPGDetail = async (pg) => {
    setSelectedPG(pg);       // set immediately so RID shows in header
    setPgDetail(null);
    setPgDetailError(null);
    setPgDetailLoading(true);
    setView(VIEW.PG);

    try {
      const res = await adminAxios.get(`/admin/${pg.RID}`);
      setPgDetail(res.data.pg);
    } catch (err) {
      setPgDetailError(
        err?.response?.data?.message || "Failed to load PG details."
      );
    } finally {
      setPgDetailLoading(false);
    }
  };

  // ── 3. Fetch tenant data when a tenant row is clicked ───────────────────────
  const fetchTenantData = async (tenantDoc, pgContext) => {
    setSelectedTenant({ tenantDoc, pgContext });
    setTenantData(null);
    setTenantDataError(null);
    setTenantDataLoading(true);
    setView(VIEW.TENANT);

    try {
      const res = await adminAxios.get(`/admin/tenant/${tenantDoc.tenantId}`);
      setTenantData(res.data.tenant || res.data);
    } catch (err) {
      setTenantDataError(
        err?.response?.data?.message || "Failed to load tenant data."
      );
    } finally {
      setTenantDataLoading(false);
    }
  };

  // ── Back handlers ────────────────────────────────────────────────────────────
  const handleBackFromPG = () => {
    setSelectedPG(null);
    setPgDetail(null);
    setPgDetailError(null);
    setView(VIEW.LIST);
  };

  const handleBackFromTenant = () => {
    setSelectedTenant(null);
    setTenantData(null);
    setTenantDataError(null);
    setView(VIEW.PG);
  };

  // ── Section label / sub per view ─────────────────────────────────────────────
  const sectionLabel = {
    [VIEW.LIST]:   "Managed Properties",
    [VIEW.PG]:     "Property Detail",
    [VIEW.TENANT]: "Tenant Profile",
  }[view];

  const sectionSub = {
    [VIEW.LIST]:   null,
    [VIEW.PG]:     selectedPG?.RID,
    [VIEW.TENANT]: selectedTenant
      ? `···${String(selectedTenant.tenantDoc.tenantId).slice(-8)}`
      : null,
  }[view];

  return (
    <>
      <AdminStyles />

      <div className="font-dm-mono min-h-screen bg-[#0a0a0a] text-[#e8e8e0] relative overflow-x-hidden">

        {/* Fixed dot-grid backdrop */}
        <div className="admin-grid-bg fixed inset-0 pointer-events-none z-0" />

        {/* Diagonal accent glow — top right */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none z-0"
          style={{ background: "radial-gradient(circle at 80% 10%, rgba(215,38,56,0.04) 0%, transparent 60%)" }} />

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

            {/* ── Left panel ── */}
            <div className="xl:w-[75%] bg-[#111111] border border-[#1f1f1f] rounded-2xl p-5 min-h-[500px] flex flex-col">

              {/* Panel header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#1f1f1f] flex-shrink-0">
                <div className="w-3 h-px bg-[#d72638]" />
                <span className="text-[0.9rem] tracking-[0.22em] text-[#555550] uppercase">
                  {sectionLabel}
                </span>
                {sectionSub && (
                  <span className="ml-auto text-[0.85rem] tracking-[0.12em] text-[#2a2a2a] uppercase">
                    {sectionSub}
                  </span>
                )}
              </div>

              {/* ── Swap zone — 3 views ── */}
              <div className="flex-1 overflow-hidden">

                {/* ── LIST view ── */}
                {view === VIEW.LIST && (
                  <>
                    {pgListLoading && <PanelLoader text="Loading properties…" />}
                    {pgListError   && <PanelError  text={pgListError} />}
                    {!pgListLoading && !pgListError && (
                      <PGList
                        managedPGs={pgList}
                        onSelectPG={fetchPGDetail}
                      />
                    )}
                  </>
                )}

                {/* ── PG DETAIL view ── */}
                {view === VIEW.PG && (
                  <>
                    {pgDetailLoading && <PanelLoader text="Loading property details…" />}
                    {pgDetailError   && <PanelError  text={pgDetailError} onBack={handleBackFromPG} />}
                    {!pgDetailLoading && !pgDetailError && (
                      <PGDetail
                        pg={pgDetail || selectedPG}
                        onBack={handleBackFromPG}
                        onSelectTenant={fetchTenantData}
                      />
                    )}
                  </>
                )}

                {/* ── TENANT view ── */}
                {view === VIEW.TENANT && (
                  <>
                    {tenantDataLoading && <PanelLoader text="Loading tenant profile…" />}
                    {tenantDataError   && <PanelError  text={tenantDataError} onBack={handleBackFromTenant} />}
                    {!tenantDataLoading && (
                      <TenantDetail
                        tenant={selectedTenant?.tenantDoc}
                        tenantData={tenantData}
                        pgContext={selectedTenant?.pgContext}
                        onBack={handleBackFromTenant}
                      />
                    )}
                  </>
                )}

              </div>
            </div>

            {/* ── Right — Admin card + dropdowns ── */}
            <div className="xl:w-[25%] flex flex-col gap-4">
              <div className="fade-up fade-up-d2">
                <AdminCard admin={adminUser} />
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
                    { name: "Peter Beniwal",  contact: "+91 9368578171", email: "petermjben@gmail.com",   reqTime: "04:13 pm 12 Feb,2026", RID: "ROORAM49c80", pgName: "Arora PG" },
                    { name: "Jesse Pinkman",  contact: "+91 9368578172", email: "jessepinkman@gmail.com", reqTime: "04:13 pm 12 Feb,2026", RID: "DEHDIT49c80", pgName: "Maya PG" },
                    { name: "Walter White",   contact: "+91 9368578173", email: "walterhwhite@gmail.com", reqTime: "04:13 pm 12 Feb,2026", RID: "DEHUIT49c80", pgName: "Parihars home" },
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

// ── Shared panel states ───────────────────────────────────────────────────────

const PanelLoader = ({ text }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
    <div className="w-6 h-6 rounded-full border-2 border-[#1f1f1f] border-t-[#d72638]"
      style={{ animation: "spin-loader 0.8s linear infinite" }} />
    <span className="text-[0.65rem] tracking-[0.2em] text-[#555550] uppercase">{text}</span>
  </div>
);

const PanelError = ({ text, onBack }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
    <span className="text-[#d72638] text-lg">⚠</span>
    <span className="text-[0.68rem] tracking-[0.1em] text-[#555550] text-center max-w-xs">{text}</span>
    {onBack && (
      <button
        onClick={onBack}
        className="mt-2 text-[0.6rem] tracking-[0.2em] uppercase text-[#555550] hover:text-[#d72638] transition-colors duration-200"
      >
        ← Go back
      </button>
    )}
  </div>
);

export default AdminDashboard;