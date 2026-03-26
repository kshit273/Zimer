import Form from "../components/Form";
import { useMediaQuery } from "react-responsive";

const Contact = () => {
  const isSmallScreen = useMediaQuery({ minWidth: 851, maxWidth: 1400 });
  const isMobile = useMediaQuery({ maxWidth: 850 });
  return (
    <section
      id="contact"
      className={`relative overflow-hidden z-2 ${
        isMobile ? `pt-[40px]` : `pt-[100px]`
      } `}
    >
      <div
        className={`bg-[#1a1a1a] ${
          isMobile ? `h-[500px]` : `h-[1000px]`
        }  w-full flex`}
      >
        <div className="flex flex-col flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`text-[#d9d9d9] font-medium ${
                isMobile ? `text-[17px] mt-[15px]` : `text-[50px] mt-[50px]`
              } `}
            >
              Get in touch
            </div>
          </div>
          <Form />
        </div>
        {isSmallScreen || isMobile ? null : (
          <div className="h-full flex items-end">
            <img
              src="./images/contactRoom.png"
              alt=""
              className="h-full w-auto object-contain"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
