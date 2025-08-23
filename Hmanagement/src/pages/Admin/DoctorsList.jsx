import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { Star } from 'lucide-react'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">All Doctors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
          >
            <img
              className="bg-blue-50 w-full h-48 object-cover"
              src={item.user.img}
              alt={item.user.name}
            />
            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm ${
                  item.user.isActive ? 'text-green-500' : 'text-gray-500'
                }`}
              >
                <p
                  className={`w-2 h-2 rounded-full ${
                    item.user.isActive ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                ></p>
                <p>{item.user.isActive ? 'Available' : 'Not Available'}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.user.name}</p>
              <p className="text-gray-600 text-sm">{item.specilization}</p>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-700">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {item.rating || 'N/A'}
                </span>
                <span>{item.experience || 0} yrs exp</span>
              </div>
           
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList
