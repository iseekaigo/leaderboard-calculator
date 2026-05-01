import React, { Suspense } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import CalculatorPage from "./pages/CalculatorPage/CalculatorPage";
import "./App.css";

const FireworksCanvas = React.lazy(
  () => import("./components/effects/FireworksCanvas/FireworksCanvas"),
);

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Suspense fallback={null}>
          <FireworksCanvas />
        </Suspense>
        <CalculatorPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
