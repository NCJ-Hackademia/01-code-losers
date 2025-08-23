import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate=useNavigate();
  const {backendUrl,setToken,token}=useContext(AppContext)

  const [state,setState]=useState('Sign Up')

  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')
  const [newAccount,setNewAccount]=useState(false) 
  const [otp,setOtp]=useState('')
  const [phoneNumber,setPhoneNumber] =useState("");

  const onSubmitHandler=async(event)=>{
    event.preventDefault();
    try {
      if (state === 'Sign Up') {
        if (!newAccount) {
          const result = await axios.post(`${backendUrl}/auth/send-otp`, { email});

            setNewAccount(true);
            toast.success('OTP sent to your email. Please verify.');
        } else {
          const response = await axios.post(`${backendUrl}/auth/register`, { email, otp,password,name,phoneNumber });
          console.log(response)
          if (response) {
            toast.success('Account created successfully. Please login.');
            setNewAccount(false);
            setState('Login');
            setName('');
            setEmail('');
            setPassword('');
            setPhoneNumber("");
            setOtp('');
          } else {
            toast.error(data.message);
          }
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/auth/login`, { email, password });
        if (data) {
          console.log(data)
          localStorage.setItem('token', data);
          setToken(data);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message);
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state==='Sign Up'?"Create Account":"Login"}</p>
        <p>Please {state==='Sign Up'?"sign up":"login"} to book appointent</p>
        {state==="Sign Up" && <div className='w-full'>
          <p>Full Name</p>
          <input className="border border-zinc-300 rounded w-full p-2 mt-1" type="text" onChange={(e)=>{setName(e.target.value)}} value={name} required/>
        </div>}
         {state==="Sign Up" && <div className='w-full'>
          <p>Phone number</p>
          <input className="border border-zinc-300 rounded w-full p-2 mt-1" type="text" onChange={(e)=>{setPhoneNumber(e.target.value)}} value={phoneNumber} required/>
        </div>}
        
        <div className='w-full'>
          <p>Email</p>
          <input className="border border-zinc-300 rounded w-full p-2 mt-1" type="email" onChange={(e)=>{setEmail(e.target.value)}} value={email} required/>
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className="border border-zinc-300 rounded w-full p-2 mt-1" type="password" onChange={(e)=>{setPassword(e.target.value)}} value={password} required/>
        </div>
        {newAccount&& <div className='w-full'>
          <p>Enter otp</p>
          <input className="border border-zinc-300 rounded w-full p-2 mt-1" type="text" onChange={(e)=>{setOtp(e.target.value)}} value={otp} required/>
        </div> }
        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>{state==='Sign Up'?"Create account":"Login"}</button>
        <p onClick={() => navigate('/forgot-password')} className='text-red-600 cursor-pointer'>
  Forgot Password?
</p>

        {
          state==="Sign Up"
          ?<p>Already have an account? <span onClick={()=>{setState('Login')}} className='text-primary underline cursor-pointer'>Login here</span></p>
          :<p>Create an new account? <span onClick={()=>{setState('Sign Up')}} className='text-primary underline cursor-pointer'>click here</span></p>
        }
        
       
      </div>
    </form>
  ) 
}

export default Login
