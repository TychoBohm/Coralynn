import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface OrderDetails {
  name: string;
  email: string;
  phone: string;
  shipping: "bezorgen" | "ophalen";
  address?: {
    city: string;
    street: string;
    postalCode: string;
  };
  items: {
    title: string;
    quantity: number;
    price: number;
    size: string;
  }[];
  total: number;
  orderNumber: string;
}

const OrderSuccess = () => {
  const location = useLocation();
  const orderDetails = location.state as OrderDetails | null;

  useEffect(() => {
    // Scroll naar boven bij laden
    window.scrollTo(0, 0);
  }, []);

  // Als er geen order details zijn, toon een foutmelding
  if (!orderDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <h1 className="text-2xl font-bold mb-2">Geen bestelling gevonden</h1>
          <p className="text-gray-500 mb-6">
            Er is geen recente bestelling gevonden.
          </p>
          <Link
            to="/"
            className="bg-[#D4B896] hover:bg-[#C4A57A] text-black font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Terug naar home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="fixed py-4 md:py-6 px-4 md:px-28 flex items-center justify-between w-full z-10 bg-white shadow">
        <h1 className="text-xl md:text-3xl font-bold">CORALYNN</h1>
        <Link to="/">
          <p className="font-light text-sm md:text-base">Terug naar home</p>
        </Link>
      </nav>

      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12">
        {/* Success Icon */}
        <div className="bg-green-100 rounded-full p-6 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-16 h-16 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Bedankt voor je bestelling!
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Je bestelling is succesvol geplaatst
        </p>

        {/* Order Number */}
        <div className="bg-gray-100 rounded-lg px-6 py-3 mb-8">
          <p className="text-sm text-gray-500">Bestelnummer</p>
          <p className="text-xl font-bold font-mono">
            {orderDetails.orderNumber}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-4 border-b pb-2">
            Bestelgegevens
          </h2>

          {/* Customer Info */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Naam</span>
              <span className="font-medium">{orderDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{orderDetails.email}</span>
            </div>
            {orderDetails.phone && (
              <div className="flex justify-between">
                <span className="text-gray-500">Telefoon</span>
                <span className="font-medium">{orderDetails.phone}</span>
              </div>
            )}
          </div>

          {/* Shipping Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            {orderDetails.shipping === "bezorgen" ? (
              <>
                <p className="font-semibold text-sm mb-1">
                  📦 Bezorgen op adres
                </p>
                <p className="text-sm">
                  {orderDetails.address?.street}, {orderDetails.address?.city}
                </p>
                <p className="text-sm">{orderDetails.address?.postalCode}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Verwachte levering:{" "}
                  {new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-sm mb-1">
                  🍍 Ophalen in de winkel
                </p>
                <p className="text-sm">
                  Schelpstraat 124, Bikinibroek, Stille Oceaan
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Je bestelling ligt 3 dagen voor je klaar (tot{" "}
                  {new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                  })}
                  ).
                </p>
              </>
            )}
          </div>

          {/* Items */}
          <h3 className="font-semibold mb-3">Bestelde producten</h3>
          <div className="space-y-3 mb-4">
            {orderDetails.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <div>
                  <span className="font-medium">{item.title}</span>
                  <span className="text-gray-500 ml-2">
                    (Maat: {item.size})
                  </span>
                  <span className="text-gray-400 ml-2">x{item.quantity}</span>
                </div>
                <span className="font-medium">
                  €{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Totaal betaald</span>
              <span>€{orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Confirmation Email Notice */}
        <div className="text-center text-sm text-gray-500 mb-8">
          <p>Een bevestigingsmail is verstuurd naar</p>
          <p className="font-medium text-gray-700">{orderDetails.email}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="bg-[#D4B896] hover:bg-[#C4A57A] text-black font-medium px-8 py-3 rounded-lg transition-colors text-center"
          >
            Verder winkelen
          </Link>
        </div>
      </section>
    </>
  );
};

export default OrderSuccess;
