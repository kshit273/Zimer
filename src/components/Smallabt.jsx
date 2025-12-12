import { useRef, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Smallabt = ({ heading, inner, imgpath }) => {
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });
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

  return (
    <div
      className={`flex flex-col ${isSmallScreen ? `gap-2` : `gap-5`} `}
      ref={ref}
    >
      <div>
        <h3
          className={`${
            isSmallScreen ? `text-[20px]` : `text-[45px]`
          } font-medium`}
        >
          {heading}
        </h3>
      </div>
      <div className={`flex gap-3 justify-between pr-[10%]`}>
        <div className={`flex flex-col ${isSmallScreen ? `gap-2` : `gap-3`} `}>
          {inner.map((item, x) => (
            <div
              key={item.subheading + x}
              className={isSmallScreen ? `w-[250px]` : `w-[600px]`}
            >
              <h2
                className={`${
                  isSmallScreen ? `text-[13px]` : `text-[25px]`
                } text-[#D72638]  font-medium`}
              >
                {item.subheading}
              </h2>
              <p
                className={`${
                  isSmallScreen ? `text-[10px] ` : `text-[22px] `
                } text-[#404040] `}
              >
                {item.para}
              </p>
            </div>
          ))}
        </div>
        {isSmallScreen ? null : (
          <div className="h-[400px] w-[400px]">
            <img src={imgpath} alt="Room" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Smallabt;
