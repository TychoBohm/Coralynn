import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Card from "../components/productCard";
import { Link, useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist, isLoggedIn } from "../api/api";
import type { Product } from "../api/api";

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // als niet ingelogd, redirect naar login
    if (!isLoggedIn()) {
      navigate("/auth");
      return;
    }

    loadWishlist();
  }, [navigate]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const products = await getWishlist();
      setWishlistProducts(products);
      setError(null);
    } catch (err) {
      setError("Kon wishlist niet laden");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      // verwijder uit lokale state
      setWishlistProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Kon product niet verwijderen uit wishlist:", err);
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
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar />
      </div>
      <section className="min-h-screen px-20">
        <div className="pt-30 flex justify-between">
          <div>
            <h2 className="text-4xl font-extrabold">Jou favorieten</h2>
            <p className="text-2xl font-light mt-2">
              Bewaar hier jou favorieten items
            </p>
          </div>
        </div>

        {loading ? (
          <div className="pt-10 text-center">
            <p className="text-gray-500">Laden...</p>
          </div>
        ) : error ? (
          <div className="pt-10 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="pt-10 text-center">
            <p className="text-gray-500 text-lg">Je wishlist is leeg</p>
            <Link
              to="/"
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              Bekijk onze producten
            </Link>
          </div>
        ) : (
          <div
            className="pt-5 flex gap-8 pb-6 overflow-x-auto flex-nowrap"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {wishlistProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="shrink-0 hover:scale-105 transition-transform z-5 overflow-visible cursor-pointer"
              >
                <Card
                  title={product.title}
                  description={product.description || ""}
                  price={Number(product.price).toFixed(2).replace(".", ",")}
                  imageUrl={getFirstImageUrl(product)}
                  isInWishlist={true}
                  onWishlistToggle={() => handleRemoveFromWishlist(product.id)}
                />
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Wishlist;
