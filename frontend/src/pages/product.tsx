import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { getProduct } from "../api/api";
import type { Product as ProductType } from "../api/api";
import { useCart } from "../context/CartContext";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("m");
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error("Kon product niet laden:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full p-4 z-10">
          <Navbar />
        </div>
        <section className="h-screen pt-30 flex items-center justify-center">
          <p className="text-xl">Product laden...</p>
        </section>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full p-4 z-10">
          <Navbar />
        </div>
        <section className="h-screen pt-30 flex items-center justify-center">
          <p className="text-xl">Product niet gevonden</p>
        </section>
      </>
    );
  }

  // sorteer images op sort_order
  const sortedImages = [...product.images].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const mainImage = sortedImages[selectedImage]?.image_url;

  return (
    <>
      <div className="fixed top-0 left-0 w-full p-4 z-10">
        <Navbar />
      </div>
      <section className="min-h-screen pt-24 md:pt-30 flex flex-col lg:flex-row gap-4 md:gap-8 justify-center px-4 md:px-10 lg:px-20 pb-10">
        {/* kleine thumbnails - horizontaal op mobile, verticaal op desktop */}
        <div className="flex lg:flex-col gap-2 md:gap-4 max-w-full lg:max-h-[520px] overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto order-2 lg:order-1">
          {sortedImages.map((img, index) => (
            <img
              key={img.id}
              src={img.image_url}
              alt={`${product.title} ${index + 1}`}
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 lg:w-48 lg:h-48 object-cover cursor-pointer border-2 rounded shrink-0 ${
                selectedImage === index ? "border-black" : "border-transparent"
              }`}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </div>

        {/* grote afbeelding */}
        <div className="order-1 lg:order-2 flex justify-center">
          {mainImage && (
            <img
              src={mainImage}
              alt={product.title}
              className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:w-[520px] aspect-square object-cover rounded"
            />
          )}
        </div>

        {/* product info */}
        <div className="flex flex-col gap-6 lg:justify-evenly lg:mb-25 order-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-medium">{product.title}</h2>
            <p className="max-w-[50ch] text-sm sm:text-base mt-2">
              {product.description || "Geen beschrijving beschikbaar"}
            </p>
            <p className="text-lg font-bold mt-4">
              €{Number(product.price).toFixed(2).replace(".", ",")}
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg sm:text-xl font-medium">Kies je maat</h3>
            <select
              className="border border-gray-300 rounded-md p-2 mt-2 mb-4 w-32"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
              <option value="xl">XL</option>
            </select>
            <button
              className="bg-[#DECDB7] text-white px-6 py-3 rounded-md hover:bg-[#CBB89A] hover:cursor-pointer transition-colors w-full sm:w-auto"
              onClick={() => {
                const imageUrl = sortedImages[0]?.image_url || "";
                addToCart({
                  productId: product.id,
                  title: product.title,
                  description: product.description || "",
                  price: Number(product.price),
                  imageUrl: imageUrl,
                  size: selectedSize.toUpperCase(),
                });
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
              }}
            >
              {addedToCart ? "Toegevoegd!" : "Voeg toe aan winkelwagen"}
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Product;
