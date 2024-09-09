import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MintPage } from "./pages/mint";
import Profile from "./pages/profile";
import { Header } from "./component/header";
import { Layout } from "./component/layout";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/mint" element={<MintPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/*" element={<MintPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
