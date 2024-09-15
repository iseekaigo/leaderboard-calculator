import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInMinutes } from "date-fns";
import { db } from "./firebase"; // Import the Firebase configuration from your firebase.js
import { collection, addDoc } from "firebase/firestore"; // Firestore functions

const App = () => {
  const [score, setScore] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    tiktok: "",
    instagram: "",
    gmail: "",
    startTime: null,
    endTime: null,
    affectionLevel: "",
    specialStatus: "none",
    promptUsage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: date,
    }));
  };

  const calculateTotal = () => {
    const { affectionLevel, specialStatus, promptUsage, startTime, endTime } =
      formData;

    const affectionLevelNumber = parseInt(affectionLevel, 10) || 0;
    const promptUsageNumber = parseInt(promptUsage, 10) || 0;
    const timeDifference =
      startTime && endTime ? differenceInMinutes(endTime, startTime) : 0;
    const specialStatusIndex = ["none", "girlfriend", "spouse"].indexOf(
      specialStatus
    );

    const total =
      affectionLevelNumber * 200 +
      specialStatusIndex * 10000 -
      promptUsageNumber * 25 -
      timeDifference * 50;

    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedStartTime = formData.startTime
      ? format(formData.startTime, "dd/MM/yyyy HH:mm")
      : "";
    const formattedEndTime = formData.endTime
      ? format(formData.endTime, "dd/MM/yyyy HH:mm")
      : "";

    const total = calculateTotal();

    const userData = {
      ...formData,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      total,
    };

    try {
      // Save the form data to Firestore in the "user_data" collection
      await addDoc(collection(db, "user_data"), userData);
      console.log("Form data saved to Firestore:", userData);
      setScore(total);
    } catch (error) {
      console.error("Error saving document: ", error);
    }
  };

  return (
    <div style={{ margin: "50px", maxWidth: "500px", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>SCORE CALCULATOR</h2>
      <h2 style={{ textAlign: "center" }}>TOTAL: {score}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>TikTok:</label>
          <input
            type="text"
            name="tiktok"
            value={formData.tiktok}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Instagram:</label>
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Gmail:</label>
          <input
            type="email"
            name="gmail"
            value={formData.gmail}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Start Time (dd/mm/yy hh:mm):</label>
          <DatePicker
            selected={formData.startTime}
            onChange={(date) => handleDateChange("startTime", date)}
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            timeFormat="HH:mm"
            timeIntervals={1}
            placeholderText="Select start time"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>End Time (dd/mm/yy hh:mm):</label>
          <DatePicker
            selected={formData.endTime}
            onChange={(date) => handleDateChange("endTime", date)}
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            timeFormat="HH:mm"
            timeIntervals={1}
            placeholderText="Select end time"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Affection Level:</label>
          <input
            type="text"
            name="affectionLevel"
            value={formData.affectionLevel}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Special Status:</label>
          <select
            name="specialStatus"
            value={formData.specialStatus}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          >
            <option value="none">None</option>
            <option value="girlfriend">Girlfriend</option>
            <option value="spouse">Spouse</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Chat Usage:</label>
          <input
            type="text"
            name="promptUsage"
            value={formData.promptUsage}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;
