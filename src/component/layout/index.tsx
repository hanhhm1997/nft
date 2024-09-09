import { Outlet } from "react-router";
import { Header } from "../header";
import { ToastContainer } from "react-toastify";

export const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        className="toastClassName"
      />
    </>
  );
};
