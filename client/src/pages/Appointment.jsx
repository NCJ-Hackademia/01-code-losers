import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';
import { DatePicker, Button } from 'antd';

const Appointment = () => {
  const { docId } = useParams(); // doctor ID from URL
  const { backendUrl, token } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [queueInfo, setQueueInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getDoctorInfo();
  }, [docId]);

  useEffect(() => {
    if (selectedDate) getQueueDetails();
  }, [selectedDate]);

  const getDoctorInfo = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/hospital/get-by-id`,
        { id: docId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Doctor info:", data);

      if (data.success) setDocInfo(data.user);
      else toast.error(data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const getQueueDetails = async () => {
    try {
      const dateStr = moment(selectedDate).format('DD-MM-YYYY');
      const { data } = await axios.get(
        `${backendUrl}/hospital/get-doctor-details`,
        {
          params: { date: dateStr, doctor_id: docId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Queue details:", data);
      if (data) setQueueInfo(data);
      else setQueueInfo(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch queue details");
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment');
      return navigate('/login');
    }

    if (!selectedDate) {
      toast.warn('Please select a date');
      return;
    }

    try {
      const dateStr = moment(selectedDate).format('DD-MM-YYYY');

      const { data } = await axios.post(
        `${backendUrl}/queue/add-in-queue`,
        { doctor_id: docId, date: dateStr },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Book appointment response:", data);

      if (data.queue) {
        toast.success("Appointment booked successfully");
        setQueueInfo(data.queue);
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return docInfo ? (
    <div className="p-4">
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            src={docInfo.user_id?.img}
            alt={docInfo.user_id?.name}
            className="bg-primary w-full sm:max-w-72 rounded-lg"
          />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.user_id?.name}
            <img src={assets.verified_icon} className="w-5" alt="verified" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo?.specilization}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo?.experience} yrs</button>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo?.description}</p>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>{i < docInfo?.rating ? '⭐' : '☆'}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Date Selection */}
      <div className="sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700">
        <p>Select Appointment Date</p>
        <DatePicker
          value={selectedDate ? moment(selectedDate) : null}
          onChange={(date) => setSelectedDate(date ? date.toDate() : null)}
          format="DD-MM-YYYY"
          className="mt-3"
        />

        {/* Queue info */}
        {queueInfo && (
          <div className="mt-4 text-gray-700">
            <p>Current Queue Count: {queueInfo.count || 0}</p>
            <p>
              Estimated End Time:{' '}
              {queueInfo.end_time ? moment(queueInfo.end_time).format('HH:mm') : 'N/A'}
            </p>
          </div>
        )}

        <Button
          type="primary"
          onClick={bookAppointment}
          className="mt-6"
        >
          Book an appointment
        </Button>
      </div>

      {/* Related Doctors */}
    </div>
  ) : (
    <p>Loading doctor details...</p>
  );
};

export default Appointment;
