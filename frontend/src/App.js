import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PenguinClimber from "./components/PenguinClimber";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PenguinClimber />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;