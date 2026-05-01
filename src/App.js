import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInMinutes } from "date-fns";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { Label } from "./components/ui/Label";
import { Button } from "./components/ui/Button";
import { Select } from "./components/ui/Select";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import Fireworks from "./components/background/Fireworks";
import {
  Sparkles,
  Calculator,
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  User,
  Camera,
  Mail,
  Video,
} from "lucide-react";

const App = () => {
  const [score, setScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    tiktok: "",
    Camera: "",
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
      specialStatus,
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
    setIsSubmitting(true);

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
      await addDoc(collection(db, "user_data"), userData);
      setScore(total);
      // Optional: scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error saving document: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      <Fireworks />
      <ThemeToggle />

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl animate-slide-up">
          <Card className="glass-panel border-t-white/40 dark:border-t-white/10">
            <CardHeader className="text-center pb-8 border-b border-white/10 dark:border-slate-800/50">
              <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-4 shadow-inner ring-1 ring-white/20 dark:ring-white/5">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                Score Calculator
              </CardTitle>
              <p className="text-muted-foreground mt-2 font-medium">
                Calculate your ultimate affinity score
              </p>
            </CardHeader>

            <CardContent className="pt-8">
              {score !== null && (
                <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex flex-col items-center justify-center animate-fade-in shadow-lg">
                  <Sparkles className="w-8 h-8 text-primary mb-2 animate-pulse" />
                  <p className="text-sm font-semibold text-primary/80 uppercase tracking-widest mb-1">
                    Total Score
                  </p>
                  <p className="text-5xl font-display font-bold text-primary drop-shadow-sm">
                    {score.toLocaleString()}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tiktok" className="flex items-center gap-2">
                      <Video className="w-4 h-4" /> TikTok
                    </Label>
                    <Input
                      id="tiktok"
                      type="text"
                      name="tiktok"
                      value={formData.tiktok}
                      onChange={handleChange}
                      placeholder="@username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Camera" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" /> Camera
                    </Label>
                    <Input
                      id="Camera"
                      type="text"
                      name="Camera"
                      value={formData.Camera}
                      onChange={handleChange}
                      placeholder="@username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gmail" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Gmail
                    </Label>
                    <Input
                      id="gmail"
                      type="email"
                      name="gmail"
                      value={formData.gmail}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Time Tracking */}
                  <div className="space-y-2 flex flex-col">
                    <Label
                      htmlFor="startTime"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" /> Start Time
                    </Label>
                    <DatePicker
                      id="startTime"
                      selected={formData.startTime}
                      onChange={(date) => handleDateChange("startTime", date)}
                      showTimeSelect
                      dateFormat="dd/MM/yyyy HH:mm"
                      timeFormat="HH:mm"
                      timeIntervals={1}
                      placeholderText="Select start time"
                      className="flex h-10 w-full rounded-md border border-input bg-white/50 dark:bg-slate-950/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <Label
                      htmlFor="endTime"
                      className="flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" /> End Time
                    </Label>
                    <DatePicker
                      id="endTime"
                      selected={formData.endTime}
                      onChange={(date) => handleDateChange("endTime", date)}
                      showTimeSelect
                      dateFormat="dd/MM/yyyy HH:mm"
                      timeFormat="HH:mm"
                      timeIntervals={1}
                      placeholderText="Select end time"
                      className="flex h-10 w-full rounded-md border border-input bg-white/50 dark:bg-slate-950/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>

                  {/* Metrics */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="affectionLevel"
                      className="flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" /> Affection Level
                    </Label>
                    <Input
                      id="affectionLevel"
                      type="number"
                      name="affectionLevel"
                      value={formData.affectionLevel}
                      onChange={handleChange}
                      placeholder="0-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="specialStatus"
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> Special Status
                    </Label>
                    <Select
                      id="specialStatus"
                      name="specialStatus"
                      value={formData.specialStatus}
                      onChange={handleChange}
                    >
                      <option value="none">None</option>
                      <option value="girlfriend">Girlfriend</option>
                      <option value="spouse">Spouse</option>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="promptUsage"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> Chat Usage
                    </Label>
                    <Input
                      id="promptUsage"
                      type="number"
                      name="promptUsage"
                      value={formData.promptUsage}
                      onChange={handleChange}
                      placeholder="Number of messages"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold tracking-wide"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Calculating...
                      </span>
                    ) : (
                      "Calculate Score"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default App;
