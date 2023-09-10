import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Confirmation from "./components/Confirmation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="confirmation" element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
