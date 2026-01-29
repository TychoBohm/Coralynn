import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Card from "../components/productCard";
import Footer from "../components/footer";
import { getProducts } from "../api/api";
import type { Product } from "../api/api";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Kon producten niet laden:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <section className="px-8 h-screen">
        <div className="pt-10">
          <h2 className="text-4xl font-extrabold">Onze Collectie</h2>
          <p className="text-2xl font-light mt-2">
            Ontdek onze exclusieve linnen zwemkleding
          </p>
        </div>
        <div
          className="flex gap-8 pb-6 pt-6 overflow-x-auto flex-nowrap"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {loading ? (
            <p className="text-gray-500">Producten laden...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">Geen producten gevonden</p>
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="shrink-0 hover:scale-105 transition-transform z-5 overflow-visible cursor-pointer"
              >
                <Card
                  title={product.title}
                  description={product.description || ""}
                  price={product.price}
                  imageUrl={product.images[0]?.image_url}
                />
              </Link>
            ))
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
