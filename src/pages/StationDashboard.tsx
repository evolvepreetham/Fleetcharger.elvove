import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, BarChart2, Calendar, Edit, Save, XCircle } from 'lucide-react';

// Main Station Dashboard component
export default function StationDashboard() {
  const [stationData, setStationData] = useState({
    name: "Zeon Charge Davanagere",
    location: "Davanagere, Karnataka",
    uptimePercentage: 97.2,
    totalCharges: 2100,
    revenueLastMonth: 18500,
    energyDispensedKWh: 72000,
    schedule: [
      { company: "VRL Logistics", time: "08:00 - 09:00", vehicles: 3, status: "Confirmed" },
      { company: "Amazon Logistics", time: "09:30 - 10:30", vehicles: 2, status: "Confirmed" },
      { company: "Blue Dart", time: "11:00 - 12:00", vehicles: 1, status: "Pending" },
      { company: "City Express", time: "12:30 - 13:30", vehicles: 2, status: "Confirmed" },
      { company: "Eco Haulers", time: "14:00 - 15:00", vehicles: 1, status: "Confirmed" },
    ],
    dailyStats: [
      { name: 'Day 1', charges: 15, revenue: 1200 },
      { name: 'Day 2', charges: 18, revenue: 1450 },
      { name: 'Day 3', charges: 12, revenue: 900 },
      { name: 'Day 4', charges: 20, revenue: 1600 },
      { name: 'Day 5', charges: 16, revenue: 1300 },
      { name: 'Day 6', charges: 19, revenue: 1550 },
      { name: 'Day 7', charges: 14, revenue: 1100 },
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Initialize edit form data when editing starts
  useEffect(() => {
    if (isEditing) {
      setEditFormData({
        name: stationData.name,
        location: stationData.location,
      });
    }
  }, [isEditing, stationData]);

  // Handle input changes for the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save updated station information
  const handleSave = () => {
    setStationData(prev => ({
      ...prev,
      name: editFormData.name,
      location: editFormData.location,
    }));
    setIsEditing(false);
    setMessage('Station information updated successfully!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setMessage('Update cancelled.');
    setMessageType('error');
    setTimeout(() => setMessage(''), 3000);
  };

  // Function to simulate fetching data from an LLM for insights
  const getLLMInsights = async (prompt) => {
    setMessage('Generating insights...');
    setMessageType('info');
    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Canvas will provide this
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setMessage(text);
        setMessageType('success');
      } else {
        setMessage('Failed to get insights: Unexpected response structure.');
        setMessageType('error');
      }
    } catch (error) {
      console.error("Error fetching LLM insights:", error);
      setMessage(`Failed to get insights: ${error.message}`);
      setMessageType('error');
    } finally {
      setTimeout(() => setMessage(''), 10000);
    }
  };

  return (
    <div className="min-h-screen font-inter relative overflow-hidden">
      {/* Background Image with Blur and Animation */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-pan-zoom"
        style={{
          backgroundImage: `url('https://placehold.co/1920x1080/E0F2F7/2E8B57?text=Charging+Station')`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      ></div>

      {/* Custom CSS for animations and theme */}
      <style>
        {`
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInSlideUp {
          animation: fadeInSlideUp 0.6s ease-out forwards;
        }

        /* Staggered animations */
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }

        @keyframes pan-zoom {
          0% {
            transform: scale(1.1) translateX(0) translateY(0);
          }
          50% {
            transform: scale(1.15) translateX(5%) translateY(5%);
          }
          100% {
            transform: scale(1.1) translateX(0) translateY(0);
          }
        }

        .animate-pan-zoom {
          animation: pan-zoom 20s ease-in-out infinite alternate;
        }
        `}
      </style>

      {/* Main content wrapper with light green background and backdrop blur */}
      <div className="relative z-10 max-w-7xl mx-auto bg-white bg-opacity-90 rounded-xl shadow-lg p-6 sm:p-8 mt-8 mb-8"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <header className="mb-8 text-center animate-fadeInSlideUp">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Charging Station Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            {stationData.name} - {stationData.location}
          </p>
        </header>

        {message && (
          <div className={`p-3 mb-4 rounded-lg text-center animate-fadeInSlideUp delay-100 ${
            messageType === 'success' ? 'bg-green-100 text-green-800' :
            messageType === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {message}
          </div>
        )}

        {/* Update Station Info Section */}
        <section className="mb-8 p-6 bg-green-50 rounded-lg shadow-md animate-fadeInSlideUp delay-200">
          <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center">
            <Edit className="mr-2" size={24} /> Update Station Information
          </h2>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="stationName" className="block text-gray-700 text-sm font-bold mb-2">
                  Station Name:
                </label>
                <input
                  type="text"
                  id="stationName"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="stationLocation" className="block text-gray-700 text-sm font-bold mb-2">
                  Location:
                </label>
                <input
                  type="text"
                  id="stationLocation"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditChange}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300 hover:scale-105"
                >
                  <Save className="mr-2" size={20} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300 hover:scale-105"
                >
                  <XCircle className="mr-2" size={20} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300 hover:scale-105"
            >
              <Edit className="mr-2" size={20} /> Edit Station Info
            </button>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Uptime Section */}
          <section className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center animate-fadeInSlideUp delay-300">
            <Clock size={48} className="mb-3" />
            <h2 className="text-2xl font-bold mb-2">Uptime</h2>
            <p className="text-5xl font-extrabold">{stationData.uptimePercentage}%</p>
            <p className="text-sm mt-1">Last 30 Days</p>
          </section>

          {/* Statistics Section */}
          <section className="bg-gradient-to-br from-teal-500 to-teal-700 text-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center animate-fadeInSlideUp delay-400">
            <BarChart2 size={48} className="mb-3" />
            <h2 className="text-2xl font-bold mb-2">Key Statistics</h2>
            <div className="text-lg">
              <p>Total Charges: <span className="font-semibold">{stationData.totalCharges}</span></p>
              <p>Revenue (Last Month): <span className="font-semibold">₹{stationData.revenueLastMonth.toLocaleString()}</span></p>
              <p>Energy Dispensed: <span className="font-semibold">{stationData.energyDispensedKWh} kWh</span></p>
            </div>
          </section>

          {/* Daily Statistics Chart */}
          <section className="bg-white p-6 rounded-xl shadow-md col-span-1 lg:col-span-1 animate-fadeInSlideUp delay-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart2 className="mr-2" size={24} /> Daily Activity
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={stationData.dailyStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                  labelStyle={{ color: '#333', fontWeight: 'bold' }}
                  itemStyle={{ color: '#666' }}
                />
                <Legend />
                <Line type="monotone" dataKey="charges" stroke="#4CAF50" activeDot={{ r: 8 }} name="Charges" />
                <Line type="monotone" dataKey="revenue" stroke="#2196F3" name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </section>
        </div>

        {/* Schedule Section */}
        <section className="mb-8 p-6 bg-white rounded-xl shadow-md animate-fadeInSlideUp delay-600">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="mr-2" size={24} /> Upcoming Schedule
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Company</th>
                  <th className="py-3 px-4 text-left">Time Slot</th>
                  <th className="py-3 px-4 text-left">Vehicles</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {stationData.schedule.map((slot, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 transition duration-200 hover:bg-gray-100`}>
                    <td className="py-3 px-4">{slot.company}</td>
                    <td className="py-3 px-4">{slot.time}</td>
                    <td className="py-3 px-4">{slot.vehicles}</td>
                    <td className={`py-3 px-4 font-semibold ${
                      slot.status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {slot.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* LLM Insights Section */}
        <section className="p-6 bg-green-50 rounded-xl shadow-md animate-fadeInSlideUp delay-700">
          <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center">
            <BarChart2 className="mr-2" size={24} /> Get AI Insights
          </h2>
          <p className="text-gray-600 mb-4">
            Click the button below to get AI-powered insights on your station's performance based on the current data.
          </p>
          <button
            onClick={() => getLLMInsights(`Analyze the following charging station data:
              Station Name: ${stationData.name}
              Location: ${stationData.location}
              Uptime: ${stationData.uptimePercentage}%
              Total Charges: ${stationData.totalCharges}
              Revenue Last Month: $${stationData.revenueLastMonth}
              Energy Dispensed: ${stationData.energyDispensedKWh} kWh
              Daily Charges & Revenue (last 7 days): ${JSON.stringify(stationData.dailyStats)}
              Upcoming Schedule: ${JSON.stringify(stationData.schedule)}

              Provide a summary of the station's performance, identify any potential trends or areas for improvement, and suggest actionable recommendations for the station owner.
            `)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300 hover:scale-105"
          >
            Get Performance Insights
          </button>
        </section>
      </div>
    </div>
  );
} 