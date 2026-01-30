import coralynnHeader from "../assets/coralynn-header.mp4";

import { useEffect, useState } from "react";
import Navbar from "./navbar";

const Header = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="fixed top-0 left-0 w-full p-4 z-10 text-white">
        <Navbar />
      </div>
      <video
        src={coralynnHeader}
        className="w-full h-screen object-cover z-0 filter brightness-65"
        autoPlay
        muted
      ></video>
      <div className="absolute left-4 right-4 md:left-8 md:right-auto bottom-20 flex gap-2 flex-col">
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white z-1 transition-all duration-700 ${
            show ? "translate-x-0 opacity-100" : "-translate-x-32 opacity-0"
          }`}
        >
          Secrets of the Sea,
          <br /> Worn by You.
        </h2>
        <p
          className={`text-base md:text-lg max-w-[40ch] text-white z-1 transition-all duration-700 delay-200 ${
            show ? "translate-x-0 opacity-100" : "-translate-x-32 opacity-0"
          }`}
        >
          Premium linen swimwear crafted for those who chase waves and wonder.
        </p>
        <button
          className={`bg-white text-black py-2 rounded-md hover:cursor-pointer transition-all ${
            show
              ? "translate-x-0 opacity-100 hover:bg-gray-300 duration-700"
              : "-translate-x-32 opacity-0 delay-300 "
          }`}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight * 0.91,
              behavior: "smooth",
            });
          }}
        >
          Ontdek het nu
        </button>
      </div>
    </div>
  );
};

export default Header;
