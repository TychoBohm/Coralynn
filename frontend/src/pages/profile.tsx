import Footer from "../components/footer";
import Navbar from "../components/navbar";
import OrderHistory from "../components/orderhistory";
import ProfileSettings from "../components/profilesettings";
import { useState } from "react";

const ProfilePage = () => {
  const [activeComponent, setActiveComponent] =
    useState<string>("profileSettings");
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
