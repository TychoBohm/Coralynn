import Footer from "../components/footer";
import Navbar from "../components/navbar";
import BestelGeschiedenis from "../components/bestelgeschiedenis";
import Profielsettings from "../components/profielsettings";
import { useState } from "react";

const Profile = () => {
  const [activeComponent, setActiveComponent] =
    useState<string>("profielsettings");
  return (
    <>
      <Navbar />
      <section className="w-full h-screen flex gap-20 pt-10">
        <div className="bg-[#F4F4F4] w-150 h-100 p-5 flex flex-col gap-3">
          <h2 className="text-4xl font-extrabold mb-5">Profiel opties</h2>
          <p
            onClick={() => setActiveComponent("profielsettings")}
            className={
              activeComponent === "profielsettings"
                ? "font-bold hover:cursor-pointer"
                : "hover:cursor-pointer"
            }
          >
            Profiel Settings
          </p>
          <p
            onClick={() => setActiveComponent("bestelgeschiedenis")}
            className={
              activeComponent === "bestelgeschiedenis"
                ? "font-bold hover:cursor-pointer"
                : "hover:cursor-pointer"
            }
          >
            Bestel Geschiedenis
          </p>
        </div>
        <div className="bg-[#F4F4F4] w-full">
          {activeComponent === "bestelgeschiedenis" ? (
            <BestelGeschiedenis />
          ) : activeComponent === "profielsettings" ? (
            <Profielsettings />
          ) : (
            <div>Profiel informatie of standaard content</div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Profile;
