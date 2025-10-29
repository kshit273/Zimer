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
  const [pgData, setPgData] = useState(null);
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    if (!user) {
      // redirect to login and pass redirect back path
      navigate(`/userlogin?redirect=/join/${RID}/${roomId}?token=${token}`);
    } else {
      // Fetch PG and room data when user is logged in
      fetchPGData();
      setShowOverlay(true);
    }
  }, [user, RID, roomId, token, navigate]);

  const fetchPGData = async () => {
    try {
      // First validate the invite token and get PG data
      const response = await axios.get(
        `http://localhost:5000/pgs/validate-invite/${RID}/${roomId}`,
        {
          params: { token },
          withCredentials: true,
        }
      );
      
      if (response.data.success) {
        setPgData(response.data.pg);
        setRoomData(response.data.room);
      } else {
        alert("Invalid or expired invitation link");
        navigate("/");
      }
    } catch (error) {
      console.error("Error validating invite:", error);
      alert("Invalid or expired invitation link");
      navigate("/");
    }
  };

  const handleSend = async (security, acceptedTerms, moveInDate) => {
    console.log(user);
    if (!security || !acceptedTerms) {
      alert("You must deposit security and accept terms.");
      return;
    }

    if (!moveInDate) {
      alert("Please select a move-in date.");
      return;
    }

    try {
      // Send join request notification instead of directly joining
      const res = await axios.post(
        `http://localhost:5000/notifications/join-request`,
        { 
          pgId: pgData._id,
          roomNumber: roomData.roomNumber || roomId,
          message: `${user.name} wants to join room ${roomData.roomNumber || roomId}`,
          moveInDate: moveInDate,
          roomId: roomId,
          token: token // Include token for later verification
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        alert("Join request sent to landlord! You will be notified once approved.");
        navigate("/"); // Redirect to home or dashboard
      } else {
        alert(res.data.error || "Failed to send join request");
      }
    } catch (err) {
      console.error("JoinRoom error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Server error");
    }
  };

  return (
    <>
      {showOverlay && pgData && roomData && (
        <LoginRequestPage
          onSend={handleSend}
          onCancel={() => navigate("/")}
          pgData={pgData}
          roomData={roomData}
        />
      )}
    </>
  );
};

export default JoinRoom;