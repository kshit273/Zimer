import React from 'react'

const BRNotification = ({name, contact, email, reqTime, RID, pgName}) => {
  return (
    <div className='p-3 bg-[#e2e2e2] rounded-[10px] w-full flex flex-col gap-3'>
        <div className='flex flex-col'>
            <div className='text-[#464646] text-[18px] font-medium'>Booking request by {name}</div>
            <div className='text-[#787878] text-[15px]'>A new user , {name} has put up a request for PG - {RID} , {pgName} at {reqTime}.</div>
        </div>
        <div className='flex gap-8'>
            <div className='flex flex-col text-[#464646] font-medium'>
                <div>Name</div>
                <div>Contact</div>
                <div>Email</div>
                <div>Req time</div>
                <div>Res time</div>
            </div>
            <div className='flex flex-col text-[#787878] font-light'>
                <div>{name}</div>
                <div>{contact}</div>
                <div>{email}</div>
                <div>{reqTime}</div>
                <div> - </div>
            </div>
        </div>
        <div>
            <button className='flex items-center gap-2 bg-[#e2e2e2] px-2 py-[1.5px] rounded-[20px] cursor-pointer border-1 border-[#49c800]'>
                <img src="../../../images/check.png" alt="" className='h-[15px] w-[15px]'/>
                <p className='text-[#49c800] text-[15px]'>Responded</p>
            </button>
        </div>
    </div>
  )
}

export default BRNotification