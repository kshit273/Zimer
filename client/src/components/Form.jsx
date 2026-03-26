import { useMediaQuery } from "react-responsive";

const Form = () => {
  const isSmallScreen = useMediaQuery({ minWidth: 851, maxWidth: 1400 });
  const isMobile = useMediaQuery({ maxWidth: 850 });
  return (
    <div
      className={`flex-1 h-full flex flex-col justify-center ${
        isMobile ? `mx-[20px] mt-[20px]` : `mx-[50px] mt-[50px]`
      }  `}
    >
      <form
        action="submit"
        className="w-full h-full flex flex-col justify-center"
      >
        <div
          className={`h-full w-full flex flex-col ${
            isMobile ? `gap-[10px]` : `gap-[30px]`
          } `}
        >
          <div className={`flex ${isMobile ? `gap-[10px]` : `gap-[50px]`}`}>
            <input
              type="text"
              className={`${
                isMobile
                  ? `h-[40px] text-[10px] pl-[8px] placeholder:text-[10px] placeholder:pl-[8px] border-[1px] placeholder:font-normal`
                  : ` h-[70px] text-[20px] pl-[15px] placeholder:text-[20px] placeholder:pl-[15px] border-[2px] placeholder:font-medium `
              } flex-1 w-full  border-[#707070] rounded-[10px] text-[#d9d9d9] font-medium  placeholder-[#d9d9d9]   bg-transparent`}
              placeholder="First name"
            />
            <input
              type="text"
              className={`${
                isMobile
                  ? `h-[40px] text-[10px] pl-[8px] placeholder:text-[10px] placeholder:pl-[8px] border-[1px] placeholder:font-normal`
                  : `h-[70px] text-[20px] pl-[15px] placeholder:text-[20px] placeholder:pl-[15px] border-[2px] placeholder:font-medium`
              } flex-1 w-full  border-[#707070] rounded-[10px]  text-[#d9d9d9] font-medium  placeholder-[#d9d9d9]   bg-transparent`}
              placeholder="Last name"
            />
          </div>
          <div>
            <input
              type="text"
              className={`${
                isMobile
                  ? `h-[40px] text-[10px] pl-[8px] placeholder:text-[10px] placeholder:pl-[8px] border-[1px] placeholder:font-normal`
                  : `h-[70px] text-[20px] pl-[15px] placeholder:text-[20px] placeholder:pl-[15px]  border-[2px] placeholder:font-medium`
              } w-full  border-[#707070] rounded-[10px]  text-[#d9d9d9] font-medium placeholder-[#d9d9d9] bg-transparent`}
              placeholder="Your email"
            />
          </div>
          <div>
            <textarea
              className={`${
                isMobile
                  ? `h-[250px] font-medium text-[10px] pl-[15px] pt-[15px] placeholder:text-[10px] border-[1px] placeholder:font-normal`
                  : `h-[490px] font-medium text-[20px] pl-[25px] pt-[25px] placeholder:text-[20px]  border-[2px] placeholder:font-medium`
              } w-full  border-[#707070] rounded-[10px]  text-[#d9d9d9]  placeholder-[#d9d9d9] resize-none bg-transparent`}
              placeholder="Your message"
            />
          </div>
          <button
            className={`${
              isMobile
                ? `text-[11px] h-[30px] w-[80px] rounded-[6px]`
                : `text-[20px] h-[50px] w-[140px] rounded-[10px]`
            } font-medium text-[#d9d9d9]`}
            style={{
              background: "linear-gradient(90deg, #d72638 0%, #ff0084 100%)",
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
