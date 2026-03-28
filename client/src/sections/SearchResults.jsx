// SearchResults.jsx

import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import SearchButton from "../components/SearchButton";
import SearchResultsList from "../components/SearchResultsList";
import NoSearchOutput from "../components/NoSearchOutput";
import FilterBar from "../components/FilterBar";
import { useMediaQuery } from "react-responsive";
import { useDebounce } from "../../../server/hooks/useDebounce";

const SearchResults = ({ setActiveRID }) => {
  const isMedScreen  = useMediaQuery({ minWidth: 801, maxWidth: 1024 });
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });

  const { search_keyword } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Results state ─────────────────────────────────────────────────────────
  const [results, setResults]     = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // ── Filter state (read from URL so filters are shareable/bookmarkable) ────
  const [filters, setFilters] = useState({
    city:      searchParams.get("city")     ?? "",
    gender:    searchParams.get("gender")   ?? "",
    minRent:   searchParams.get("minRent")  ?? "",
    maxRent:   searchParams.get("maxRent")  ?? "",
    roomType:  searchParams.get("roomType") ?? "",
    amenities: searchParams.get("amenities") ?? "",
    food:      searchParams.get("food")     ?? "",
    sort:      searchParams.get("sort")     ?? "",
  });

  const debouncedFilters = useDebounce(filters, 500);

  const isMountedRef = useRef(true);

  // ── Sync filters into URL query params ────────────────────────────────────
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params, { replace: true });
  }, [filters]);

  // ── Fetch from backend ────────────────────────────────────────────────────
  const fetchResults = useCallback(
  async (currentPage = 1, signal) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        q:     search_keyword ?? "",
        page:  currentPage,
        limit: 20,
        ...Object.fromEntries(
          Object.entries(debouncedFilters).filter(([, v]) => v !== "")
        ),
      };
      const response = await axios.get("http://localhost:5000/pgs/search", {
        params,
        withCredentials: true,
        signal,
      });
      if (!isMountedRef.current) return;
      const { results: data, total: t, totalPages: tp } = response.data;
      setResults((prev) => (currentPage === 1 ? data : [...prev, ...data]));
      setTotal(t);
      setTotalPages(tp);
      setPage(currentPage);
    } catch (err) {
      if (axios.isCancel(err) || err.name === "CanceledError") return;
      if (!isMountedRef.current) return;
      setError("Failed to load search results. Please try again.");
      setResults([]);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  },
  [search_keyword, debouncedFilters]  // ← debouncedFilters, not filters
);

  // Re-fetch whenever keyword or filters change (reset to page 1)
  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();
    fetchResults(1, controller.signal);
    return () => {
      isMountedRef.current = false;
      controller.abort();
    };
  }, [fetchResults]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const loadMore = () => {
    if (page < totalPages && !loading) {
      const controller = new AbortController();
      fetchResults(page + 1, controller.signal);
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const premiumResults = results.filter((pg) => pg.plan === "premium");
  const regularResults = results.filter((pg) => pg.plan !== "premium");

  // ── Loading skeleton ──────────────────────────────────────────────────────
  {loading && page === 1 && (
    <div className="w-[90%] mb-4">
      <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
        <div className="h-1 bg-[#d72638] rounded animate-pulse w-2/3" />
      </div>
      <p className="text-sm text-gray-500 mt-2">Searching...</p>
    </div>
  )}

  return (
    <>
      <BgImages />
      <section className={`relative z-2 ${isSmallScreen ? "pt-[60px]" : "pt-[100px]"}`}>
        <div className={`w-full flex justify-center ${isSmallScreen || isMedScreen ? "mt-[20px]" : "mt-[100px]"}`}>
          <div className="w-[90%] h-full pb-[40px] bg-[#dadada] rounded-[20px] drop-shadow-2xl drop-shadow-[#a5a5a5] flex flex-col items-center">

            {/* ── Search bar row ── */}
            <div className={`flex items-center w-full ${isSmallScreen || isMedScreen ? "my-[20px] px-[10px]" : "my-[40px] px-[40px]"} justify-between`}>
              <div className={`flex-1 flex justify-center ${isMedScreen ? "scale-70" : "scale-100"}`}>
                <SearchButton width={isSmallScreen ? 200 : isMedScreen ? 600 : 1000} />
              </div>
            </div>

            {/* ── Filter bar ── */}
            <div className="w-[90%] mb-4">
              <FilterBar
                filters={filters}
                onChange={handleFilterChange}
                isSmallScreen={isSmallScreen}
              />
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="w-[90%] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* ── Result count ── */}
            {!loading && !error && results.length > 0 && (
              <div className="w-[90%] mb-4 text-gray-700">
                <p className="text-lg">
                  Found <strong>{total}</strong> results for{" "}
                  "<strong>{search_keyword}</strong>"
                </p>
              </div>
            )}

            {/* ── Premium slider ── */}
            {premiumResults.length > 0 && (
              <div className="bg-[#2b2b2b] rounded-[20px] w-[95%] mx-[10px]">
                <div className={`w-[90%] ${isSmallScreen ? "ml-[20px]" : isMedScreen ? "ml-[30px]" : "ml-[90px]"}`}>
                  {/* <PremiumRoomSlider list={premiumResults} onRoomClick={setActiveRID} /> */}
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className={`w-[90%] h-[1px] bg-[#b3b3b3] ${isSmallScreen ? "mt-[20px]" : "mt-[80px]"}`} />
            )}

            {/* ── Regular results ── */}
            {regularResults.length > 0 && (
              <SearchResultsList
                search_keyword={search_keyword}
                list={regularResults}
                onRoomClick={setActiveRID}
              />
            )}

            {/* ── Load more ── */}
            {page < totalPages && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="mt-6 px-8 py-3 bg-[#d72638] text-white rounded-full font-medium hover:bg-[#b81e2d] disabled:opacity-50 transition-colors"
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            )}

            {/* ── Empty state ── */}
            {!loading && !error && results.length === 0 && <NoSearchOutput />}
          </div>
        </div>
      </section>
    </>
  );
};

// Extracted so it doesn't re-render on state changes
const BgImages = () => (
  <>
    <div className="absolute top-[-20px] left-[-20px] z-1 md:w-[512px] w-[256px] md:h-[560px] h-[280px] pointer-events-none">
      <img src="/images/bgimg.png" alt="" />
    </div>
    <div className="absolute bottom-[-250px] right-0 z-1 md:w-[512px] w-[256px] md:h-[560px] h-[280px] pointer-events-none">
      <img src="/images/bgimg2.png" alt="" />
    </div>
  </>
);

export default SearchResults;