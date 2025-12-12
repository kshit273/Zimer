import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useMediaQuery } from "react-responsive";

const SearchButton = ({ width }) => {
  const isMedScreen = useMediaQuery({ minWidth: 801, maxWidth: 1024 });
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed !== "") {
      navigate(`/search/results/${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center bg-[#e5e5e5] border border-gray-300 rounded-[20px]  py-2 pr-1   ${
        isMedScreen
          ? `h-[60px] px-4`
          : isSmallScreen
          ? `h-[30px] px-3`
          : `h-[60px] px-4`
      } shadow-2xl`}
      style={{ width: width ? `${width}px` : undefined }}
    >
      <input
        type="text"
        placeholder="Search about your area"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`bg-[#e5e5e5] placeholder-gray-400 text-gray-800 ${
          isMedScreen ? `text-xl` : isSmallScreen ? `text-[11px]` : `text-xl`
        }  focus:outline-none w-full`}
      />
      <button
        type="submit"
        className={`flex items-center justify-center p-2  bg-[#d4d4d4] rounded-[15px] hover:bg-[#cfcfcf] transition ${
          isMedScreen
            ? `w-[50px] h-[50px] mt-[2px]`
            : isSmallScreen
            ? `w-[24px] h-[24px]`
            : `w-[50px] h-[50px] mt-[2px]`
        } `}
      >
        <Search
          className={`text-black ${
            isMedScreen
              ? `w-[20px] h-[20px]`
              : isSmallScreen
              ? `w-[10px] h-[10px]`
              : `w-[20px] h-[20px]`
          } `}
        />
      </button>
    </form>
  );
};

export default SearchButton;
