import React from 'react'

const AdminCard = () => {
  return (
    <div className='flex gap-4 justify-end'>
        <div className='flex flex-col justify-between text-[#464646]'>
            <div className=' flex flex-col items-end mt-2'>
                <p className='font-medium text-[26px]'>Area manager</p>
                <p className='text-[18px] mt-[-5px]'>Rajpur road</p>
            </div>
            <div className=' flex flex-col items-end mb-2'>
                <p className='text-[15px]'>emailid@gmail.com</p>
                <p className='text-[15px]'>+91 9368578171</p>
            </div>
        </div>
        <div className='w-[150px] h-[150px] bg-[#e2e2e2] rounded-[20px]'></div>
    </div>
  )
}

export default AdminCard