const RoomFeatures = ({ features }) => {
  const uniqueFeatures = [...new Set(features)];

  return (
    <div className="mt-6">
      <h3 className="text-[22px] font-medium text-[#1a1a1a] mb-3">Features</h3>
      <div className="flex flex-wrap gap-[10px]">
        {uniqueFeatures.map((feature, index) => (
          <div
            key={index}
            className="bg-[#d7d7d7] text-[#4b4b4b] text-[14px] px-4 py-2 rounded-full font-medium"
          >
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomFeatures;
