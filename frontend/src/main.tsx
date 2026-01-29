import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import Header from "./components/header";
import Card from "./components/productCard";
import Footer from "./components/footer";
import { Routes, Route, Link } from "react-router-dom";
import Product from "./pages/product";
import Profile from "./pages/profile";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <section className="h-screen">
                <div className="px-10 pt-10">
                  <h2 className="text-4xl font-extrabold">Onze Collectie</h2>
                  <p className="text-2xl font-light mt-2">
                    Ontdek onze exclusieve linnen zwemkleding
                  </p>
                </div>
                <div
                  className="px-10 flex gap-8 pb-6 pt-6 overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <Link
                    to="/product"
                    className="shrink-0 hover:scale-105 transition-transform z-5 overflow-visible cursor-pointer"
                  >
                    <Card
                      title={"Tijdelijke titel"}
                      description={"Tijdelijke beschrijving"}
                      price={"0,00"}
                    />
                  </Link>
                  <Link
                    to="/product"
                    className="shrink-0 hover:scale-105 transition-transform z-5 overflow-visible cursor-pointer"
                  >
                    <Card
                      title={"Tijdelijke titel"}
                      description={"Tijdelijke beschrijving"}
                      price={"0,00"}
                    />
                  </Link>
                  <Link
                    to="/product"
                    className="shrink-0 hover:scale-105 transition-transform z-5 overflow-visible cursor-pointer"
                  >
                    <Card
                      title={"Tijdelijke titel"}
                      description={"Tijdelijke beschrijving"}
                      price={"0,00"}
                    />
                  </Link>
                  <Link
                    to="/product"
                    className="shrink-0 hover:scale-105 transition-transform z-5 overflow-visible cursor-pointer"
                  >
                    <Card
                      title={"Tijdelijke titel"}
                      description={"Tijdelijke beschrijving"}
                      price={"0,00"}
                    />
                  </Link>
                  <Link
                    to="/product"
                    className="shrink-0 hover:scale-105 transition-transform z-5 overflow-visible cursor-pointer"
                  >
                    <Card
                      title={"Tijdelijke titel"}
                      description={"Tijdelijke beschrijving"}
                      price={"0,00"}
                    />
                  </Link>
                </div>
              </section>
              <Footer />
            </>
          }
        />
        <Route path="/product" element={<Product />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
