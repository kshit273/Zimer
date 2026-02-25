const PGCard = ({pg}) => {
  return (
    <div className="flex gap-4">
        <div className="bg-[#1a1a1a] h-[200px] w-[200px] rounded-[20px] flex-shrink-0 overflow-hidden"></div>
        <div className="flex flex-col gap-2 py-2">
            <div className="flex flex-col gap-1">
                <p className="font-medium text-[22px]">Ajanta PG</p>
                <p className="text-[16px] font-light text-[#676767]">C33J+88Q Maya PG,Bagryal,village, near DIT college, oppostie Mega county,Salan Gaon,Bhagwant Pur, Dehradun</p>
            </div>
            <div className="flex flex-col gap-1">
                <p>Empty rooms : </p>
                <p>Rent paid : </p>
                <p>Rent pending : </p>
            </div>
        </div>
    </div>
  )
}

export default PGCard