import Footer from "../components/footer";
import Navbar from "../components/navbar";
import OrderHistory from "../components/orderHistory";
import ProfileSettings from "../components/profileSettings";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [activeComponent, setActiveComponent] =
    useState<string>("profileSettings");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="fixed">
        <Navbar />
      </div>
      <section className="w-full h-screen flex gap-20 pt-35">
        <div className="bg-[#F4F4F4] w-150 h-100 p-5 flex flex-col gap-3">
          <h2 className="text-4xl font-extrabold mb-5">Profiel opties</h2>
          <p
            onClick={() => setActiveComponent("profileSettings")}
            className={
              activeComponent === "profileSettings"
                ? "font-bold hover:cursor-pointer"
                : "hover:cursor-pointer"
            }
          >
            Profiel Settings
          </p>
          <p
            onClick={() => setActiveComponent("orderHistory")}
            className={
              activeComponent === "orderHistory"
                ? "font-bold hover:cursor-pointer"
                : "hover:cursor-pointer"
            }
          >
            Bestel Geschiedenis
          </p>
          <p
            onClick={handleLogout}
            className="hover:cursor-pointer text-red-600 hover:text-red-800 justify-self-end mt-auto"
          >
            Uitloggen
          </p>
        </div>
        <div className="bg-[#F4F4F4] w-full">
          {activeComponent === "orderHistory" ? (
            <OrderHistory />
          ) : activeComponent === "profileSettings" ? (
            <ProfileSettings />
          ) : (
            <div>Profiel informatie of standaard content</div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProfilePage;
