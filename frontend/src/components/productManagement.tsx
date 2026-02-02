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
  reorderProducts,
  reorderProductImages,
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
  const [imageIds, setImageIds] = useState<string[]>([]); // voor bestaande images
  const [uploading, setUploading] = useState(false);

  // drag state voor producten
  const [draggedProductIndex, setDraggedProductIndex] = useState<number | null>(
    null,
  );
  const [dragOverProductIndex, setDragOverProductIndex] = useState<
    number | null
  >(null);

  // drag state voor images
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null,
  );
  const [dragOverImageIndex, setDragOverImageIndex] = useState<number | null>(
    null,
  );

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
        setImageIds((prev) => [...prev, ""]); // lege id voor nieuwe images
      }
    } catch (err) {
      setError("Upload mislukt");
    } finally {
      setUploading(false);
    }
  };

  // Product drag handlers
  const handleProductDragStart = (index: number) => {
    setDraggedProductIndex(index);
  };

  const handleProductDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverProductIndex(index);
  };

  const handleProductDragEnd = async () => {
    if (
      draggedProductIndex === null ||
      dragOverProductIndex === null ||
      draggedProductIndex === dragOverProductIndex
    ) {
      setDraggedProductIndex(null);
      setDragOverProductIndex(null);
      return;
    }

    const newProducts = [...products];
    const [draggedItem] = newProducts.splice(draggedProductIndex, 1);
    newProducts.splice(dragOverProductIndex, 0, draggedItem);
    setProducts(newProducts);

    // Sla nieuwe volgorde op in backend
    try {
      await reorderProducts(newProducts.map((p) => p.id));
    } catch (err) {
      setError("Kon volgorde niet opslaan");
      fetchProducts(); // herstel originele volgorde
    }

    setDraggedProductIndex(null);
    setDragOverProductIndex(null);
  };

  // Image drag handlers
  const handleImageDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverImageIndex(index);
  };

  const handleImageDragEnd = async () => {
    if (
      draggedImageIndex === null ||
      dragOverImageIndex === null ||
      draggedImageIndex === dragOverImageIndex
    ) {
      setDraggedImageIndex(null);
      setDragOverImageIndex(null);
      return;
    }

    const newUrls = [...imageUrls];
    const newIds = [...imageIds];
    const [draggedUrl] = newUrls.splice(draggedImageIndex, 1);
    const [draggedId] = newIds.splice(draggedImageIndex, 1);
    newUrls.splice(dragOverImageIndex, 0, draggedUrl);
    newIds.splice(dragOverImageIndex, 0, draggedId);
    setImageUrls(newUrls);
    setImageIds(newIds);

    // Sla nieuwe volgorde op als we een bestaand product bewerken
    if (editingProduct) {
      const validIds = newIds.filter((id) => id !== "");
      if (validIds.length > 0) {
        try {
          await reorderProductImages(editingProduct.id, validIds);
        } catch (err) {
          console.error("Kon afbeelding volgorde niet opslaan:", err);
        }
      }
    }

    setDraggedImageIndex(null);
    setDragOverImageIndex(null);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setImageUrls([]);
    setImageIds([]);
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
    setImageIds(product.images.map((img) => img.id));
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
    <section className="p-4 md:p-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Product Beheer</h2>
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
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Nieuw Product
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 border-gray-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 border-gray-300">
                Beschrijving
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 h-32 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 border-gray-300">
                Prijs (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 border-gray-300">
                Afbeeldingen
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full border rounded-lg px-4 py-2 border-gray-300"
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-gray-500 mt-1">Uploaden...</p>
              )}
              {imageUrls.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {imageUrls.map((url, i) => (
                    <div
                      key={i}
                      draggable
                      onDragStart={() => handleImageDragStart(i)}
                      onDragOver={(e) => handleImageDragOver(e, i)}
                      onDragEnd={handleImageDragEnd}
                      className={`relative cursor-grab active:cursor-grabbing group ${
                        draggedImageIndex === i ? "opacity-50" : ""
                      } ${dragOverImageIndex === i && draggedImageIndex !== i ? "ring-2 ring-[#D4B896] rounded" : ""}`}
                    >
                      {/* Drag indicator */}
                      <div className="absolute top-1 left-1 bg-black/50 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="white"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                          />
                        </svg>
                      </div>
                      <img
                        src={url}
                        alt={`Preview ${i + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrls(imageUrls.filter((_, idx) => idx !== i));
                          setImageIds(imageIds.filter((_, idx) => idx !== i));
                        }}
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
      <div className="flex flex-col gap-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            draggable
            onDragStart={() => handleProductDragStart(index)}
            onDragOver={(e) => handleProductDragOver(e, index)}
            onDragEnd={handleProductDragEnd}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
              draggedProductIndex === index ? "opacity-50" : ""
            } ${dragOverProductIndex === index && draggedProductIndex !== index ? "border-2 border-[#D4B896]" : ""}`}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Drag Handle */}
              <div className="hidden sm:flex items-center justify-center w-10 bg-gray-50 cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </div>

              {/* Product Image */}
              <div className="relative w-full h-48 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-gray-100 shrink-0">
                {product.images[0] ? (
                  <img
                    src={product.images[0].image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-12 h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-2">
                    <h3 className="font-semibold text-lg md:text-xl text-gray-800">
                      {product.title}
                    </h3>
                    <span className="bg-[#DECDB7] px-3 md:px-4 py-1 rounded-full font-bold text-gray-800 text-sm md:text-base">
                      €{Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-500 line-clamp-2 text-sm md:text-base">
                    {product.description || "Geen beschrijving"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 md:gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-[#D4B896] text-gray-800 py-2 px-4 md:px-6 rounded-lg hover:bg-[#c9ad87] transition-colors cursor-pointer flex items-center gap-2 text-sm md:text-base"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    Bewerken
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-50 text-red-600 py-2 px-3 md:px-4 rounded-lg hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-2 text-sm md:text-base"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    Verwijderen
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Form (slides down when editing) */}
            {editingProductId === product.id && (
              <div className="border-t bg-gray-50 p-4 md:p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-700">Bewerken</h4>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Titel
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4B896]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Beschrijving
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-[#D4B896] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Prijs (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4B896]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Afbeeldingen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#D4B896] file:text-gray-700 hover:file:bg-[#c9ad87] file:cursor-pointer"
                      disabled={uploading}
                    />
                    {uploading && (
                      <p className="text-sm text-gray-500 mt-1">Uploaden...</p>
                    )}
                    {imageUrls.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {imageUrls.map((url, i) => (
                          <div
                            key={i}
                            draggable
                            onDragStart={() => handleImageDragStart(i)}
                            onDragOver={(e) => handleImageDragOver(e, i)}
                            onDragEnd={handleImageDragEnd}
                            className={`relative group cursor-grab active:cursor-grabbing ${
                              draggedImageIndex === i ? "opacity-50" : ""
                            } ${dragOverImageIndex === i && draggedImageIndex !== i ? "ring-2 ring-[#D4B896] rounded-lg" : ""}`}
                          >
                            {/* Drag indicator */}
                            <div className="absolute top-1 left-1 bg-black/50 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="white"
                                className="w-3 h-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                              </svg>
                            </div>
                            <img
                              src={url}
                              alt={`Preview ${i + 1}`}
                              className="w-25 h-25 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImageUrls(
                                  imageUrls.filter((_, idx) => idx !== i),
                                );
                                setImageIds(
                                  imageIds.filter((_, idx) => idx !== i),
                                );
                              }}
                              className="absolute -top-2 -right-2 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2.3"
                                stroke="currentColor"
                                className="size-6 bg-red-500 rounded-full"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18 18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D4B896] text-white py-2 rounded-lg hover:bg-[#c9ad87] transition-colors cursor-pointer font-medium"
                  >
                    Opslaan
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="currentColor"
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          <p className="text-gray-500 text-lg">Nog geen producten</p>
          <p className="text-gray-400 text-sm mt-1">
            Klik op "Nieuw Product" om te beginnen
          </p>
        </div>
      )}
    </section>
  );
};

export default ProductManagement;
