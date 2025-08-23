import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AntdInput from '../ui/Input/input'
import { MapPin, Star } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Modal, AutoComplete, Input } from 'antd'

const specialities = [
  { id: "ALL", name: "All Categories" },
  { id: "GENERAL", name: "General" },
  { id: "DENTIST", name: "Dentist" },
  { id: "CARDIOLOGIST", name: "Cardiologist" },
  { id: "DERMATOLOGIST", name: "Dermatologist" },
  { id: "GYNECOLOGIST", name: "Gynecologist" },
  { id: "PEDIATRICIAN", name: "Pediatrician" },
  { id: "PSYCHIATRIST", name: "Psychiatrist" },
  { id: "ORTHOPEDIC", name: "Orthopedic" },
]

const Doctors = () => {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [location, setLocation] = useState("")
  const [options, setOptions] = useState([])

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const getDoctorsData = async () => {
    try {
      const params = {}
      if (searchTerm) params.name = searchTerm
      if (selectedCategory !== "ALL") params.specialization = selectedCategory
      if (location) {
        const match = location.match(/^\d{6}/)
        if (match) params.pincode = match[0]
      }
      const { data } = await axios.get(backendUrl + '/hospital/get-doctors', { params })
      console.log(data)
      if (data.success) {
        setDoctors(data.data)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getDoctorsData()
  }, [searchTerm, selectedCategory, location])

  const handleLocationSearch = async (value) => {
    if (!value) {
      setOptions([])
      return
    }
    try {
      let response
      if (/^\d{6}$/.test(value)) {
        response = await axios.get(`https://api.postalpincode.in/pincode/${value}`)
      } else {
        response = await axios.get(`https://api.postalpincode.in/postoffice/${value}`)
      }
      if (response.data && response.data[0].PostOffice) {
        const suggestions = response.data[0].PostOffice.map(p => ({
          value: `${p.Pincode} - ${p.Name}, ${p.District}, ${p.State}`
        }))
        setOptions(suggestions)
      } else {
        setOptions([])
      }
    } catch (error) {
      setOptions([])
    }
  }

  const handleLocationSelect = (value) => {
    setLocation(value)
    setIsModalOpen(false)
  }

  return (
    <div>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-10 mt-10'>
        <div className='flex items-center gap-3 w-full md:min-w-md'>
          <AntdInput holder="Search by name" filterDoctors={setSearchTerm} />
          <div 
            className='text-2xl cursor-pointer flex items-center gap-2' 
            onClick={() => setIsModalOpen(true)}
          >
            <MapPin className='text-primary' />
            {location && <span className="text-sm text-gray-700">{location}</span>}
          </div>
        </div>
        <select 
          className='w-full md:max-w-xs border border-gray-300 rounded px-4 py-3 text-sm cursor-pointer outline-none' 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {specialities.map((item, index) => (
            <option key={index} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {doctors.map((item, index) => (
            <div 
              onClick={() => navigate(`/appointments/${item._id}`)} 
              key={index} 
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
            >
              <img className='bg-blue-50 w-full h-48 object-cover' src={item.user.img} alt={item.user.name} />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.user.isActive ? 'text-green-500' : 'text-gray-500'}`}>
                  <p className={`w-2 h-2 ${item.user.isActive ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                  <p>{item.user.isActive ? 'Available' : "Not Available"}</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.user.name}</p>
                <p className='text-gray-600 text-sm'>{item.specilization}</p>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-700">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" /> {item.rating || "N/A"}
                  </span>
                  <span>{item.experience} yrs exp</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal 
        title="Enter your location / PIN" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        footer={null}
      >
        <AutoComplete
          style={{ width: '100%' }}
          options={options}
          onSearch={handleLocationSearch}
          onSelect={handleLocationSelect}
        >
          <Input.Search size="large" placeholder="Type city or PIN code" enterButton />
        </AutoComplete>
      </Modal>
    </div>
  )
}

export default Doctors
