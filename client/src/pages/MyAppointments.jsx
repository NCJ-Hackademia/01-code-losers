import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

 
  

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/queue/get-queue-details', {
        headers: {
          Authorization: "Bearer " + token
        }
      })

      if (data) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      }
    }
    catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }
      else {
        toast.error(data.message)
      }
    }
    catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div className="mt-12">
      <p className="pb-3 font-medium text-zinc-700 border-b">My Appointments</p>


      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 text-sm font-semibold text-neutral-700 py-2 border-b bg-zinc-100 rounded-md mt-2">
        <p>Doctor Name</p>
        <p>Specialization</p>
        <p>Date & Time</p>

      </div>


      <div>
        {appointments && appointments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-3 border-b text-sm text-zinc-600 items-center"
          >
            <p className="font-medium text-neutral-800">{item.queue_id.doctor_id.user_id.name}</p>
            <p>{item.queue_id.doctor_id.specilization}</p>
            <p>
              {new Date(item.estimated_time).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
        
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
