import { useEffect, useState } from "react";
import CartPopup from "./cartpopup";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "home" | "collectie" | "contact" | ""
  >("home");
  const location = useLocation();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    let handleScroll: (() => void) | null = null;
    if (location.pathname === "/") {
      handleScroll = () => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight * 0.55;
        const docHeight = document.body.offsetHeight;
        if (scrollY < vh - 10) {
          setActiveSection("home");
        } else if (scrollY >= vh - 10 && scrollY < 2 * vh - 10) {
          setActiveSection("collectie");
        } else if (
          scrollY >= 2 * vh - 10 ||
          window.innerHeight + scrollY >= docHeight - 10
        ) {
          setActiveSection("contact");
        }
      };
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      clearTimeout(timer);
      if (handleScroll) window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const slideTitle =
    location.pathname === "/"
      ? show
        ? "translate-x-0 opacity-100"
        : "-translate-x-32 opacity-0"
      : "translate-x-0 opacity-100";
  const slideMenu =
    location.pathname === "/"
      ? show
        ? "translate-y-0 opacity-100"
        : "-translate-y-16 opacity-0"
      : "translate-y-0 opacity-100";
  const slideIcons =
    location.pathname === "/"
      ? show
        ? "translate-x-0 opacity-100"
        : "translate-x-32 opacity-0"
      : "translate-x-0 opacity-100";

  return (
    <>
      <div
        className={`flex justify-between items-center py-4 px-8 fixed top-0 left-0 w-full z-20 transition-colors duration-500 ${
          location.pathname === "/"
            ? activeSection !== "home"
              ? "bg-white text-black shadow"
              : "bg-transparent text-white"
            : "bg-white text-black shadow"
        }`}
      >
        <Link
          to="/"
          className={`${slideTitle} transition-opacity duration-700`}
        >
          <h1
            className={`text-3xl font-bold ${slideTitle} transition-transform duration-700`}
          >
            CORALYNN
          </h1>
        </Link>
        <ul
          className={`flex space-x-6 text-lg transition-all duration-700 ${slideMenu}`}
        >
          <li>
            <Link to="/">
              <button
                type="button"
                className={`cursor-pointer ${location.pathname === "/" && activeSection === "home" ? "font-bold underline" : "hover:scale-110 hover:underline"}`}
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Home
              </button>
            </Link>
          </li>
          <li>
            <button
              type="button"
              className={`cursor-pointer ${activeSection === "collectie" ? "font-bold underline" : "hover:scale-110 hover:underline"}`}
              onClick={() => {
                if (location.pathname !== "/") {
                  navigate("/", { replace: false });
                  setTimeout(() => {
                    window.scrollTo({
                      top: window.innerHeight * 0.91,
                      behavior: "smooth",
                    });
                  }, 100);
                } else {
                  window.scrollTo({
                    top: window.innerHeight * 0.91,
                    behavior: "smooth",
                  });
                }
              }}
            >
              Collectie
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`cursor-pointer ${activeSection === "contact" ? "font-bold underline" : "hover:scale-110 hover:underline"}`}
              onClick={() => {
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }}
            >
              Contact
            </button>
          </li>
        </ul>
        <ul
          className={`flex space-x-8 transition-all duration-700  ${slideIcons}`}
        >
          <li>
            <Link
              to="/profile"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className={`w-6 h-6 cursor-pointer hover:scale-110 hover:fill-white ${location.pathname === "/profile" ? "size-7 text-black fill-black" : ""}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </Link>
          </li>
          <li>
            <Link
              to="/wishlist"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className={`w-6 h-6 cursor-pointer hover:scale-110 hover:fill-white ${location.pathname === "/wishlist" ? "size-7 text-black fill-black" : ""}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </Link>
          </li>
          <li>
            <button
              type="button"
              aria-label="Winkelwagen openen"
              onClick={() => setCartOpen(true)}
              className="bg-transparent border-none p-0 m-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className={`w-6 h-6 cursor-pointer hover:scale-110  hover:fill-white ${cartOpen ? "size-7 text-black fill-black" : ""}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </button>
          </li>
        </ul>
      </div>
      <CartPopup open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
