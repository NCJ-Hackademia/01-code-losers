import React, { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import { Modal, AutoComplete, Input, Select, Button } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AiRecommend = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [options, setOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTagsChange = (values) => {
    setTags(values);
  };

  const handleLocationSearch = async (value) => {
    if (!value) {
      setOptions([]);
      return;
    }
    try {
      let response;
      if (/^\d{6}$/.test(value)) {
        response = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
      } else {
        response = await axios.get(`https://api.postalpincode.in/postoffice/${value}`);
      }

      if (response.data && response.data[0].PostOffice) {
        const suggestions = response.data[0].PostOffice.map((p) => ({
          value: `${p.Pincode} - ${p.Name}, ${p.District}, ${p.State}`,
        }));
        setOptions(suggestions);
      } else {
        setOptions([]);
      }
    } catch (error) {
      setOptions([]);
    }
  };

  const handleLocationSelect = (value) => {
    setLocation(value);
    setIsModalOpen(false);
  };

  const callGeminiOrFetchDoctors = async () => {
    setLoading(true);
    try {
      let specialist = null;

      // If symptoms are selected, call Gemini first
      if (tags.length > 0) {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/call-gemini/run`, {
          symptoms: tags,
        });

        const [disease, predictedSpecialist] = response.data;
        setRecommendation({ disease, specialist: predictedSpecialist });
        specialist = predictedSpecialist;
      }

      // Fetch doctors based on specialist / location / pincode
      await fetchDoctors(specialist);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async (specialist) => {
    try {
      const query = {};

      if (specialist && specialist !== "general") {
        query.specialization = specialist.toLowerCase();
      }

      const pincodeMatch = location.match(/^\d{6}/);
      if (pincodeMatch) {
        query.pincode = Number(pincodeMatch[0]);
      } else if (location) {
        query.city = location; // optional, backend must support city filtering
      }

      // Only call backend if we have at least one filter
      if (Object.keys(query).length === 0) {
        setDoctors([]);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/hospital/get-doctors`, {
        params: query,
      });

      setDoctors(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-center gap-4">
        <Select
          mode="tags"
          style={{ width: '40%' }}
          placeholder="Enter symptoms"
          value={tags}
          onChange={handleTagsChange}
          notFoundContent={null}
        />
        <div
          className="text-2xl cursor-pointer flex items-center gap-2 min-w-[180px]"
          onClick={() => setIsModalOpen(true)}
        >
          <MapPin className="text-primary" />
          {location && <span className="text-sm text-gray-700 truncate">{location}</span>}
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

      <div className="mt-4">
        <Button type="primary" onClick={callGeminiOrFetchDoctors} loading={loading}>
          Get Recommendation / Find Doctors
        </Button>
      </div>

      {/* {recommendation && (
        <div className="mt-6 text-lg">
          <p><strong>Disease:</strong> {recommendation.disease}</p>
          <p><strong>Specialist:</strong> {recommendation.specialist}</p>
        </div>
      )} */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {doctors.map((item, index) => (
          <div
            onClick={() => navigate(`/appointments/${item._id}`)}
            key={index}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 justify-center items-center"
          >
            <img className="bg-blue-50 w-full h-48 object-cover" src={item.user.img} alt={item.user.name} />
            <div className="p-4">
              <div className={`flex items-center gap-2 text-sm text-center ${item.user.isActive ? 'text-green-500' : 'text-gray-500'}`}>
                <p className={`w-2 h-2 ${item.user.isActive ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                <p>{item.user.isActive ? 'Available' : "Not Available"}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.user.name}</p>
              <p className="text-gray-600 text-sm">{item.specilization}</p>
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
  );
};

export default AiRecommend;
