import PGCard from "./PGCard";

const PGList = ({ managedPGs, onSelectPG }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {managedPGs.slice(0, 30).map((pg, index) => (
        <PGCard
          pg={pg}
          key={index}
          onClick={() => onSelectPG && onSelectPG(pg)}
        />
      ))}
    </div>
  );
};

export default PGList;