import { createContext,useEffect,useState} from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext=createContext();

const AppContextProvider=(props)=>{
    const currencySymbol='$'
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    
    const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):'')
    const [userData,setUserData]=useState(false)
   

     

    const loadUserProfileData=async()=>{
        try{
            const {data}=await axios.get(backendUrl+'/profile/get-user',{headers:{
                Authorization:"Bearer "+token}})
            if(data.success){
                setUserData(data.user)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }

    const value={
        currencySymbol,setToken,backendUrl,token,userData,setUserData,loadUserProfileData   
    }

   

    useEffect(()=>{
        if(token){
            loadUserProfileData()
        }else{
            setUserData(false)
        }
    },[token])

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider