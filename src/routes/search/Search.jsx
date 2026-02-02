import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import FindRoom from "../../sections/FindRoom.jsx";
import PgInfo from "../../sections/PgInfo.jsx";
import SearchResults from "../../sections/SearchResults.jsx";

const Search = ({setToast}) => {
  const [activeRID, setActiveRID] = useState(null);
  return (
    <>
      <div className="absolute top-[-20px] left-[-20px] z-1 md:w-[512px] w-[256px]  md:h-[560px] h-[280px] pointer-events-none">
        <img src="/images/bgimg.png" alt="background" />
      </div>
      <div className="absolute top-[1720px] left-[-20px] z-1 md:w-[512px] w-[256px]  md:h-[560px] h-[280px] pointer-events-none">
        <img src="/images/bgimg3.png" alt="background" />
      </div>
      <div className="absolute bottom-[-50px] right-0 z-1 md:w-[512px] w-[256px]  md:h-[560px] h-[280px] pointer-events-none">
        <img src="/images/bgimg2.png" alt="background" />
      </div>
      <div className="absolute bottom-[-1000px] right-0 z-1 md:w-[512px] w-[256px]  md:h-[560px] h-[280px] pointer-events-none">
        <img src="/images/bgimg2.png" alt="background" />
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <FindRoom
              setActiveRID={setActiveRID}
            />
          }
        />
        <Route
          path="/results/:search_keyword"
          element={<SearchResults setActiveRID={setActiveRID} />}
        />
      </Routes>
      {activeRID && <PgInfo RID={activeRID} />}
    </>
  );
};

export default Search;
