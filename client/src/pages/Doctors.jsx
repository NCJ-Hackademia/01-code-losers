import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AntdInput from '../ui/Input/input'
import { MapPin } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Modal, AutoComplete, Input } from 'antd'

const specialities = [
  { id: "SELECT CATEGORY", name: "Select Category" },
  { id: "GENERAL PHYSICIAN", name: "General Physician" },
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
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [location, setLocation] = useState("")
  const [options, setOptions] = useState([])

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    getDoctorsData()
  }, [])

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list')
      if (data.success) {
        setDoctors(data.doctors)
        setFilteredDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    let filtered = doctors
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(doc =>
        doc.speciality.toUpperCase() === selectedCategory
      )
    }
    setFilteredDoctors(filtered)
  }, [searchTerm, selectedCategory, doctors])

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
          {filteredDoctors.map((item, index) => (
            <div 
              onClick={() => navigate(`/appointments/${item._id}`)} 
              key={index} 
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
            >
              <img className='bg-blue-50' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                  <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                  <p>{item.available ? 'Available' : "Not Available"}</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.speciality}</p>
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
