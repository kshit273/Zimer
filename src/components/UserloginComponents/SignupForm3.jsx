import { useNavigate } from "react-router-dom";

const SignupForm3 = ({ redirectTo, setUser, handleSubmit, formData, setFormData }) => {
  const navigate = useNavigate();

  const handleRoleClick = async (role, path) => {
    console.log("Form submitted ...");

    const updatedData = { ...formData, role: role };
    setFormData(updatedData);
    console.log(updatedData);

    try {
      const success = await handleSubmit(updatedData); // should return true/false
      if (success && success.user) {
        setUser(success.user);
        navigate(redirectTo !== "/search" ? redirectTo : path);
      } else {
        alert("Signup failed, please try again");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong, please try again later");
    }
  };

  return (
    <div className="px-15 py-6 w-full">
      <div className="text-[#7a7a7a] font-light italic text-2xl mb-20 text-left">
        How do you want to join Zimer ?
      </div>

      <div className="flex flex-row justify-center gap-20 my-10 items-center">
        <button
          type="button"
          onClick={() => handleRoleClick("tenant", "/search")}
          className="flex flex-col gap-10 text-xl font-normal text-[#d7d7d7] items-center justify-center py-20 px-20 bg-[#1a1a1a] rounded-3xl w-auto cursor-pointer"
        >
          <img src="/images/tenant.png" alt="tenant" className="h-60" />
          <p>Tenant</p>
        </button>

        <button
          type="button"
          onClick={() => handleRoleClick("landlord", "/landlord/dashboard")}
          className="flex flex-col gap-10 text-xl font-normal text-[#d7d7d7] items-center justify-center py-20 px-20 bg-[#1a1a1a] rounded-3xl w-auto cursor-pointer"
        >
          <img src="/images/landlord.png" alt="landlord" className="h-60" />
          <p>Landlord</p>
        </button>
      </div>

      <div className="flex items-center justify-center mt-20">
        <button
          type="button"
          className="bg-[#1a1a1a] text-[#e8e8e8] rounded-full py-3 px-7 font-medium text-[12px] shadow-lg hover:bg-gray-900 transition"
        >
          3 / 3
        </button>
      </div>
    </div>
  );
};

export default SignupForm3;
