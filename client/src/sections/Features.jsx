import { landlordFeatureCards, tenantFeatureCards } from "../constants/Abt";
import { useMediaQuery } from "react-responsive";
import Cards from "../components/Cards";

const Features = () => {
  const isMedScreen = useMediaQuery({ maxWidth: 1800 });
  const isSmallScreen = useMediaQuery({ maxWidth: 800 });
  return (
    <section
      id="features"
      className={`relative ${isSmallScreen ? `pt-[50px]` : `pt-[100px]`} z-2`}
    >
      <div
        className={` flex flex-col ${
          isSmallScreen ? `gap-[75px]` : `gap-[150px]`
        }`}
      >
        <div className=" flex flex-col gap-0 items-center">
          <div
            className={` text-[#1a1a1a] ${
              isSmallScreen ? `text-[25px] font-medium` : `text-5xl font-medium`
            }`}
          >
            <span className="text-[#d72638]">Zimer</span> For Tenants
          </div>
          <div
            className={`content-center   text-[#606060]  px-5 ${
              isSmallScreen
                ? `text-[10px] text-center mt-1`
                : `text-2xl font-medium text-center mt-4`
            }`}
          >
            <p>
              Never get any
              <span className="text-[#d72638]">
                {" "}
                cashback on paying rents ?{" "}
              </span>
              Zimer got you ...
            </p>
          </div>
          <Cards
            cardList={tenantFeatureCards}
            isMedScreen={isMedScreen}
            isSmallScreen={isSmallScreen}
          />
        </div>
        <div className="flex flex-col items-center">
          <div
            className={` font-medium text-[#1a1a1a] ${
              isSmallScreen ? `text-[25px]` : `text-5xl`
            }`}
          >
            <span className="text-[#d72638]">Zimer</span> For Landlords
          </div>
          <div
            className={`content-center   text-[#606060]  px-5 ${
              isSmallScreen
                ? `text-[10px] text-center mt-1`
                : `text-2xl font-medium text-center mt-4`
            }`}
          >
            <p>
              Let’s create an online world of your business , with
              <span className="text-[#d72638]"> Zimer</span>{" "}
            </p>
          </div>
          <Cards
            cardList={landlordFeatureCards}
            isMedScreen={isMedScreen}
            isSmallScreen={isSmallScreen}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
