import { useState, useEffect } from "react";
import { getMyOrders, type Order } from "../api/api";
import { useCart } from "../context/CartContext";

const Bestelgeschiedenis = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError("Kon bestellingen niet ophalen");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAddToCart = (item: Order["items"][0]) => {
    addToCart({
      productId: item.product_id || "",
      title: item.product_title,
      description: "",
      price: item.product_price,
      imageUrl: item.product_image_url || "",
      size: item.size || "One Size",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: {
        label: "In behandeling",
        color: "bg-yellow-100 text-yellow-800",
      },
      processing: {
        label: "Wordt verwerkt",
        color: "bg-blue-100 text-blue-800",
      },
      shipped: { label: "Verzonden", color: "bg-purple-100 text-purple-800" },
      delivered: { label: "Bezorgd", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Geannuleerd", color: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  if (loading) {
    return (
      <div className="p-5 flex flex-col gap-5 h-full">
        <h2 className="text-4xl font-extrabold">Bestel Geschiedenis</h2>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4B896]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 flex flex-col gap-5 h-full">
        <h2 className="text-4xl font-extrabold">Bestel Geschiedenis</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-5 flex flex-col gap-5 h-full">
        <h2 className="text-4xl font-extrabold">Bestel Geschiedenis</h2>
        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-12 h-12 mb-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <p>Je hebt nog geen bestellingen geplaatst</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-5 h-full">
      <h2 className="text-4xl font-extrabold">Bestel Geschiedenis</h2>
      <div className="overflow-y-auto max-h-full flex flex-col gap-6 pr-2">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div>
                <p className="font-semibold text-lg">{order.order_number}</p>
                <p className="text-sm text-gray-500">
                  Besteld op {formatDate(order.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusLabel(order.status).color}`}
                >
                  {getStatusLabel(order.status).label}
                </span>
                <span className="font-bold">€{order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product_image_url ? (
                      <img
                        src={item.product_image_url}
                        alt={item.product_title}
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
                          className="w-8 h-8"
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
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {item.product_title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.size && `Maat: ${item.size} • `}
                      Aantal: {item.quantity}
                    </p>
                    <p className="text-sm">€{item.product_price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-[#D4B896] text-white px-4 py-2 rounded-md hover:bg-[#c9ad87] hover:cursor-pointer transition-colors text-sm whitespace-nowrap"
                  >
                    Opnieuw bestellen
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bestelgeschiedenis;
