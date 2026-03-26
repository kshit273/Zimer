import { useState } from "react";

const LoginRequestPage = ({ onSend, onCancel, pgData, roomData }) => {
  const [security, setSecurity] = useState(false);
  const [terms, setTerms] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="flex gap-10 bg-white p-0 rounded-[30px] w-265 shadow-lg">
        <div>
          <img src={`http://localhost:5000${pgData.coverPhoto}`} alt="" className="rounded-[30px] m-2"/>
        </div>
        <div className="p-6 pl-0 pb-0 w-250">
          <h2 className="text-[25px] font-medium mb-4 text-[#464646]">Join PG Request</h2>

          {/* PG + Room Info */}
          {pgData && roomData && (
            <div className="mb-4 text-[17px] font-medium text-[#1a1a1a]">
              <p>{pgData.pgName}</p>
              <p>{roomData.roomType} room</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div><label className="flex items-center gap-2 text-[16px] text-[#464646]">
              <input
                type="checkbox"
                checked={security}
                onChange={() => setSecurity(!security)}
              />
              I have deposited security.
            </label>

            <label className="flex items-center gap-2 text-[16px] text-[#464646]">
              <input
                type="checkbox"
                checked={terms}
                onChange={() => setTerms(!terms)}
              />
              I have read and agree to Terms & Conditions.
            </label></div>
            

            <label className="flex flex-col gap-1">
              <span className="text-[15px] font-medium">Preferred Move-in Date:</span>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-16">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded-[10px]"
            >
              Cancel
            </button>
            <button
              onClick={() => onSend(security, terms, moveInDate)}
              className="px-6 py-2 bg-[#d72638] text-white rounded-[10px] disabled:opacity-50"
              disabled={!terms || !moveInDate} // ensure at least T&C + date selected
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequestPage;
