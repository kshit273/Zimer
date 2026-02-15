import AdminCard from "./AdminCard";
import DropdownComp from "./DropdownComp";

const AdminDashboard = () => {

  const back = ()=>{
    window.history.back();
  }
  return (
    <div className='p-5 flex flex-col gap-5 bg-[#e2e2e2] w-full h-full'>
      <div>
        <button className="bg-[#d9d9d9] flex items-center justify-center gap-[7px] px-[10px] py-[5px] rounded-full font-medium cursor-pointer hover:scale-105 duration-300"
        onClick={back}>
          <img src="../../../images/arrowBlack.png" alt="" className="rotate-180 h-[12px] w-[12px] hover:translate-x-[-2px] duration-500" />
          <p>Back</p>
        </button>
      </div>
      <div className="bg-[#d9d9d9] w-full h-[1000px] rounded-[20px] p-5">
        <div className="flex items-center mb-5">
          <p className="font-medium text-[30px] text-[#1a1a1a]">Admin dashboard</p>
        </div>
        <div className="flex gap-5">
          <div className="w-[75%] h-[500px] bg-[#e2e2e2] rounded-[20px]"></div>
          <div className="w-[25%] h-[500px] ">
            <div><AdminCard/></div>
            <div className=" my-5 flex flex-col gap-2">
              <DropdownComp heading={'Booking'} data={[{name : 'Peter Beniwal', contact: '+91 9368578171', email:'petermjben@gmail.com', reqTime:'04:13 pm 12 Feb,2026', RID:'ROORAM49c80', pgName:'Arora PG'},
                {name : 'Jesse Pinkman', contact: '+91 9368578172', email:'jessepinkman@gmail.com', reqTime:'04:13 pm 12 Feb,2026', RID:'DEHDIT49c80', pgName:'Maya PG'},
                {name : 'Walter White', contact: '+91 9368578173', email:'walterhwhite@gmail.com', reqTime:'04:13 pm 12 Feb,2026', RID:'DEHUIT49c80', pgName:'Parihars home'}]}/>

              <DropdownComp heading={'Join'} data={[{tenantEmail : 'tenant@gmail.com', tenantPhone:'+91 9368578171',RID : "DEHPREe5be03", roomId : '1000026309', message : "Kshitij Sharma has requested to leave room 1769934860787", status : "pending" , metadata : {tenantName:"Kshitij Sharma", moveInDate : "2026-02-15T09:07:30.285+00:00", reason : "blah blah blah"}, createdAt : "2026-02-15T09:07:30.484+00:00"},
                {tenantEmail : 'tenant@gmail.com', tenantPhone:'+91 9368578171',RID : "DEHPREe5be03", roomId : '1000026309', message : "Kshitij Sharma has requested to leave room 1769934860787", status : "pending" , metadata : {tenantName:"Kshitij Sharma", moveInDate : "2026-02-15T09:07:30.285+00:00", reason : "blah blah blah"}, createdAt : "2026-02-15T09:07:30.484+00:00"},
                {tenantEmail : 'tenant@gmail.com', tenantPhone:'+91 9368578171',RID : "DEHPREe5be03", roomId : '1000026309', message : "Kshitij Sharma has requested to leave room 1769934860787", status : "pending" , metadata : {tenantName:"Kshitij Sharma", moveIntDate : "2026-02-15T09:07:30.285+00:00", reason : "blah blah blah"}, createdAt : "2026-02-15T09:07:30.484+00:00"}
              ]}/>

              <DropdownComp heading={'Leave'} data={[{RID : "DEHPREe5be03", message : "Kshitij Sharma has requested to leave room 1769934860787", status : "pending" , metadata : {tenantName:"Kshitij Sharma", moveOutDate : "2026-02-15T09:07:30.285+00:00", reason : "blah blah blah"}, createdAt : "2026-02-15T09:07:30.484+00:00"},
                {RID : "DEHPREe5be03", message : "Kshitij Sharma has requested to leave room 1769934860787", status : "pending" , metadata : {tenantName:"Kshitij Sharma", moveOutDate : "2026-02-15T09:07:30.285+00:00", reason : "blah blah blah"}, createdAt : "2026-02-15T09:07:30.484+00:00"},
                {RID : "DEHPREe5be03", message : "Kshitij Sharma has requested to leave room 1769934860787", status : "pending" , metadata : {tenantName:"Kshitij Sharma", moveOutDate : "2026-02-15T09:07:30.285+00:00", reason : "blah blah blah"}, createdAt : "2026-02-15T09:07:30.484+00:00"}
              ]}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;