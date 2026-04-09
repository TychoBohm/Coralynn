import { useEffect, useState } from "react";
import CartPopup from "./cartpopup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "start" | "collectie" | "contact" | ""
  >("start");
  const location = useLocation();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    let handleScroll: (() => void) | null = null;
    if (location.pathname === "/") {
      handleScroll = () => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight * 0.55;
        const docHeight = document.body.offsetHeight;
        if (scrollY < vh - 10) {
          setActiveSection("start");
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

  // Sluit mobile menu bij route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Voorkom body scroll wanneer menu open is
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleNavClick = (section: "start" | "collectie" | "contact") => {
    setMobileMenuOpen(false);
    if (section === "start") {
      if (location.pathname !== "/") {
        navigate("/");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (section === "collectie") {
      if (location.pathname !== "/") {
        navigate("/", { replace: false });
        setTimeout(() => {
          window.scrollTo({
            top: window.innerHeight * 0.91,
            behavior: "smooth",
          });
        }, 100);
      } else {
        window.scrollTo({ top: window.innerHeight * 0.91, behavior: "smooth" });
      }
    } else if (section === "contact") {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={`hidden md:flex justify-between items-center py-4 px-8 fixed top-0 left-0 w-full z-20 transition-colors duration-500 ${
          location.pathname === "/"
            ? activeSection !== "start"
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
            className={`text-2xl lg:text-3xl font-bold ${slideTitle} transition-transform duration-700`}
          >
            CORALYNN
          </h1>
        </Link>
        <ul
          className={`flex space-x-4 lg:space-x-6 text-base lg:text-lg transition-all duration-700 ${slideMenu}`}
        >
          <li>
            <button
              type="button"
              className={`cursor-pointer ${location.pathname === "/" && activeSection === "start" ? "font-bold underline" : "hover:scale-110 hover:underline"}`}
              onClick={() => handleNavClick("start")}
            >
              Start
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`cursor-pointer ${activeSection === "collectie" ? "font-bold underline" : "hover:scale-110 hover:underline"}`}
              onClick={() => handleNavClick("collectie")}
            >
              Collectie
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`cursor-pointer ${activeSection === "contact" ? "font-bold underline" : "hover:scale-110 hover:underline"}`}
              onClick={() => handleNavClick("contact")}
            >
              Contact
            </button>
          </li>
        </ul>
        <ul
          className={`flex space-x-6 lg:space-x-8 transition-all duration-700 ${slideIcons}`}
        >
          <li>
            <Link to="/profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className={`w-6 h-6 cursor-pointer hover:scale-110 ${location.pathname === "/profile" || location.pathname === "/auth" ? "size-7 text-black fill-black" : ""}`}
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
            <Link to="/wishlist">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className={`w-6 h-6 cursor-pointer hover:scale-110 ${location.pathname === "/wishlist" ? "size-7 text-black fill-black" : ""}`}
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
                className={`w-6 h-6 cursor-pointer hover:scale-110 ${cartOpen ? "size-7 text-black fill-black" : ""}`}
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

      {/* Mobile Navbar */}
      <div
        className={`md:hidden flex justify-between items-center py-4 px-4 fixed top-0 left-0 w-full z-20 transition-colors duration-500 ${
          mobileMenuOpen
            ? "bg-white text-black"
            : location.pathname === "/"
              ? activeSection !== "start"
                ? "bg-white text-black shadow"
                : "bg-transparent text-white"
              : "bg-white text-black shadow"
        }`}
      >
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          <h1 className="text-2xl font-bold">Coralynn</h1>
        </Link>

        {/* Cart and Hamburger buttons */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button
            type="button"
            aria-label="Winkelwagen openen"
            onClick={() => setCartOpen(true)}
            className="p-2 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>

          {/* Hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 cursor-pointer"
            aria-label="Menu openen"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-10 transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header met titel en sluit knop */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold">Coralynn</h2>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 cursor-pointer"
              aria-label="Menu sluiten"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <hr className="text-gray-200" />
          {/* User Info */}
          <div className="p-4">
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <p className="font-semibold text-gray-800">
                  Welkom: {user.name || user.email.split("@")[0]}
                </p>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-500 text-sm">
                  Lid sinds {formatDate(user.created_at)}
                </p>
              </div>
            ) : (
              <p className="text-gray-600">
                Nog niet ingelogd,{" "}
                <Link
                  to="/auth"
                  className="text-[#C4A484] font-semibold hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </p>
            )}
          </div>
          <hr className="text-gray-300" />
          {/* Navigation Links */}
          <nav className="p-4">
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("start")}
                  className="text-lg font-semibold cursor-pointer text-gray-800 hover:text-[#C4A484]"
                >
                  Start
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("collectie")}
                  className="text-lg font-semibold cursor-pointer text-gray-800 hover:text-[#C4A484]"
                >
                  Collectie
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick("contact")}
                  className="text-lg font-semibold cursor-pointer text-gray-800 hover:text-[#C4A484]"
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>
          <hr className="text-gray-300" />
          {/* Profiel Links */}
          <nav className="p-4">
            <p className="font-semibold mb-3 text-gray-800">Profiel</p>
            <ul className="space-y-3 ml-4">
              <li>
                <Link
                  to="/profile?section=profileSettings"
                  className="text-gray-700 hover:text-[#C4A484]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profiel Instellingen
                </Link>
              </li>
              <li>
                <Link
                  to="/profile?section=orderHistory"
                  className="text-gray-700 hover:text-[#C4A484]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bestel Geschiedenis
                </Link>
              </li>
              {user?.is_superuser && (
                <li>
                  <Link
                    to="/profile?section=productBeheer"
                    className="text-gray-700 hover:text-[#C4A484]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Product Beheer
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Extra Links */}
          <nav className="p-4 flex-1">
            <ul className="space-y-3">
              <li>
                <Link
                  to="/wishlist"
                  className="text-lg font-semibold text-gray-800 hover:text-[#C4A484]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Favorieten
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCartOpen(true);
                  }}
                  className="text-lg font-semibold cursor-pointer text-gray-800 hover:text-[#C4A484]"
                >
                  Winkelmand
                </button>
              </li>
              {isAuthenticated && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      // Logout via auth context
                      import("../api/api").then(({ removeToken }) => {
                        removeToken();
                        window.location.href = "/";
                      });
                    }}
                    className="text-lg font-semibold cursor-pointer text-red-600 hover:text-red-800"
                  >
                    Uitloggen
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>

      <CartPopup open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
