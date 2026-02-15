import React, { useEffect, useState } from 'react'
import BRNotification from './BRNotification'
import JRNotification from './JRNotification'
import LRNotification from './LRNotification'

const DropdownComp = ({heading, data}) => {
    const [showArrow, setShowArrow] = useState(false)
    const [open, setOpen] = useState(false)
    const [isRead, setIsRead] = useState(false)

    const unreadCount = Array.isArray(data) ? data.length : 0;
    const subHeading =  !isRead ? `You may have some ${heading} requests` : `No pending ${heading} requests`;

    useEffect(() => {
    if (unreadCount < 1) setIsRead(true);
}, [unreadCount]);

    const handleJoinRequestAccept = () =>{}
    const handleLeaveRequestAccept = () =>{}
    const handleJoinRequestReject = () =>{}
    const handleLeaveRequestReject = () =>{}

  return (
    <div className='p-2 bg-[#e9e9e9] rounded-[10px]'>
        <div className='flex gap-2  items-center '
            onMouseEnter={() => setShowArrow(true)}
            onMouseLeave={() => setShowArrow(false)}>
            <div className='p-2'>
                <img src="../../../images/message.png" alt="" className='h-[35px] w-[40px]'/>
            </div>
            <div className='w-full flex items-center justify-between'>
                <div className='py-2'>
                    <div className='font-medium text-[20px]'>{heading} requests</div>
                    <div className='font-light text-[15px]'>{subHeading}</div>
                </div>
                <div className='flex gap-2 items-center justify-center'>
                    {!isRead ?  <div className='flex items-center justify-center bg-[#d72638] h-[30px] w-[30px] rounded-full text-[#e2e2e2] font-medium text-[15px]'>{unreadCount}</div> : null}
                    {showArrow ? 
                    <div className='flex items-center justify-center bg-[#d6d6d6] h-[25px] w-[25px] rounded-full cursor-pointer duration-300' onClick={() => {
                        setOpen((prev) => !prev);
                        setIsRead(true);
                    }}>
                        <img src="../../../images/arrowBlack.png" alt="" className={`h-[10px] w-[10px] ${open ? 'rotate-270' : 'rotate-90' } `}/>
                    </div> : null}
                </div>
            </div>
        </div>
        {open ? 
        <div className='flex flex-col gap-2 mt-1'>
            {heading == 'Booking' ?
            data.map((item, index) => (
                <BRNotification key={index} name={item.name} contact={item.contact} email={item.email} reqTime={item.reqTime} RID={item.RID} pgName={item.pgName}/>))
                 : 
                heading == 'Join' ?  data.map((item,index) => (<JRNotification data = {item} key={index} onAccept={handleJoinRequestAccept} onReject={handleJoinRequestReject}/>))
                 : 
                heading == 'Leave' ? data.map((item,index) => (<LRNotification data = {item} key={index} onAccept={handleLeaveRequestAccept} onReject={handleLeaveRequestReject}/>))
                 : 
                null}
        </div>:null}
    </div>
  )
}

export default DropdownComp