import { useRef, useEffect } from "react";
import JoinBtn from "./JoinBtn";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

const JoinAbt = ({ isMedScreen, isSmallScreen }) => {
  const ref = useRef();

  useEffect(() => {
    const elem = ref.current;
    gsap.fromTo(
      elem,
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: elem,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const PulseCircle = ({ triggerRef }) => {
    const pulseRef = useRef();

    useEffect(() => {
      if (!pulseRef.current || !triggerRef.current) return;
      gsap.fromTo(
        pulseRef.current,
        { scale: 0.7, opacity: 0.3 },
        {
          scale: 1.2,
          opacity: 0,
          duration: 1.5,
          repeat: -1,
          ease: "power2.out",
          paused: false,
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top 90%",
            toggleActions: "play pause resume reset",
            once: false,
          },
        }
      );
    }, [triggerRef]);

    return (
      <div
        ref={pulseRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "100%",
          height: "100%",
          background: "#d72638",
          opacity: 0.7,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    );
  };
  const outerCircleRef = useRef(null);

  return (
    <div ref={ref} className="relative flex items-start">
      {/* Circle on the timeline */}
      <div
        ref={outerCircleRef}
        className={`absolute`}
        style={{
          left: isSmallScreen ? -31.5 : isMedScreen ? -82 : 633,
          top: 5,
          zIndex: 10,
        }}
      >
        <div
          className={`${
            isSmallScreen ? `w-[25px] h-[25px]` : `w-[45px] h-[45px]`
          }  rounded-full bg-[#d9d9d9] flex items-center justify-center`}
          style={{ zIndex: 2 }}
        >
          <PulseCircle triggerRef={outerCircleRef} />
          <div
            className={`${
              isSmallScreen ? `w-[10px] h-[10px]` : `w-[18px] h-[18px]`
            } rounded-full bg-[#D72638]`}
          ></div>
        </div>
      </div>
      {/* Section content */}
      <div
        className={`flex flex-col gap-3 ${
          isSmallScreen ? `w-[250px]` : `w-[600px]`
        }`}
      >
        <h3
          className={`${
            isSmallScreen ? `text-[20px]` : `text-[45px]`
          } font-medium`}
        >
          Consider joining ?
        </h3>
        <p
          className={`${
            isSmallScreen ? `text-[10px] ` : `text-[22px] `
          } text-[#838383] `}
        >
          Looking to rent out a room? RoomEase helps you connect with reliable
          tenants and makes property management a breeze.
        </p>
        <div>
          <JoinBtn isSmallScreen={isSmallScreen} isMedScreen={isMedScreen} />
        </div>
      </div>
    </div>
  );
};

export default JoinAbt;
