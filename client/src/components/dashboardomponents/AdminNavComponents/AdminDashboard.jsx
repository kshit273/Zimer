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

  const [brData,        setBrData]        = useState([]);
  const [brLoading,     setBrLoading]     = useState(false);
  const [brError,       setBrError]       = useState(null);

  const [jrData,        setJrData]        = useState([]);
  const [jrLoading,     setJrLoading]     = useState(false);
  const [jrError,       setJrError]       = useState(null);

  const [lrData,        setLrData]        = useState([]);
  const [lrLoading,     setLrLoading]     = useState(false);
  const [lrError,       setLrError]       = useState(null);

  const [reqData,       setReqData]       = useState([]);
  const [reqLoading,    setReqLoading]    = useState(false);
  const [reqError,      setReqError]      = useState(null);

  const [notifData,     setNotifData]     = useState([]);
  const [notifLoading,  setNotifLoading]  = useState(false);
  const [notifError,    setNotifError]    = useState(null);

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

  useEffect(() => {
  const fetchBRData = async () => {
    setBrLoading(true);
    setBrError(null);
    try {
      const res = await adminAxios.get("/admin/br");
      setBrData(res.data.brs || []);
    } catch (err) {
      setBrError(err?.response?.data?.message || "Failed to load booking requests.");
    } finally {
      setBrLoading(false);
    }
  };

  fetchBRData();
}, []);

  // ── Fetch Join Request notifications ──
  useEffect(() => {
    const fetchJRData = async () => {
      setJrLoading(true);
      setJrError(null);
      try {
        const res = await adminAxios.get("/admin/jr");
        setJrData(res.data.jrs || []);
      } catch (err) {
        setJrError(err?.response?.data?.message || "Failed to load join requests.");
      } finally {
        setJrLoading(false);
      }
    };

    fetchJRData();
  }, []);

  // ── Fetch Leave Request notifications (pending_ztrs) ──
  useEffect(() => {
    if (!adminUser?.managedPGs?.length) return;

    const fetchLRData = async () => {
      setLrLoading(true);
      setLrError(null);
      try {
        // Fetch pending_ztrs leave notifications for each managed PG and merge
        const requests = adminUser.managedPGs.map((rid) =>
          adminAxios.get("/notifications/", {
            params: { type: "leave_request", status: "pending_ztrs", pgId: rid },
          })
        );
        const responses = await Promise.all(requests);
        const merged = responses.flatMap((res) => res.data.notifications || []);
        setLrData(merged);
      } catch (err) {
        setLrError(err?.response?.data?.message || "Failed to load leave requests.");
      } finally {
        setLrLoading(false);
      }
    };

    fetchLRData();
  }, [adminUser?.managedPGs]);

  // ── Fetch CPR Notifications (Requests) ──
  useEffect(() => {
    const fetchReqData = async () => {
      setReqLoading(true);
      setReqError(null);
      try {
        const res = await adminAxios.get("/admin/request-notifications");
        setReqData(res.data.notifications || []);
      } catch (err) {
        setReqError(err?.response?.data?.message || "Failed to load requests.");
      } finally {
        setReqLoading(false);
      }
    };

    fetchReqData();
  }, []);

  // ── Fetch General Notifications ──
  useEffect(() => {
    const fetchNotifData = async () => {
      setNotifLoading(true);
      setNotifError(null);
      try {
        const res = await adminAxios.get("/admin/notifications");
        setNotifData(res.data.notifications || []);
      } catch (err) {
        setNotifError(err?.response?.data?.message || "Failed to load notifications.");
      } finally {
        setNotifLoading(false);
      }
    };

    fetchNotifData();
  }, []);

const handleBRResponse = async (brId, response) => {
  try {
    const res = await adminAxios.put("/admin/br", { brId, response });
    // Update brData locally so resTime reflects immediately without refetch
    setBrData((prev) =>
      prev.map((br) =>
        br._id === brId ? { ...br, response, resTime: res.data.br.resTime } : br
      )
    );
  } catch (err) {
    console.error("Failed to update BR response:", err);
  }
};

const handleZTRSUpdation = async (tenantId, RID, reason, ztrs, notificationId) => {
  try {
    await adminAxios.post("/admin/ztrs", { tenantId, RID, reason, ztrs, notificationId });
    setLrData((prev) => prev.filter((item) => item._id !== notificationId));
    return { success: true };
  } catch (err) {
    console.error("Failed to submit ZTRS:", err);
    return { success: false, error: err?.response?.data?.message || "Failed to submit ZTRS" };
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
                  data={brData}
                  loading={brLoading}
                  error={brError}
                  onBRResponse={handleBRResponse}
                />
                <DropdownComp
                  heading="Join"
                  data={jrData}
                  loading={jrLoading}
                  error={jrError}
                />
                <DropdownComp
                  heading="Leave"
                  data={lrData}
                  loading={lrLoading}
                  error={lrError}
                  onZTRSSubmit={handleZTRSUpdation}
                />
                <DropdownComp
                  heading="PG create"
                  data={reqData}
                  loading={reqLoading}
                  error={reqError}
                />
                <DropdownComp
                  heading="Notifications"
                  data={notifData}
                  loading={notifLoading}
                  error={notifError}
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