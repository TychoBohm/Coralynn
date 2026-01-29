import React, { useEffect } from "react";

interface CartPopupProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const CartPopup: React.FC<CartPopupProps> = ({ open, onClose }) => {
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
      className={`fixed inset-0 z-40 transition-all ${open ? "visible" : "invisible"}`}
      style={{ background: open ? "rgba(0,0,0,0.30)" : "transparent" }}
    >
      <div
        id="cart-popup"
        className={`fixed top-0 right-0 h-full w-110 bg-white shadow-lg z-50 transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ overflowX: "hidden", touchAction: "pan-y" }}
      >
        {/* Header met terugknop */}
        <div className="flex items-center justify-between px-6 pt-3 pb-3">
          <h2 className="text-2xl font-bold text-black">Winkelwagen</h2>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="size-6 text-black hover:cursor-pointer"
            onClick={onClose}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
        {/* Cart items */}
        <div
          className="flex-1 overflow-y-auto px-6 py-2 text-black"
          style={{
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex mb-6 last:mb-0 text-black items-center"
            >
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80"
                alt="Product"
                className="w-24 h-24 object-cover mr-4"
              />
              <div className="flex-1 flex flex-col justify-between text-black">
                <div>
                  <div className="flex justify-between items-center text-black">
                    <span className="font-semibold text-black">Lorem</span>
                    <span className="font-semibold text-black">€ 19,99</span>
                  </div>
                  <div className="text-black text-sm truncate mb-2">
                    Lorem product omschrijving text bla bla...
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`aantal-${i}`}
                      className="text-sm text-black"
                    >
                      Aantal:
                    </label>
                    <select
                      id={`aantal-${i}`}
                      className="border rounded px-2 py-1 text-black bg-white"
                    >
                      {[1, 2, 3, 4, 5].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="border-t bg-white text-black">
          <div className="px-6 py-2 text-sm font-bold text-black border-b">
            Gratis verzending!
          </div>
          <div className="flex justify-end items-center px-6 py-2 text-sm text-black">
            <span className="text-black">Subtotaal</span>
          </div>
          <div className="flex justify-between items-center px-6 py-2 text-xs text-black">
            <span className="text-black">*items</span>
            <span className="text-black">€--</span>
          </div>
          <div className="px-6 py-4">
            <button className="w-full bg-[#DECDB7] text-black font-bold text-lg hover:cursor-pointer rounded py-2 transition hover:bg-[#d1c3a7]">
              Afrekenen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
