import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { updateUser, createOrder } from "../api/api";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [shipping, setShipping] = useState<"bezorgen" | "ophalen">("bezorgen");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [rememberDetails, setRememberDetails] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vul gegevens in bij laden vanuit account (als ingelogd)
  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email || "");
      setPhone(user.phone_number || "");
      if (user.name) {
        setName(user.name);
      }
      // Vul opgeslagen verzendgegevens in
      if (user.shipping_city) {
        setCity(user.shipping_city);
        setRememberDetails(true);
      }
      if (user.shipping_street) {
        setStreet(user.shipping_street);
      }
      if (user.shipping_postal_code) {
        setPostalCode(user.shipping_postal_code);
      }
    }
  }, [isAuthenticated, user]);

  // Handler voor "onthoud mijn gegevens" checkbox
  const handleRememberDetailsChange = (checked: boolean) => {
    if (checked && !isAuthenticated) {
      // Niet ingelogd? Redirect naar login pagina
      navigate("/auth", { state: { returnTo: "/checkout" } });
      return;
    }
    setRememberDetails(checked);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Naam is verplicht";
    }

    if (!email.trim()) {
      newErrors.email = "Email is verplicht";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ongeldig email adres";
    }

    if (shipping === "bezorgen") {
      if (!city.trim()) {
        newErrors.city = "Stad is verplicht";
      }
      if (!street.trim()) {
        newErrors.street = "Straatnaam is verplicht";
      }
      if (!postalCode.trim()) {
        newErrors.postalCode = "Postcode is verplicht";
      }
    }

    if (!acceptTerms) {
      newErrors.terms = "Je moet akkoord gaan met de voorwaarden";
    }

    if (items.length === 0) {
      newErrors.cart = "Je winkelwagen is leeg";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `COR-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Sla gegevens op in database als checkbox is aangevinkt en gebruiker is ingelogd
    if (rememberDetails && isAuthenticated) {
      try {
        await updateUser({
          shipping_city: city || null,
          shipping_street: street || null,
          shipping_postal_code: postalCode || null,
        });
        await refreshUser();
      } catch (err) {
        console.error("Kon gegevens niet opslaan:", err);
      }
    }

    // Sla bestelling op in database als gebruiker is ingelogd
    let orderNumber = generateOrderNumber();

    if (isAuthenticated) {
      try {
        const orderResponse = await createOrder({
          customer_name: name,
          customer_email: email,
          customer_phone: phone || undefined,
          shipping_method: shipping,
          shipping_city: shipping === "bezorgen" ? city : undefined,
          shipping_street: shipping === "bezorgen" ? street : undefined,
          shipping_postal_code:
            shipping === "bezorgen" ? postalCode : undefined,
          items: items.map((item) => ({
            product_id: item.productId,
            product_title: item.title,
            product_price: item.price,
            product_image_url: item.imageUrl,
            size: item.size,
            quantity: item.quantity,
          })),
        });
        orderNumber = orderResponse.order_number;
      } catch (err) {
        console.error("Kon bestelling niet opslaan:", err);
        // Ga door met lokaal gegenereerd ordernummer
      }
    }

    // Simuleer een korte vertraging (alsof er een betaling wordt verwerkt)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const orderDetails = {
      name,
      email,
      phone,
      shipping,
      address:
        shipping === "bezorgen"
          ? {
              city,
              street,
              postalCode,
            }
          : undefined,
      items: items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        imageUrl: item.imageUrl,
      })),
      total: shipping === "ophalen" ? subtotal : subtotal + 4.95,
      orderNumber,
    };

    // Leeg de winkelwagen
    clearCart();

    // Navigeer naar success pagina met order details
    navigate("/order-success", { state: orderDetails });
  };

  // Als de winkelwagen leeg is
  if (items.length === 0) {
    return (
      <>
        <nav className="fixed py-4 md:py-6 px-4 md:px-28 flex items-center justify-between w-full z-10 bg-white shadow">
          <h1 className="text-xl md:text-3xl font-bold">CORALYNN</h1>
          <Link to="/">
            <p className="font-light text-sm md:text-base">Ga terug</p>
          </Link>
        </nav>
        <section className="min-h-screen flex flex-col items-center justify-center p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-16 h-16 text-gray-300 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <h2 className="text-xl font-bold mb-2">Je winkelwagen is leeg</h2>
          <p className="text-gray-500 mb-6">
            Voeg producten toe om af te rekenen
          </p>
          <Link
            to="/"
            className="bg-[#D4B896] hover:bg-[#C4A57A] text-black font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Bekijk producten
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <nav className="fixed py-4 md:py-6 px-4 md:px-28 flex items-center justify-between w-full z-10 bg-white shadow">
        <h1 className="text-xl md:text-3xl font-bold">CORALYNN</h1>
        <Link to="/">
          <p className="font-light text-sm md:text-base">Ga terug</p>
        </Link>
      </nav>
      <section className="min-h-screen flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex flex-col px-4 md:px-10 lg:px-20 py-8 pt-20 md:pt-24 lg:pt-8 lg:justify-center">
          <h2 className="font-bold text-xl md:text-2xl mb-6">Checkout</h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-2 flex flex-col justify-start"
          >
            <div>
              <label className="font-medium text-sm md:text-base">
                {shipping === "bezorgen" ? (
                  <>
                    Verzendinformatie<span className="text-red-500">*</span>
                  </>
                ) : (
                  <>Ophalen in de winkel</>
                )}
              </label>
              <div className="flex gap-2 mt-1">
                <label
                  htmlFor="shipping-bezorgen"
                  className={`flex items-center gap-2 cursor-pointer border rounded-lg w-1/2 justify-center py-2 transition-colors ${
                    shipping === "bezorgen"
                      ? "border-blue-300 bg-blue-100"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={() => setShipping("bezorgen")}
                >
                  <input
                    id="shipping-bezorgen"
                    type="radio"
                    name="shipping"
                    checked={shipping === "bezorgen"}
                    onChange={() => setShipping("bezorgen")}
                    className="accent-blue-500 hidden"
                  />
                  <span className="select-none">Bezorgen</span>
                </label>
                <label
                  htmlFor="shipping-ophalen"
                  className={`flex items-center gap-2 cursor-pointer border rounded-lg w-1/2 justify-center py-2 transition-colors ${
                    shipping === "ophalen"
                      ? "border-blue-300 bg-blue-100"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={() => setShipping("ophalen")}
                >
                  <input
                    id="shipping-ophalen"
                    type="radio"
                    name="shipping"
                    checked={shipping === "ophalen"}
                    onChange={() => setShipping("ophalen")}
                    className="accent-blue-500 hidden"
                  />
                  <span className="select-none">Ophalen</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Volledige naam<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Voer je naam in"
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email adres<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Voer email adres in"
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Telefoon nummer
              </label>
              <input
                type="tel"
                placeholder="Voer telefoonnummer in"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {shipping === "bezorgen" ? (
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <div className="flex-1">
                  <label className="block text-sm font-medium">
                    Stad<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Vul je stad in"
                    className={`mt-1 w-full border rounded-lg px-3 py-2 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium">
                    Straatnaam<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Vul je straatnaam in"
                    className={`mt-1 w-full border rounded-lg px-3 py-2 ${
                      errors.street ? "border-red-500" : "border-gray-300"
                    }`}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium">
                    Postcode<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Vul je postcode in"
                    className={`mt-1 w-full border rounded-lg px-3 py-2 ${
                      errors.postalCode ? "border-red-500" : "border-gray-300"
                    }`}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 text-sm">
                <p className="font-semibold mb-1">Afhalen bij CORALYNN Store</p>
                <p>Schelpstraat 124, Bikinibroek, Stille Oceaan</p>
                <p className="mt-2">
                  Je bestelling wordt gereserveerd en ligt 3 dagen voor je
                  klaar.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 mt-2">
              <label
                className={`flex items-center gap-2 text-sm ${
                  errors.terms ? "text-red-500" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-blue-500"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                Ik heb de algemene voorwaarden gelezen en ga hiermee akkoord
                <span className="text-red-500">*</span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-xs">{errors.terms}</p>
              )}

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="accent-blue-500"
                  checked={rememberDetails}
                  onChange={(e) =>
                    handleRememberDetailsChange(e.target.checked)
                  }
                />
                Onthoud mijn gegevens voor de volgende keer
                {!isAuthenticated && (
                  <span className="text-xs text-gray-400">
                    (vereist inloggen)
                  </span>
                )}
              </label>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-1/2 bg-[#E3F2FF] flex flex-col px-4 md:px-10 lg:px-20 py-8 justify-center">
          <div className="bg-transparent rounded-lg flex flex-col h-full justify-center lg:pt-15">
            <h3 className="font-medium mb-6">Winkelmand controleren</h3>
            <div className="space-y-4 mb-6 overflow-y-auto max-h-60 lg:h-50">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500">
                      Maat: {item.size}
                    </div>
                    <div className="text-xs mt-1">{item.quantity}x</div>
                  </div>
                  <div className="font-medium pr-4">
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-sm mb-4">
              <div className="flex justify-between">
                <span>Subtotaal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Verzendkosten</span>
                <span>{shipping === "ophalen" ? "Gratis" : "€4.95"}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Verwachte levering</span>
                <span>
                  {new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Totaal</span>
                <span>
                  €
                  {(shipping === "ophalen"
                    ? subtotal
                    : subtotal + 4.95
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {errors.cart && (
              <p className="text-red-500 text-sm mb-4">{errors.cart}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#D4B896] hover:bg-[#C4A57A] cursor-pointer transition-colors duration-100 text-lg font-medium rounded-lg py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verwerken...
                </>
              ) : (
                "Afrekenen"
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
