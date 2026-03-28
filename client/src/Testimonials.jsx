import Data from "./components/Data";
import ReviewCard from "./components/ReviewCard";
import { testimonials } from "./constants/Abt";
import { useMediaQuery } from "react-responsive";

// Fade edges via CSS class so colour values live in one place
const FadeEdges = () => (
  <>
    <div className="pointer-events-none absolute left-0 top-0 h-full w-32 z-10 bg-gradient-to-r from-[#e8e8e8] to-transparent" />
    <div className="pointer-events-none absolute right-0 top-0 h-full w-32 z-10 bg-gradient-to-l from-[#e8e8e8] to-transparent" />
  </>
);

const Testimonials = () => {
  const isMedScreen = useMediaQuery({ minWidth: 768, maxWidth: 1279 });
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });

  return (
    <section
      id="testimonials"
      className={`relative z-2 ${isSmallScreen ? "pt-[50px]" : "pt-[100px]"}`}
    >
      {/* Stats row */}
      <div
        className={`flex items-center justify-center ${
          isSmallScreen ? "mt-0" : isMedScreen ? "mt-[50px]" : "mt-[150px]"
        }`}
      >
        <Data />
      </div>

      {/* Heading */}
      <div
        className={`flex flex-col items-center justify-center font-medium text-[#1a1a1a] ${
          isMedScreen
            ? "text-[70px] mt-[50px]"
            : isSmallScreen
            ? "text-[23px] mt-0 text-center px-4"
            : "text-[100px] mt-[50px]"
        }`}
      >
        <div>Words of praise from others</div>
        <div>about our presence</div>
      </div>

      {/* Row 1 — scrolls right */}
      <div
        className={`relative overflow-x-hidden w-full ${
          isSmallScreen ? "mt-[30px]" : "mt-[50px]"
        }`}
      >
        {/* On mobile the page bg is dark (#373737) so skip fades; on larger screens apply them */}
        {!isSmallScreen && <FadeEdges />}
        <div
          className={`flex ${
            isSmallScreen
              ? "animate-marquee-left gap-[10px]"
              : "animate-marquee-right gap-[30px]"
          }`}
          style={{ width: "max-content" }}
        >
          {[...testimonials, ...testimonials].map((card, idx) => (
            <ReviewCard card={card} key={idx} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls left, hidden on mobile */}
      {!isSmallScreen && (
        <div className="relative overflow-x-hidden w-full mt-[20px]">
          <FadeEdges />
          <div
            className="flex gap-[30px] animate-marquee-left"
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