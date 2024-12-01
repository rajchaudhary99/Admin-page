import "./App.css";
import Home from "./Pages/Home";


import Login from "./Pages/Login";  // Ensure the file name is correctly cased
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define separate paths for Home and Login */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
       
      </Routes>
    </Router>
  );
}

export default App;
