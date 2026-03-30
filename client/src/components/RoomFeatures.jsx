const RoomFeatures = ({ features }) => {
  const uniqueFeatures = [...new Set(features)];

  return (
    <div className="my-1">
      <div className="flex flex-wrap gap-[10px]">
        {uniqueFeatures.map((feature, index) => (
          <div
            key={index}
            className="bg-[#d7d7d7] text-[#4b4b4b] text-[12px] px-4 py-2 rounded-full font-medium"
          >
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomFeatures;
