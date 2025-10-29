import { useState } from "react";

const LoginRequestPage = ({ onSend, onCancel, pgData, roomData }) => {
  const [security, setSecurity] = useState(false);
  const [terms, setTerms] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Join PG Request</h2>

        {/* PG + Room Info */}
        {pgData && roomData && (
          <div className="mb-4 text-sm text-gray-700">
            <p><span className="font-semibold">PG:</span> {pgData.pgName}</p>
            <p><span className="font-semibold">Room:</span> {roomData.roomType} (ID: {roomData.roomId})</p>
          </div>
        )}

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={security}
              onChange={() => setSecurity(!security)}
            />
            I have deposited security.
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={terms}
              onChange={() => setTerms(!terms)}
            />
            I have read and agree to Terms & Conditions.
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Preferred Move-in Date:</span>
            <input
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(security, terms, moveInDate)}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
            disabled={!terms || !moveInDate} // ensure at least T&C + date selected
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequestPage;
