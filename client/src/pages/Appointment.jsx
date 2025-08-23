import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { currencySymbol, backendUrl, token } = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);
  const [docInfo, setDocInfo] = useState(null);

  const [dates, setDates] = useState([]);  // available dates
  const [selectedDate, setSelectedDate] = useState(null); // chosen date

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const navigate = useNavigate();

  useEffect(() => {
    getDoctorsData();
    generateDates();
  }, [])

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list')
      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
  }

  const generateDates = () => {
    let today = new Date();
    let next7Days = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      next7Days.push(currentDate);
    }
    setDates(next7Days);
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    if (!selectedDate) {
      toast.warn('Please select a date before booking');
      return;
    }

    try {
      let day = selectedDate.getDate()
      let month = selectedDate.getMonth() + 1
      let year = selectedDate.getFullYear()

      const slotDate = `${day}_${month}_${year}`

      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate },  // only sending date now
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo();
  }, [docId, doctors]);

  return docInfo && (
    <div>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img src={docInfo.image} alt="" className='bg-primary w-full sm:max-w-72 rounded-lg' />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name}
            <img src={assets.verified_icon} className='w-5' />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-small text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>

      {/* Date Selection */}
      <div className='sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700'>
        <p>Select Appointment Date</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {dates.map((date, index) => (
            <div
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${selectedDate?.getDate() === date.getDate() ? 'bg-primary text-white' : 'border border-gray-200'}`}
            >
              <p>{daysOfWeek[date.getDay()]}</p>
              <p>{date.getDate()}</p>
            </div>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'
        >
          Book an appointment
        </button>
      </div>

      
    </div>
  )
}

export default Appointment
