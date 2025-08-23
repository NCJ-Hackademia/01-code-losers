import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({});

  useEffect(() => {
    if (profileData) setForm(profileData);
  }, [profileData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const updateProfile = async () => {
    try {
      const updateData = { ...form };
      const { data } = await axios.put(
        backendUrl + "/hospital/update-doctor",
        updateData,
        {
          headers: { Authorization: "Bearer " + dToken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="m-5 flex justify-center">
        <div className="bg-white px-8 py-8 border rounded-2xl  w-full max-w-4xl max-h-[85vh] overflow-y-scroll">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Doctor Profile
          </h2>

          
          <div className="flex items-center gap-4 mb-8 text-gray-600">
            <img
              className="w-20 h-20 bg-gray-100 rounded-full object-cover shadow"
              src={form.img}
              alt={form.name}
            />
            <p className="text-sm">Doctor Profile Picture</p>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <label className="font-medium">Name</label>
              <input
                name="name"
                onChange={handleChange}
                value={form.name || ""}
                className="mt-1 border rounded-lg px-3 py-2 w-full"
                type="text"
                disabled={!isEdit}
              />
            </div>

            <div>
              <label className="font-medium">Email</label>
              <input
                name="email"
                onChange={handleChange}
                value={form.email || ""}
                className="mt-1 border rounded-lg px-3 py-2 w-full"
                type="email"
                disabled={!isEdit}
              />
            </div>

            <div>
              <label className="font-medium">Phone Number</label>
              <input
                name="phoneNumber"
                onChange={handleChange}
                value={form.phoneNumber || ""}
                className="mt-1 border rounded-lg px-3 py-2 w-full"
                type="text"
                disabled={!isEdit}
              />
            </div>

            

            <div>
              <label className="font-medium">Specialization</label>
              <input
                name="specilization"
                onChange={handleChange}
                value={form.specilization || ""}
                className="mt-1 border rounded-lg px-3 py-2 w-full"
                type="text"
                disabled={!isEdit}
              />
            </div>

            <div>
              <label className="font-medium">Pincode</label>
              <input
                name="pincode"
                onChange={handleChange}
                value={form.pincode || ""}
                className="mt-1 border rounded-lg px-3 py-2 w-full"
                type="number"
                disabled={!isEdit}
              />
            </div>

            <div>
              <label className="font-medium">Experience</label>
              <input
                name="experience"
                onChange={handleChange}
                value={form.experience || ""}
                className="mt-1 border rounded-lg px-3 py-2 w-full"
                type="number"
                disabled={!isEdit}
              />
            </div>

            <div>
              <label className="font-medium">Users Per Day</label>
              <input
                name="usersPerDay"
                onChange={handleChange}
                value={form.usersPerDay || ""}
                className="mt-1 border rounded-lg px-3 py-2 w-full"
                type="number"
                disabled={!isEdit}
              />
            </div>



           
          </div>

          
          <div className="mt-6">
            <label className="font-medium">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              value={form.description || ""}
              className="w-full mt-1 px-4 pt-2 border rounded-lg"
              rows={4}
              disabled={!isEdit}
            />
          </div>

          
          {isEdit ? (
            <div className="flex gap-4 mt-8">
              <button
                onClick={updateProfile}
                type="button"
                className="bg-blue-600 px-6 py-3 text-white rounded-xl font-semibold shadow"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEdit(false);
                  setForm(profileData);
                }}
                type="button"
                className="px-6 py-3 rounded-xl border text-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              type="button"
              className="mt-8 bg-gray-100 px-6 py-3 text-gray-800 rounded-xl font-semibold shadow"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
