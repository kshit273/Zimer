// routes/JoinRoom.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import LoginRequestPage from "../components/LoginRequestPage";

const JoinRoom = ({ user }) => {
  const { RID, roomId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (!user) {
      // redirect to login and pass redirect back path
      navigate(`/userlogin?redirect=/join/${RID}/${roomId}?token=${token}`);
    } else {
      setShowOverlay(true);
    }
  }, [user, RID, roomId, token, navigate]);

  const handleSend = async (security, acceptedTerms) => {
    if (!security || !acceptedTerms) {
      alert("You must deposit security and accept terms.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/pgs/join/${RID}/${roomId}`,
        { tenantId: user.id },
        {
          withCredentials: true,
          params: { token }, // invite token in query string
        }
      );

      if (res.data.success) {
        alert("You have successfully joined the PG!");
        navigate(`/pg/${RID}`);
      } else {
        alert(res.data.error || "Failed to join");
      }
    } catch (err) {
      console.error("JoinRoom error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Server error");
    }
  };

  return (
    <>
      {showOverlay && (
        <LoginRequestPage
          onSend={handleSend}
          onCancel={() => navigate("/")}
        />
      )}
    </>
  );
};

export default JoinRoom;
