import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Card from "../components/productCard";
import { Link } from "react-router-dom";

const Wishlist = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar />
      </div>
      <section className="h-screen px-20">
        <div className="pt-30 flex justify-between">
          <div>
            <h2 className="text-4xl font-extrabold">Jou favorieten</h2>
            <p className="text-2xl font-light mt-2">
              Bewaar hier jou favorieten items
            </p>
          </div>
          <Link to="/login">
            <p className="font-light text-lg">Bewaar lijst</p>
          </Link>
        </div>
        <div
          className=" pt-5 flex gap-8 pb-6 overflow-x-auto flex-nowrap"
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
  );
};

export default Wishlist;
