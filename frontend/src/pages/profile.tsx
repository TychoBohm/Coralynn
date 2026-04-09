import {
  Footer,
  Navbar,
  OrderHistory,
  ProfileSettings,
  ProductManagement,
} from "../components";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const [activeComponent, setActiveComponent] =
    useState<string>("profileSettings");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Lees section uit URL query param
  useEffect(() => {
    const section = searchParams.get("section");
    if (
      section &&
      ["profileSettings", "orderHistory", "productBeheer"].includes(section)
    ) {
      setActiveComponent(section);
    }
  }, [searchParams]);

  const handleMenuClick = (component: string) => {
    setActiveComponent(component);
    navigate(`/profile?section=${component}`, { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="fixed z-10 w-full">
        <Navbar />
      </div>
      <section className="w-full min-h-screen flex flex-col md:flex-row gap-4 md:gap-10 lg:gap-20 pt-20 md:pt-35 pb-10 px-4 md:px-8">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <div className="hidden md:flex md:bg-[#F4F4F4] md:w-64 lg:w-80 xl:w-96 h-fit p-5 flex-col gap-3 md:sticky md:top-35">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-5">
            Profiel opties
          </h2>
          <p
            onClick={() => handleMenuClick("profileSettings")}
            className={
              activeComponent === "profileSettings"
                ? "font-bold hover:cursor-pointer"
                : "hover:cursor-pointer"
            }
          >
            Profiel Settings
          </p>
          <p
            onClick={() => handleMenuClick("orderHistory")}
            className={
              activeComponent === "orderHistory"
                ? "font-bold hover:cursor-pointer"
                : "hover:cursor-pointer"
            }
          >
            Bestel Geschiedenis
          </p>
          {user?.is_superuser && (
            <p
              onClick={() => handleMenuClick("productBeheer")}
              className={
                activeComponent === "productBeheer"
                  ? "font-bold hover:cursor-pointer"
                  : "hover:cursor-pointer"
              }
            >
              Product Beheer
            </p>
          )}
          <p
            onClick={handleLogout}
            className="hover:cursor-pointer text-red-600 hover:text-red-800 mt-4"
          >
            Uitloggen
          </p>
        </div>

        {/* Content area */}
        <div className="w-full min-h-[60vh] md:bg-[#F4F4F4]">
          {activeComponent === "orderHistory" ? (
            <OrderHistory />
          ) : activeComponent === "profileSettings" ? (
            <ProfileSettings />
          ) : activeComponent === "productBeheer" && user?.is_superuser ? (
            <ProductManagement />
          ) : (
            <div className="p-4">Profiel informatie of standaard content</div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProfilePage;
