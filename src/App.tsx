import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MintPage } from "./pages/mint";
import Profile from "./pages/profile";
import { Header } from "./component/header";

function App() {
  return (
    <>
      <Header />
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/mint" element={<MintPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        className="toastClassName"
      />
    </>
  );
}

export default App;
