import React, { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Modal, AutoComplete, Input, Select } from 'antd'
import axios from 'axios'

const AiRecommend = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [location, setLocation] = useState("")
  const [options, setOptions] = useState([])
  const [tags, setTags] = useState([])


console.log(tags)
console.log(location.match(/^\d{6}/)?.[0] || "")

  const handleLocationSearch = async (value) => {
    if (!value) {
      setOptions([])
      return
    }
    try {
      let response
      if (/^\d{6}$/.test(value)) {
        response = await axios.get(`https://api.postalpincode.in/pincode/${value}`)
      } else {
        response = await axios.get(`https://api.postalpincode.in/postoffice/${value}`)
      }
      if (response.data && response.data[0].PostOffice) {
        const suggestions = response.data[0].PostOffice.map(p => ({
          value: `${p.Pincode} - ${p.Name}, ${p.District}, ${p.State}`
        }))
        setOptions(suggestions)
      } else {
        setOptions([])
      }
    } catch (error) {
      setOptions([])
    }
  }

  const handleLocationSelect = (value) => {
    setLocation(value)
    setIsModalOpen(false)
  }

  const handleTagsChange = (values) => {
    setTags(values)
  }

  return (
    <div className="p-5">
      <div className="flex items-center gap-4">
        <Select
          mode="tags"
          style={{ width: '40%' }}
          placeholder="Enter options"
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
    </div>
  )
}

export default AiRecommend
