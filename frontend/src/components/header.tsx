import coralynnHeader from "../assets/coralynn-header.mp4";

import Navbar from "./navbar";

const Header = () => {
  return (
    <div>
      <div className="absolute top-0 left-0 w-full p-4 z-10 text-white fixed">
        <Navbar />
      </div>
      <video
        src={coralynnHeader}
        className="w-full h-screen object-cover z-0 filter brightness-65"
        autoPlay
        muted
      ></video>
      <div className="absolute left-10 bottom-20 flex gap-2 flex-col">
        <h2 className="text-5xl font-bold text-white z-10">
          Secrets of the Sea,
          <br /> Worn by You.
        </h2>
        <p className="text-lg w-[40ch] text-white z-10">
          Premium linen swimwear crafted for those who chase waves and wonder.
        </p>
      </div>
    </div>
  );
};

export default Header;
