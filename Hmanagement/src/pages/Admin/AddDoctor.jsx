import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role] = useState("doctor"); // fixed as doctor
  const [isActive, setIsActive] = useState(true);

  const [hospital_id, setHospitalId] = useState("");
  const [specilization, setSpecilization] = useState("General Physician");
  const [pincode, setPincode] = useState("");
  const [rating, setRating] = useState(3.5);
  const [experience, setExperience] = useState(1);
  const [usersPerDay, setUsersPerDay] = useState(50);
  const [description, setDescription] = useState("");

  const { aToken, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();
      formData.append("image", docImg);

      // user fields
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);
      formData.append("role", role);
      formData.append("isActive", isActive);

      // doctor fields
      formData.append("hospital_id", hospital_id);
      formData.append("specilization", specilization);
      formData.append("pincode", pincode);
      formData.append("rating", rating);
      formData.append("experience", experience);
      formData.append("usersPerDay", usersPerDay);
      formData.append("description", description);

      const { data } = await axios.post(
        backendUrl + "/hospital/add-doctor",
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);

        // reset fields
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
        setHospitalId("");
        setSpecilization("General Physician");
        setPincode("");
        setRating(3.5);
        setExperience(1);
        setUsersPerDay(50);
        setDescription("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>Upload doctor picture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
          <div>
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border rounded px-3 py-2 w-full"
              type="text"
              placeholder="Name"
              required
            />
          </div>

          <div>
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border rounded px-3 py-2 w-full"
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border rounded px-3 py-2 w-full"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <div>
            <p>Phone Number</p>
            <input
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
              className="border rounded px-3 py-2 w-full"
              type="text"
              placeholder="Phone Number"
              required
            />
          </div>

          <div>
            <p>Hospital ID</p>
            <input
              onChange={(e) => setHospitalId(e.target.value)}
              value={hospital_id}
              className="border rounded px-3 py-2 w-full"
              type="text"
              placeholder="Hospital ID"
              
            />
          </div>

          <div>
            <p>Specialization</p>
            <select
              className="border rounded px-3 py-2 w-full"
              onChange={(e) => setSpecilization(e.target.value)}
              value={specilization}
            >
              <option value="General Physician">General Physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div>
            <p>Pincode</p>
            <input
              onChange={(e) => setPincode(e.target.value)}
              value={pincode}
              className="border rounded px-3 py-2 w-full"
              type="number"
              placeholder="Pincode"
              required
            />
          </div>

          <div>
            <p>Rating</p>
            <input
              onChange={(e) => setRating(e.target.value)}
              value={rating}
              className="border rounded px-3 py-2 w-full"
              type="number"
              step="0.1"
              placeholder="Rating"
            />
          </div>

          <div>
            <p>Experience (years)</p>
            <input
              onChange={(e) => setExperience(e.target.value)}
              value={experience}
              className="border rounded px-3 py-2 w-full"
              type="number"
              placeholder="Experience"
              required
            />
          </div>

          <div>
            <p>Users per Day</p>
            <input
              onChange={(e) => setUsersPerDay(e.target.value)}
              value={usersPerDay}
              className="border rounded px-3 py-2 w-full"
              type="number"
              placeholder="Users per Day"
              required
            />
          </div>

          <div>
            <p>Availability</p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                className="w-4 h-4 accent-green-500"
              />
              <span>{isActive ? "Active" : "Inactive"}</span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <p>Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-4 pt-2 border rounded"
            placeholder="Write about doctor"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-6 text-white rounded-full"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
