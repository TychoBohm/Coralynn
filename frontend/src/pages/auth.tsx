import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Login from "../components/loginForm";
import Register from "../components/registerForm";
import { useState } from "react";

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);
  const handleSwitch = () => setShowLogin((prev) => !prev);
  return (
    <>
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 md:pt-16 px-4">
        {showLogin ? (
          <Login onSwitch={handleSwitch} />
        ) : (
          <Register onSwitch={handleSwitch} />
        )}
      </section>
      <Footer />
    </>
  );
};

export default Auth;
