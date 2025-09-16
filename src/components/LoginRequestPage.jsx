import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";

const LoginRequestPage = ({ onSend, onCancel }) => {
  const [security, setSecurity] = useState(false);
  const [terms, setTerms] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Join PG Request</h2>

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
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(security, terms)}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequestPage;
