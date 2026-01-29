import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { getProduct } from "../api/api";
import type { Product as ProductType } from "../api/api";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

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
      <section className="h-screen pt-30 flex gap-8 justify-center px-20">
        {/* kleine thumbnails links */}
        <div className="flex flex-col gap-4 max-h-[520px] overflow-y-auto">
          {sortedImages.map((img, index) => (
            <img
              key={img.id}
              src={img.image_url}
              alt={`${product.title} ${index + 1}`}
              className={`w-48 h-48 object-cover cursor-pointer border-2 rounded shrink-0 ${
                selectedImage === index ? "border-black" : "border-transparent"
              }`}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </div>

        {/* grote afbeelding */}
        <div>
          {mainImage && (
            <img
              src={mainImage}
              alt={product.title}
              className="w-130 h-130 object-cover rounded"
            />
          )}
        </div>

        {/* product info */}
        <div className="flex flex-col justify-evenly mb-25">
          <div>
            <h2 className="text-2xl font-medium justify-start">
              {product.title}
            </h2>
            <p className="w-[50ch]">
              {product.description || "Geen beschrijving beschikbaar"}
            </p>
            <p className="text-lg font-bold mt-4">€{product.price}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-medium mt-4">Kies je maat</h3>
            <select className="border border-gray-300 rounded-md p-2 mt-2 mb-4 w-32">
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
              <option value="xl">XL</option>
            </select>
            <button className="bg-[#DECDB7] text-white px-6 py-3 rounded-md hover:bg-[#CBB89A] hover:cursor-pointer transition-colors">
              Voeg toe aan winkelwagen
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Product;
