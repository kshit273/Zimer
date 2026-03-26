const Logout = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#e8e8e8] rounded-[30px] shadow-xl p-6 w-[90%] max-w-[800px] min-h-[200px]">
        <p className="text-[34px] font-medium text-[#464646] mb-4">Logout</p>
        <h2 className="text-xl font-normal text-[#5c5c5c] mb-12">
          Are you sure you want to log out from Zimer ?
        </h2>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-8 py-2 text-[18px] bg-gray-300 hover:bg-gray-400 transition rounded-[30px] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-2 text-[18px] hover:bg-[#d72638] hover:text-white text-[#d72638]  transition border-1 border-[#d72638] rounded-[30px] cursor-pointer"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
