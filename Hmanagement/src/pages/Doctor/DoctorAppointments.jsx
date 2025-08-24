import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Select, Modal, Form, Input, DatePicker, message, Space } from "antd";
import moment from "moment";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
const { Option } = Select;
const { TextArea } = Input;

const DoctorAppointments = () => {
  const { dToken, appointments, setAppointments, getAppointments, backendUrl } = useContext(DoctorContext);

  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState("original");
  const [selectedDate, setSelectedDate] = useState(moment());
  const [medModalVisible, setMedModalVisible] = useState(false);
  const [currentQueUser, setCurrentQueUser] = useState(null);
  const [form] = Form.useForm();


  const fetchAppointments = async () => {
    if (!dToken) return;
    try {
      setLoading(true);
      const dateStr = selectedDate.format("DD-MM-YYYY");
      console.log("Fetching appointments for date:", dateStr, "and type:", typeFilter);

      const { data } = await axios.get(`${backendUrl}/queue/get-queue`, {
        params: { date: dateStr, type: typeFilter },
        headers: { Authorization: `Bearer ${dToken}` },
      });

      console.log("Appointments response:", data);

      if (data.appointments && Array.isArray(data.appointments)) {
        setAppointments(data.appointments);
      } else {
        setAppointments([]);
        message.info(data.message || "No appointments found");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      message.error("Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [dToken, typeFilter, selectedDate]);

  const handleReject = async (queUserId) => {
    try {
      console.log("Rejecting appointment:", queUserId);
      const { data } = await axios.post(
        `${backendUrl}/queue/reject/${queUserId}`,
        {},
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      console.log("Reject response:", data);
      if (data.appointment) {
        message.success("Appointment rejected");
        fetchAppointments();
      } else {
        message.error(data.message || "Failed to reject appointment");
      }
    } catch (err) {
      console.error("Error rejecting appointment:", err);
      message.error("Failed to reject appointment");
    }
  };

  const handleWaiting = async (queUserId) => {
    try {
      console.log("Moving to waiting queue:", queUserId);
      const { data } = await axios.post(
        `${backendUrl}/queue/add-wt-queue`,
        { queUserId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      console.log("Waiting response:", data);
      if (data.queUser) {
        message.success("Moved to waiting queue");
        fetchAppointments();
      } else {
        message.error(data.message || "Failed to move to waiting queue");
      }
    } catch (err) {
      console.error("Error moving to waiting queue:", err);
      message.error("Failed to move to waiting");
    }
  };

  const openAcceptModal = (record) => {
    console.log("Opening accept modal for:", record);
    setCurrentQueUser(record);
    form.resetFields();
    setMedModalVisible(true);
  };

  const handleAccept = async () => {
    try {
      const values = await form.validateFields();
      console.log("Submitting medical record values:", values);

      const url =
        currentQueUser.type === "waiting"
          ? `${backendUrl}/queue/accept-wt-patient`
          : `${backendUrl}/queue/add-medical-record`;

      const { data } = await axios.post(
        url,
        {
          queUserId: currentQueUser._id,
          description: values.description,
          medicine: values.medicine,
          disease: values.disease,
        },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );

      console.log("Accept response:", data);

      if (data.success) {
        message.success(data.message);
        setMedModalVisible(false);
        fetchAppointments();
      } else {
        message.error(data.message || "Failed to accept appointment");
      }
    } catch (err) {
      console.error("Error accepting appointment:", err);
      message.error("Failed to accept appointment");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (_, __, i) => i + 1,
      width: 50,
    },
    {
      title: "Patient",
      dataIndex: ["user_id", "name"],
      render: (_, record) => record.user_id?.name || "-",
    },
    {
      title: "Date & Time",
      dataIndex: "estimated_time",
      render: (time) => moment(time).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 100,
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => openAcceptModal(record)}>
            Accept
          </Button>
          {record.type !== "waiting" && (
            <Button onClick={() => handleWaiting(record._id)}>Waiting</Button>
          )}
          <Button danger onClick={() => handleReject(record._id)}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          format="DD-MM-YYYY"
        />
        <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 120 }}>
          <Option value="original">Queue</Option>
          <Option value="waiting">Waiting</Option>
          <Option value="reject">Reject</Option>
        </Select>
      </Space>

      <Table
        dataSource={appointments}
        columns={columns}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        visible={medModalVisible}
        title="Add Medical Record"
        onCancel={() => setMedModalVisible(false)}
        onOk={handleAccept}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Medicine"
            name="medicine"
            rules={[{ required: true, message: "Please enter medicine" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Disease"
            name="disease"
            rules={[{ required: true, message: "Please enter disease" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorAppointments;
