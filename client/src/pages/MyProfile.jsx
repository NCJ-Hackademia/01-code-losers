import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  console.log(userData)
  const [isEdit, setIsEdit] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name)
      formData.append('phoneNumber', userData.phoneNumber)

      const { data } = await axios.put(
        backendUrl + '/profile/update-user',
        formData,
        { headers: { Authorization: "Bearer " + token } }
      )

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      
      <img className='w-36 rounded' src={userData.img} alt="Profile" />

      {
        isEdit
          ? <input
              className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
              type='text'
              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
              value={userData.name}
            />
          : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      }

      <hr className='bg-zinc-400 h-[1px] border-none' />

      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium'>Phone:</p>
          {
            isEdit
              ? <input
                  className="bg-gray-100 max-w-52"
                  type='text'
                  onChange={(e) => setUserData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  value={userData.phoneNumber}
                />
              : <p className='text-blue-400'>{userData.phoneNumber}</p>
          }
        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3'>ACCOUNT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Role:</p>
          <p className='text-gray-500'>{userData.role}</p>

          <p className='font-medium'>Status:</p>
          <p className={userData.isActive ? 'text-green-500' : 'text-red-500'}>
            {userData.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      <div className='mt-10'>
        {
          isEdit
            ? <button
                className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
                onClick={updateUserProfileData}
              >
                Save information
              </button>
            : <button
                className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
        }
      </div>
    </div>
  )
}

export default MyProfile
