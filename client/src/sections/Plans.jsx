import { useMediaQuery } from "react-responsive";
import PlanSlider from "../components/PlanSlider";

const Plans = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });
  return (
    <section
      id="plans"
      className={`relative ${isSmallScreen ? `pt-[100px]` : `pt-[200px]`}  z-2`}
    >
      <div className="flex flex-col items-center ">
        <div
          className={` font-medium text-[#1a1a1a] ${
            isSmallScreen ? `text-[25px]` : `text-5xl`
          }`}
        >
          Plans and pricing
        </div>
        <div
          className={` ${
            isSmallScreen ? `mt-0` : `mt-4`
          } text-[#d72638] content-center text-center font-medium   px-5 ${
            isSmallScreen ? `text-[13px]` : `text-2xl`
          }`}
        >
          (for Landlords)
        </div>
        <div
          className={`content-center text-center font-medium text-[#8b8b8b] mt-1 px-5 ${
            isSmallScreen ? `text-[13px]` : `text-2xl`
          }`}
        >
          Choose the plan that best aligns with your needs
        </div>
      </div>
      <PlanSlider />
    </section>
  );
};

export default Plans;
