import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { db } from "./firebase"; // Import the Firebase configuration
import { collection, addDoc } from "firebase/firestore"; // Firestore functions

// Import redesigned custom components
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import FormCard from "./components/FormCard/FormCard";
import FireworksCanvas from "./components/FireworksCanvas/FireworksCanvas";

// Import custom design system styles
import "./styles/theme.css";

const App = () => {
  // Theme state - default to dark, check system preference or localStorage
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("kizuna-theme");
    if (savedTheme) return savedTheme;

    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDark ? "dark" : "light";
  });

  // State to trigger celebration fireworks on successful submission
  const [triggerFireworks, setTriggerFireworks] = useState(false);

  // Apply theme class to HTML/Body document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("kizuna-theme", theme);
  }, [theme]);

  // Toggle between dark and light themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Handle saving the form data to Firestore
  const handleFormSubmit = async (formData, score) => {
    const formattedStartTime = formData.startTime
      ? format(formData.startTime, "dd/MM/yyyy HH:mm")
      : "";
    const formattedEndTime = formData.endTime
      ? format(formData.endTime, "dd/MM/yyyy HH:mm")
      : "";

    const userData = {
      ...formData,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      total: score,
    };

    try {
      // Save the form data to Firestore in the "user_data" collection
      await addDoc(collection(db, "user_data"), userData);
      console.log("Form data saved to Firestore successfully:", userData);

      // Trigger the celebratory fireworks!
      setTriggerFireworks((prev) => !prev);
    } catch (error) {
      console.error("Error saving document to Firestore: ", error);
      throw error; // Propagate error back to FormCard for handling loading/error states
    }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Dynamic Background Fireworks Canvas */}
      <FireworksCanvas theme={theme} triggerFireworks={triggerFireworks} />

      {/* Main Content Overlay */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Responsive, theme-aware Navigation Bar */}
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* Atmospheric cinematic introduction */}
        <Hero />

        {/* Interactive, side-by-side dashboard and form inputs */}
        <FormCard onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default App;
