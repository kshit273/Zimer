import Data from "./components/Data";
import ReviewCard from "./components/ReviewCard";
import { testimonials } from "./constants/Abt";
import { useMediaQuery } from "react-responsive";

const Testimonials = () => {
  const isMedScreen = useMediaQuery({ minWidth: 768, maxWidth: 1400 });
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  return (
    <section
      id="testimonials"
      className={`relative z-2 ${isSmallScreen ? `pt-[50px]` : `pt-[100px]`}`}
    >
      <div
        className={`flex items-center justify-center  ${
          isSmallScreen ? `mt-0` : isMedScreen ? `mt-[50px]` : `mt-[150px]`
        }`}
      >
        <Data />
      </div>
      <div
        className={`flex flex-col items-center justify-center ${
          isMedScreen
            ? `text-[70px] mt-[50px]`
            : isSmallScreen
            ? `text-[23px] mt-0`
            : `text-[100px] mt-[50px]`
        }  font-medium  text-[#1a1a1a]`}
      >
        <div>Words of praise from others</div>
        <div>about our presence</div>
      </div>
      <div
        className={`relative overflow-x-hidden w-full ${
          isSmallScreen ? `mt-[30px]` : `mt-[50px]`
        }`}
      >
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-32 z-10"
          style={{
            background: `linear-gradient(to right,  ${
              isSmallScreen
                ? `#373737 1% , transparent 0%)`
                : `#e8e8e8 10% , transparent 100%)`
            }`,
          }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-32 z-10"
          style={{
            background: `linear-gradient(to left,  ${
              isSmallScreen
                ? `#373737 1% , transparent 0%)`
                : `#e8e8e8 10% , transparent 100%)`
            }`,
          }}
        />
        <div
          className={`flex  ${
            isSmallScreen
              ? `animate-marquee-left gap-[10px]`
              : `animate-marquee-right gap-[30px]`
          } `}
          style={{ width: "max-content" }}
        >
          {[...testimonials, ...testimonials].map((card, idx) => (
            <ReviewCard card={card} key={idx} />
          ))}
        </div>
      </div>
      {isSmallScreen ? null : (
        <div className="relative overflow-x-hidden w-full mt-[20px]">
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-32 z-10"
            style={{
              background:
                "linear-gradient(to right, #e8e8e8 10%, transparent 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-32 z-10"
            style={{
              background:
                "linear-gradient(to left, #e8e8e8 10%, transparent 100%)",
            }}
          />
          <div
            className={`flex ${
              isSmallScreen ? ` gap-[10px]` : ` gap-[30px]`
            } animate-marquee-left `}
            style={{ width: "max-content" }}
          >
            {[...testimonials, ...testimonials].map((card, idx) => (
              <ReviewCard card={card} key={idx} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
