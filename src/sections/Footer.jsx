import { useMediaQuery } from "react-responsive";
import { socials } from "../constants/Abt";

const Footer = () => {
  const isSmallScreen = useMediaQuery({ minWidth: 820, maxWidth: 1077 });
  const isMobile = useMediaQuery({ maxWidth: 819 });

  const head = isSmallScreen
    ? "text-[18px] font-medium"
    : isMobile
    ? "text-[11px] font-medium"
    : "text-[23px] font-medium";
  const para = isSmallScreen
    ? "text-[15px] font-light"
    : isMobile
    ? "text-[9px] font-light"
    : "text-[17px] font-light";

  return (
    <section id="footer" className="relative z-10 mb-[10px]">
      <div className={`flex min-h-[150px]`}>
        <div
          className={`flex flex-1 flex-col items-start w-[100px]  ${
            isMobile ? `mt-[10px] ml-[10px]` : `mt-[10px] ml-[20px]`
          } `}
        >
          <img
            src="/images/logo.png"
            alt="RoomEase"
            className={
              isSmallScreen
                ? `h-[100px] w-[100px]`
                : isMobile
                ? `h-[50px] w-[50px]`
                : `h-[200px] w-[200px]`
            }
          />
          <p
            className={`${
              isMobile
                ? `text-[7px]`
                : isSmallScreen
                ? `text-[12px]`
                : `text-[15px]`
            }`}
          >
            © all copywrites reserved
          </p>
        </div>
        <div
          className={`flex flex-col  ${
            isSmallScreen
              ? `ml-[60px] mr-[50px]`
              : isMobile
              ? `mr-0`
              : `mr-[50px]`
          }`}
        >
          <div
            className={`footer-wrapper flex justify-end p-[20px] ${
              isMobile ? `gap-[15px]` : `gap-[60px] mt-[20px]`
            }   `}
          >
            <div className={`flex flex-col `}>
              <h6 className={head}>Help and services</h6>
              <p className={para}>
                <a href="#">How does it work</a>
              </p>
              <p className={para}>
                <a href="#">FAQs</a>
              </p>
              <p className={para}>
                <a href="#">Contact</a>
              </p>
            </div>
            <div className="flex flex-col">
              <h6 className={head}>To explore</h6>
              <p className={para}>
                <a href="#">Accomodations</a>
              </p>
              <p className={para}>
                <a href="#">Experiences</a>
              </p>
              <p className={para}>
                <a href="#">Blog</a>
              </p>
            </div>
            <div className="flex flex-col">
              <h6 className={head}>Other possibilities</h6>
              <p className={para}>
                <a href="#">Give away</a>
              </p>
              <p className={para}>
                <a href="#">subscribe</a>
              </p>
            </div>
          </div>
          <div className={`socials flex justify-end mr-[20px]`}>
            {socials.map((item) => (
              <div
                key={item.name}
                className={
                  isSmallScreen
                    ? `px-[8px] mt-[10px]`
                    : isMobile
                    ? `px-[5px] mt-[0px]`
                    : `px-[15px] mt-[50px]`
                }
              >
                <a href={item.link}>
                  <img
                    src={
                      item.logo.startsWith("./")
                        ? item.logo.replace("./", "/")
                        : item.logo
                    }
                    alt={item.name}
                    className={
                      isSmallScreen
                        ? `h-[25px] w-[25px]`
                        : isMobile
                        ? `h-[18px] w-[18px]`
                        : `h-[35px] w-[35px]`
                    }
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
