import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  addProductImage,
  deleteProductImage,
} from "../api/api";
import type { Product, ProductCreate, ProductUpdate } from "../api/api";

const ProductManagement = () => {
  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state voor nieuw product
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // laad producten
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Kon producten niet laden");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const result = await uploadImage(file);
        // gebruik volledige URL
        const fullUrl = `http://localhost:8000${result.url}`;
        setImageUrls((prev) => [...prev, fullUrl]);
      }
    } catch (err) {
      setError("Upload mislukt");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setImageUrls([]);
    setEditingProduct(null);
    setEditingProductId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (editingProduct) {
        // update bestaand product
        const data: ProductUpdate = {
          title,
          description,
          price: parseFloat(price),
        };
        await updateProduct(editingProduct.id, data);

        // verwijder oude images die niet meer in de lijst staan
        const oldImageUrls = editingProduct.images.map((img) => img.image_url);
        const newImageUrls = imageUrls;

        // verwijder images die niet meer bestaan
        for (const oldImg of editingProduct.images) {
          if (!newImageUrls.includes(oldImg.image_url)) {
            await deleteProductImage(editingProduct.id, oldImg.id);
          }
        }

        // voeg nieuwe images toe
        for (let i = 0; i < newImageUrls.length; i++) {
          if (!oldImageUrls.includes(newImageUrls[i])) {
            await addProductImage(editingProduct.id, newImageUrls[i], i);
          }
        }
      } else {
        // maak nieuw product
        const data: ProductCreate = {
          title,
          description,
          price: parseFloat(price),
          images: imageUrls,
        };
        await createProduct(data);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditingProductId(product.id);
    setTitle(product.title);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setImageUrls(product.images.map((img) => img.image_url));
    setShowForm(false); // sluit nieuw product form
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit product wilt verwijderen?")) return;

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setError("Kon product niet verwijderen");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Laden...</p>
      </div>
    );
  }

  if (!user?.is_superuser) {
    return null;
  }

  return (
    <section className="p-5">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Product Beheer</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
            setEditingProductId(null);
            if (!showForm) {
              setTitle("");
              setDescription("");
              setPrice("");
              setImageUrls([]);
            }
          }}
          className="bg-[#C4A484] text-white px-6 py-2 rounded-lg hover:bg-[#B8956E] transition-colors cursor-pointer"
        >
          {showForm ? "Annuleren" : "Nieuw Product"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Product Form - alleen voor nieuw product */}
      {showForm && !editingProduct && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Nieuw Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Beschrijving
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Prijs (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Afbeeldingen
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full border rounded-lg px-4 py-2"
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-gray-500 mt-1">Uploaden...</p>
              )}
              {imageUrls.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${i + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImageUrls(imageUrls.filter((_, idx) => idx !== i))
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#C4A484] text-white px-6 py-2 rounded-lg hover:bg-[#B8956E] transition-colors cursor-pointer"
            >
              Aanmaken
            </button>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3">Afbeelding</th>
              <th className="text-left px-6 py-3">Titel</th>
              <th className="text-left px-6 py-3">Prijs</th>
              <th className="text-left px-6 py-3">Acties</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <React.Fragment key={product.id}>
                <tr className="border-t">
                  <td className="px-6 py-4">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].image_url}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        Geen
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{product.title}</td>
                  <td className="px-6 py-4">€{product.price}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:underline mr-4 cursor-pointer"
                    >
                      Bewerken
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Verwijderen
                    </button>
                  </td>
                </tr>
                {/* Inline edit form onder dit product */}
                {editingProductId === product.id && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 bg-gray-50">
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-semibold">
                            Product Bewerken
                          </h2>
                          <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            ✕ Sluiten
                          </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Titel
                            </label>
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full border rounded-lg px-4 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Beschrijving
                            </label>
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="w-full border rounded-lg px-4 py-2 h-32"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Prijs (€)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="w-full border rounded-lg px-4 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Afbeeldingen
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="w-full border rounded-lg px-4 py-2"
                              disabled={uploading}
                            />
                            {uploading && (
                              <p className="text-sm text-gray-500 mt-1">
                                Uploaden...
                              </p>
                            )}
                            {imageUrls.length > 0 && (
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {imageUrls.map((url, i) => (
                                  <div key={i} className="relative">
                                    <img
                                      src={url}
                                      alt={`Preview ${i + 1}`}
                                      className="w-20 h-20 object-cover rounded"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setImageUrls(
                                          imageUrls.filter(
                                            (_, idx) => idx !== i,
                                          ),
                                        )
                                      }
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            type="submit"
                            className="bg-[#C4A484] text-white px-6 py-2 rounded-lg hover:bg-[#B8956E] transition-colors cursor-pointer"
                          >
                            Opslaan
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Geen producten gevonden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProductManagement;
