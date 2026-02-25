import PGCard from "./PGCard";

const PGList = ({ managedPGs }) => {
  return (
    <div className='grid grid-cols-2 gap-4 p-4'>
      {managedPGs.slice(0, 30).map((pg, index) => (
        <PGCard pg = {pg} key={index}/>
      ))}
    </div>
  );
};

export default PGList;