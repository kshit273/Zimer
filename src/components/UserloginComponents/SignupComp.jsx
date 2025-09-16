import { useState } from "react";

import SignupForm2 from "./SignupForm2";
import SignupForm1 from "./signupForm1";
import SignupForm3 from "./SignupForm3";

const SignupComp = ({ redirectTo, onShowLogin, setUser, onSubmit }) => {
  const [signupStep, setSignupStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    dob: "",
    gender: "Gender*",
    profilePicture: null,
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    role: "",
  });
  
  const handleSubmit = async (formData) => {
    try {
      const result = await onSubmit(formData);  // Wait for the result
      return result;  // Pass through the result (true/false or object with user)
    } catch (error) {
      console.error("Error during signup submission", error);
      return false;  // Return false on error
    }
  };

  return (
    <div className="bg-[#e8e8e8] h-[97vh] w-[40vw] rounded-[30px]  ml-[-40px] z-10">
      <div className="flex flex-col shadow-xl h-full">
        <div className="ml-[50px]">
          <h2 className="text-[60px] font-semibold my-24">Signup.</h2>
        </div>
        <div className="flex items-center justify-center ">
          {signupStep == 1 ? (
            <SignupForm1
              setSignupStep={setSignupStep}
              formData={formData}
              setFormData={setFormData}
            />
          ) : signupStep == 2 ? (
            <SignupForm2
              setSignupStep={setSignupStep}
              formData={formData}
              setFormData={setFormData}
            />
          ) : signupStep == 3 ? (
            <SignupForm3
              redirectTo={redirectTo}
              setUser={setUser}
              handleSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
            />
          ) : null}
        </div>
        <div className="text-center text-sm mt-2">
          already a user ?{" "}
          <a
            href="#"
            className="underline"
            onClick={(e) => {
              e.preventDefault();
              onShowLogin();
            }}
          >
            LogIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupComp;
