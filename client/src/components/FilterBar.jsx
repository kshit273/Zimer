// components/FilterBar.jsx

const CITIES    = ["", "DEH", "ROO", "DEL", "NOI", "GUR", "MER"];
const CITY_LABELS = { "": "All cities", DEH: "Dehradun", ROO: "Roorkee", DEL: "Delhi", NOI: "Noida", GUR: "Gurgaon", MER: "Meerut" };
const GENDERS   = ["", "boys", "girls", "both"];
const ROOM_TYPES = ["", "single", "double", "triple", "quad"];
const SORT_OPTIONS = [
  { value: "",           label: "Best match"  },
  { value: "rating",     label: "Top rated"   },
  { value: "rent_asc",   label: "Rent: low → high" },
  { value: "rent_desc",  label: "Rent: high → low" },
];

const sel = "bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d72638]";

const FilterBar = ({ filters, onChange, isSmallScreen }) => {
  const set = (key) => (e) => onChange({ [key]: e.target.value });

  return (
    <div className={`flex flex-wrap gap-3 ${isSmallScreen ? "justify-center" : "justify-start"}`}>

      {/* City */}
      <select className={sel} value={filters.city} onChange={set("city")}>
        {CITIES.map((c) => (
          <option key={c} value={c}>{CITY_LABELS[c]}</option>
        ))}
      </select>

      {/* Gender */}
      <select className={sel} value={filters.gender} onChange={set("gender")}>
        <option value="">All genders</option>
        {GENDERS.filter(Boolean).map((g) => (
          <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
        ))}
      </select>

      {/* Room type */}
      <select className={sel} value={filters.roomType} onChange={set("roomType")}>
        <option value="">Any room type</option>
        {ROOM_TYPES.filter(Boolean).map((r) => (
          <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
        ))}
      </select>

      {/* Rent range */}
      <input
        type="number"
        placeholder="Min rent"
        className={`${sel} w-28`}
        value={filters.minRent}
        onChange={set("minRent")}
        min={0}
      />
      <input
        type="number"
        placeholder="Max rent"
        className={`${sel} w-28`}
        value={filters.maxRent}
        onChange={set("maxRent")}
        min={0}
      />

      {/* Food toggle */}
      <label className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.food === "true"}
          onChange={(e) => onChange({ food: e.target.checked ? "true" : "" })}
          className="accent-[#d72638]"
        />
        Food available
      </label>

      {/* Sort */}
      <select className={sel} value={filters.sort} onChange={set("sort")}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Clear all */}
      {Object.values(filters).some(Boolean) && (
        <button
          onClick={() => onChange({ city: "", gender: "", minRent: "", maxRent: "", roomType: "", amenities: "", food: "", sort: "" })}
          className="px-3 py-2 text-sm text-[#d72638] border border-[#d72638] rounded-lg hover:bg-[#d72638] hover:text-white transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;