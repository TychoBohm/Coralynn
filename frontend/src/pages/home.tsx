import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Card from "../components/productCard";
import Footer from "../components/footer";
import {
  getProducts,
  getWishlistIds,
  addToWishlist,
  removeFromWishlist,
  isLoggedIn,
} from "../api/api";
import type { Product } from "../api/api";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);

        // haal wishlist op als ingelogd
        if (isLoggedIn()) {
          try {
            const ids = await getWishlistIds();
            setWishlistIds(new Set(ids));
          } catch {
            // niet ingelogd of andere fout, negeren
          }
        }
      } catch (err) {
        console.error("Kon producten niet laden:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWishlistToggle = async (productId: string) => {
    if (!isLoggedIn()) {
      // redirect naar login als niet ingelogd
      window.location.href = "/auth";
      return;
    }

    try {
      if (wishlistIds.has(productId)) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => new Set([...prev, productId]));
      }
    } catch (err) {
      console.error("Kon wishlist niet updaten:", err);
    }
  };

  const getFirstImageUrl = (product: Product): string | undefined => {
    if (product.images && product.images.length > 0) {
      const sorted = [...product.images].sort(
        (a, b) => a.sort_order - b.sort_order,
      );
      const url = sorted[0].image_url;
      // check of URL al volledig is
      if (url.startsWith("http")) {
        return url;
      }
      return `http://localhost:8000${url}`;
    }
    return undefined;
  };

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
                  imageUrl={getFirstImageUrl(product)}
                  isInWishlist={wishlistIds.has(product.id)}
                  onWishlistToggle={() => handleWishlistToggle(product.id)}
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
