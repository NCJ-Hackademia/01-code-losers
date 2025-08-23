import cloudinary from 'cloudinary'
import 'dotenv/config'

cloudinary.config({
    api_key:process.env.CLOUD_API_KEY,
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUD_SECRET
})

export default cloudinary;