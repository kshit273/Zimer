import { useState, useEffect } from 'react';
import axios from 'axios';

const RoomAvailabilityToggleComp = ({ pgId, roomId }) => {
  const [room, setRoom] = useState({
    available: false,
    availableFrom: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch room data on component mount
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/pgs/${pgId}/room/${roomId}`);
        
        const data = response.data;
        console.log(data);
        setRoom({
          available: !!data.availableFrom,
          availableFrom: data.availableFrom 
            ? new Date(data.availableFrom).toISOString().split('T')[0] 
            : ''
        });
      } catch (error) {
        console.error('Error fetching room data:', error);
        setError('Failed to load room data');
      }
    };
    
    if (pgId && roomId) {
      fetchRoomData();
    }
  }, [pgId, roomId]);

  // API call to update availableFrom
  const updateAvailableFrom = async (date) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.patch(
        `http://localhost:5000/pgs/${pgId}/room/${roomId}/availability`,
        { availableFrom: date }
      );
      
      console.log('Updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating availability:', error);
      setError(error.response?.data?.message || 'Failed to update availability');
      
      // Revert the state on error
      setRoom(prev => ({
        ...prev,
        available: !prev.available,
        availableFrom: prev.available ? '' : prev.availableFrom
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = async (e) => {
    const isAvailable = e.target.checked;
    setRoom(prev => ({ ...prev, available: isAvailable }));
    
    // If unchecking, clear the availableFrom date in DB
    if (!isAvailable) {
      await updateAvailableFrom(null);
    }
  };

  // Handle date change
  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setRoom(prev => ({ ...prev, availableFrom: newDate }));
    await updateAvailableFrom(newDate);
  };

  return (
    <div className="my-4">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="available"
            checked={room.available}
            onChange={handleCheckboxChange}
            disabled={loading}
            className="cursor-pointer"
          />
          <span>Available?</span>
        </label>
        
        {room.available && (
          <input
            type="date"
            name="availableFrom"
            value={room.availableFrom}
            onChange={handleDateChange}
            className="p-2 bg-[#e2e2e2] rounded-lg"
            disabled={loading}
          />
        )}
        
        {loading && (
          <span className="text-sm text-gray-500">Updating...</span>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
};

export default RoomAvailabilityToggleComp;