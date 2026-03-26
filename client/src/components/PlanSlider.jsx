import PlanCard from "./PlanCard";
import { useMediaQuery } from "react-responsive";
import { plans } from "../constants/Abt";
import { useRef, useEffect, useState } from "react";

const PlanSlider = () => {
  const isSmallOrTab = useMediaQuery({ maxWidth: 1025 });
  const isMidOrTab = useMediaQuery({ maxWidth: 800 });

  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [centeredIndex, setCenteredIndex] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (cardRefs.current[1] && container) {
      const card = cardRefs.current[1];
      const scrollTo =
        card.offsetLeft + card.offsetWidth / 2 - container.offsetWidth / 2;
      container.scrollLeft = scrollTo;
    }

    const handleScroll = () => {
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      const distances = cardRefs.current.map((card) => {
        if (!card) return Infinity;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        return Math.abs(containerCenter - cardCenter);
      });
      const closestIndex = distances.indexOf(Math.min(...distances));
      setCenteredIndex(closestIndex);
    };

    handleScroll(); // Initial check
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-x-auto px-4 flex ${
        isSmallOrTab
          ? "pb-6 gap-0 mt-[30px]"
          : isMidOrTab
          ? "pb-6 gap-[20px] mt-[30px]"
          : "gap-[50px] mt-[50px] items-center justify-center"
      } no-scrollbar`}
      style={{
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {plans.map((plan, index) => (
        <div
          key={index}
          ref={(el) => (cardRefs.current[index] = el)}
          className={`snap-center flex-shrink-0 transition-transform duration-300 ease-in-out ${
            index === centeredIndex ? "scale-100" : "scale-90"
          }`}
          style={{
            scrollSnapAlign: "center",
            touchAction: "manipulation",
          }}
        >
          <PlanCard {...plan} />
        </div>
      ))}
    </div>
  );
};

export default PlanSlider;
