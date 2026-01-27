import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import Header from "./components/header";
import Card from "./components/card";
import Footer from "./components/footer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <section className="h-screen ">
        <div className="p-10">
          <h2 className="text-4xl font-extrabold">Onze Collectie</h2>
          <p className="text-2xl font-light mt-2">
            Ontdek onze exclusieve linnen zwemkleding
          </p>
        </div>
        <div
          className="px-10 flex gap-8 pb-10 overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="shrink-0">
            <Card
              title={"Tijdelijke titel"}
              description={"Tijdelijke beschrijving"}
              price={"0,00"}
            />
          </div>
          <div className="shrink-0">
            <Card
              title={"Tijdelijke titel"}
              description={"Tijdelijke beschrijving"}
              price={"0,00"}
            />
          </div>
          <div className="shrink-0">
            <Card
              title={"Tijdelijke titel"}
              description={"Tijdelijke beschrijving"}
              price={"0,00"}
            />
          </div>
          <div className="shrink-0">
            <Card
              title={"Tijdelijke titel"}
              description={"Tijdelijke beschrijving"}
              price={"0,00"}
            />
          </div>
          <div className="shrink-0">
            <Card
              title={"Tijdelijke titel"}
              description={"Tijdelijke beschrijving"}
              price={"0,00"}
            />
          </div>
        </div>
      </section>
      <Footer />
    </BrowserRouter>
  </StrictMode>,
);
