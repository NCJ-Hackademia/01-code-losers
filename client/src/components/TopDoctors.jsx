import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TopDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    getDoctorsData();
  }, []);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/hospital/get-doctors");
      if (data.success) {
        setDoctors(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-semibold">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-gray-600 text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
  {doctors.slice(0, 10).map((item, index) => (
    <div
      onClick={() => navigate(`/appointments/${item._id}`)}
      key={index}
      className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
    >
      <img
        className="bg-blue-50 w-full h-48 object-cover"
        src={item.user?.img}
        alt={item.user?.name}
      />
      <div className="p-4">
        <div
          className={`flex items-center gap-2 text-sm ${
            item.user?.isActive ? "text-green-500" : "text-gray-500"
          }`}
        >
          <p
            className={`w-2 h-2 ${
              item.user?.isActive ? "bg-green-500" : "bg-gray-500"
            } rounded-full`}
          ></p>
          <p>{item.user?.isActive ? "Available" : "Not Available"}</p>
        </div>

        <p className="text-gray-900 text-lg font-medium">{item.user?.name}</p>
        <p className="text-gray-600 text-sm">{item.specilization}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <span>⭐ {item.rating}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{item.experience} yrs exp.</span>
        </div>
      </div>
    </div>
  ))}
</div>


      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-500 text-white font-medium px-8 py-3 rounded-full mt-10 hover:bg-blue-600 transition"
      >
        View All Doctors
      </button>
    </div>
  );
};

export default TopDoctors;
