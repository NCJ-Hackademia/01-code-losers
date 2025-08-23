import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } =
    useContext(DoctorContext)
  const { slotDateFormat } = useContext(AppContext)

  const [date, setDate] = useState('')

  useEffect(() => {
    if (dToken) {
      getAppointments(date) 
    }
  }, [dToken, date])

  const handleStatusChange = (appointmentId, value) => {
    if (value === 'accept') {
      completeAppointment(appointmentId)
    } else if (value === 'reject') {
      cancelAppointment(appointmentId)
    } else {
      console.log(`Appointment ${appointmentId} set to waiting`)
    }
  }

  
  const formatDate = (inputDate) => {
    if (!inputDate) return ''
    const d = new Date(inputDate)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = String(d.getFullYear()).slice(-2) 
    return `${day}-${month}-${year}`
  }

  const handleDateChange = (e) => {
    const formatted = formatDate(e.target.value)
    setDate(formatted)
  }

  return (
    <div className="w-full max-w-6xl m-5">
      <div className="flex w-full justify-between items-center">
        <p className="mb-3 text-lg font-medium">All Appointments</p>

        <div>
          <input
            type="date"
            className="m-4 border rounded px-2 py-1 text-sm outline-none"
            onChange={handleDateChange}
          />
          <select className="border rounded px-2 py-1 text-sm outline-none">
            <option value="queue">queue</option>
            <option value="waiting">waiting</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Date & Time</p>
          <p>Action</p>
        </div>
        {appointments
          .slice()
          .reverse()
          .map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              key={index}
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img className="w-8 rounded-full" src={item.userData.image} alt="" />
                <p>{item.userData.name}</p>
              </div>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Rejected</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Accepted</p>
              ) : (
                <select
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  defaultValue="waiting"
                  className="border rounded px-2 py-1 text-sm outline-none"
                >
                  <option value="action">select action</option>
                  <option value="waiting">Waiting</option>
                  <option value="accept">Accept</option>
                  <option value="reject">Reject</option>
                </select>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}

export default DoctorAppointments
