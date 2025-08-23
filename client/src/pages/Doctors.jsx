import  { useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import AntdInput from '../ui/Input/input';
import { MapPin } from 'lucide-react';


const specialities=[
  {id:"GENERAL PHYSICIAN",name:"General Physician"},
  {id:"DENTIST",name:"Dentist"},
  {id:"CARDIOLOGIST",name:"Cardiologist"},
  {id:"DERMATOLOGIST",name:"Dermatologist"},
  {id:"GYNECOLOGIST",name:"Gynecologist"},
  {id:"PEDIATRICIAN",name:"Pediatrician"},
  {id:"PSYCHIATRIST",name:"Psychiatrist"},
  {id:"ORTHOPEDIC",name:"Orthopedic"},
]

const Doctors = () => {
  const navigate=useNavigate();
  const {doctors}=useContext(AppContext)


  return (
    <div>
       <div className='flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-10 mt-10'>
       <div className='flex items-center gap-3 w-full md:max-w-md'>
       <AntdInput holder="search by name"/>
       <div className='text-2xl'>
       <MapPin className='text-primary'/>
       </div>
       </div>
       <select className='w-full md:max-w-xs border border-gray-300 rounded px-4 py-3 text-sm cursor-pointer outline-none' defaultValue={"Select Speciality"}>
        {specialities.map((item,index)=>(
          <option key={index} value={item.id}>{item.name}</option>
        ))}
       </select>
       </div>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {doctors.map((item,index)=>(
            <div onClick={()=>navigate(`/appointments/${item._id}`)} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                <img className='bg-blue-50' src={item.image} alt=""/>
                <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available?'text-green-500':'text-gray-500'}`}>
                        <p className={`w-2 h-2 ${item.available?'bg-green-500':'bg-gray-500'} rounded-full`}></p><p>{item.available?'Available':"Not Available"}</p>
                    </div>
                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                    <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
            </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
