import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RightAbt = ({ heading, inner, imgpath }) => {
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
          start: "top 80%", // when top of elem hits 80% of viewport (20% from bottom)
          toggleActions: "play none none none",
        },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  return (
    <div className="flex gap-30 " ref={ref}>
      <div className="w-[600px] flex flex-col justify-end">
        <h3 className="text-[45px] font-medium">{heading}</h3>
        <div className="h-[400px] w-[400px]">
          <img src={imgpath} alt="RoomImg" />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {inner.map((item, x) => (
          <div key={item.subheading + x} className="w-[600px]">
            <h2 className="text-[#D72638] text-[25px] font-medium">
              {item.subheading}
            </h2>
            <p className="text-[#404040] text-[22px] ">{item.para}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightAbt;
