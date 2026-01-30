import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface CartPopupProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const CartPopup: React.FC<CartPopupProps> = ({ open, onClose }) => {
  const { items, updateQuantity, removeFromCart, totalItems, subtotal } =
    useCart();

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("#cart-popup")) return;
      onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all ${open ? "visible" : "invisible"}`}
      style={{ background: open ? "rgba(0,0,0,0.30)" : "transparent" }}
    >
      <div
        id="cart-popup"
        className={`fixed top-0 right-0 h-full w-full sm:w-96 md:w-110 bg-white shadow-lg z-50 transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ overflowX: "hidden", touchAction: "pan-y" }}
      >
        {/* Header met terugknop */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-3 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-black">
            Winkelwagen
          </h2>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-6 text-black hover:cursor-pointer"
            onClick={onClose}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
        {/* Cart items */}
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-2 text-black"
          style={{
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
          }}
        >
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Je winkelwagen is leeg
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex mb-6 last:mb-0 text-black items-center"
              >
                <img
                  src={item.imageUrl || "https://via.placeholder.com/200"}
                  alt={item.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover mr-3 sm:mr-4 rounded"
                />
                <div className="flex-1 flex flex-col justify-between text-black min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-2 text-black">
                      <span className="font-semibold text-black text-sm sm:text-base truncate">
                        {item.title}
                      </span>
                      <span className="font-semibold text-black text-sm sm:text-base whitespace-nowrap">
                        € {item.price.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="text-black text-xs sm:text-sm truncate mb-1">
                      {item.description}
                    </div>
                    <div className="text-black text-xs sm:text-sm mb-2">
                      Maat: {item.size}
                    </div>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`aantal-${item.productId}-${item.size}`}
                        className="text-sm text-black"
                      >
                        Aantal:
                      </label>
                      <select
                        id={`aantal-${item.productId}-${item.size}`}
                        className="border rounded px-2 py-1 text-black bg-white"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            parseInt(e.target.value),
                          )
                        }
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.size)
                        }
                        className="ml-2 text-red-500 hover:text-red-700 text-sm"
                      >
                        Verwijder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Footer */}
        <div className="border-t bg-white text-black">
          <div className="px-4 sm:px-6 py-2 text-sm font-bold text-black border-b">
            Gratis verzending!
          </div>
          <div className="flex justify-end items-center px-4 sm:px-6 py-2 text-sm text-black">
            <span className="text-black">Subtotaal</span>
          </div>
          <div className="flex justify-between items-center px-4 sm:px-6 py-2 text-xs text-black">
            <span className="text-black">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
            <span className="text-black">
              €{subtotal.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <div className="px-4 sm:px-6 py-4">
            <Link to="/checkout">
              <button
                className="w-full bg-[#D4B896] text-black font-bold text-lg hover:cursor-pointer rounded py-2 transition hover:bg-[#c9ad87] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={items.length === 0}
              >
                Afrekenen
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
