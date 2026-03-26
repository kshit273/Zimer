import HeroRoom from "../components/3dComponents/HeroRoom";
import SearchButton from "../components/SearchButton";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 1800 });
  return (
    <section
      id="hero"
      className="relative overflow-hidden z-2 mx-[20px] mt-[50px]"
    >
      <div className={`hero-layout ${isSmallScreen ? "h-[]" : "h-[80vh]"}`}>
        <header className="flex flex-col md:items-start items-center md:justify-center md:w-full w-screen md:px-25 px-5">
          <div className="flex flex-col gap-7">
            <div className="hero-text text-[clamp(2.5rem,8vw,6rem)] ">
              <h1 className="text-[#1a1a1a]">
                Connecting <span className="text-[#d72638]">you</span>
              </h1>
              <h1 className="text-[#1a1a1a]">to the right</h1>
              <h1 className="text-[#d72638]">room</h1>
            </div>
            <SearchButton width={isSmallScreen ? 250 : 600} />
          </div>
        </header>
        {!isSmallScreen && (
          <figure>
            <div className="hero-3d-layout">
              <HeroRoom />
            </div>
          </figure>
        )}
      </div>
    </section>
  );
};

export default Hero;
