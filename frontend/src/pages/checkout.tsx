import { Link } from "react-router";
import { useState } from "react";

const Checkout = () => {
  const [shipping, setShipping] = useState("bezorgen");
  return (
    <>
      <nav className="fixed py-6 px-28 flex items-center justify-between w-full z-10 bg-white shadow">
        <h1 className="text-3xl font-bold ">CORALYNN</h1>
        <Link to="/">
          <p className="font-light">Ga terug</p>
        </Link>
      </nav>
      <section className="h-screen flex">
        <div className="w-1/2 flex flex-col px-20 py-8 justify-center">
          <h2 className="font-bold text-2xl mb-6">Checkout</h2>
          <form className="space-y-2 flex flex-col justify-start">
            <div>
              <label className="font-medium">
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email adres<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Voer email adres in"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Telefoon nummer
              </label>
              <input
                type="tel"
                placeholder="Voer telefoonnummer in"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            {shipping === "bezorgen" ? (
              <div className="flex gap-2 mt-1">
                <div className="flex-1">
                  <label className="block text-sm font-medium">
                    Stad<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Vul je stad in"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium">
                    Straatnaam<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Vul je straatnaam in"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium">
                    Postcode<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Vul je postcode in"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 text-sm">
                <p className="font-semibold mb-1">Afhalen bij CORALYNN Store</p>
                <p>Schelpstraat 124, Bikinibroek, Stille Oceaan</p>
                <p className="mt-2">
                  Je bestelling wordt gereserveerd en ligt 3 dagen voor je
                  klaar.
                </p>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-blue-500" />
                Ik heb de algemene voorwaarden gelezen en ga hiermee akkoord
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-blue-500" />
                Onthoud gegevens
              </label>
            </div>
          </form>
        </div>

        <div className="w-1/2 bg-[#E3F2FF] flex flex-col px-20 py-8 justify-center">
          <div className="bg-transparent rounded-lg flex flex-col h-full justify-center pt-15">
            <h3 className="font-medium mb-6">Winkelmand controleren</h3>
            <div className="space-y-4 mb-6 overflow-y-auto h-50">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80"
                    alt="Product"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Lorem</div>
                  <div className="text-xs text-gray-500">
                    Lorem product omschrijving text bla bla...
                  </div>
                  <div className="text-xs mt-1">1x</div>
                </div>
                <div className="font-medium pr-4">€--</div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80"
                    alt="Product"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Lorem</div>
                  <div className="text-xs text-gray-500">
                    Lorem product omschrijving text bla bla...
                  </div>
                  <div className="text-xs mt-1">1x</div>
                </div>
                <div className="font-medium pr-4">€--</div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80"
                    alt="Product"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Lorem</div>
                  <div className="text-xs text-gray-500">
                    Lorem product omschrijving text bla bla...
                  </div>
                  <div className="text-xs mt-1">1x</div>
                </div>
                <div className="font-medium pr-4">€--</div>
              </div>
            </div>

            <div className="flex gap-2 mb-4 ">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Kortingscode toevoegen"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-24 bg-white"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 text-sm font-medium px-2 py-1 cursor-pointer hover:underline"
                  style={{ minWidth: "auto" }}
                >
                  Toevoegen
                </button>
              </div>
            </div>

            <div className="space-y-1 text-sm mb-4">
              <div className="flex justify-between">
                <span>Korting</span>
                <span>€--</span>
              </div>
              <div className="flex justify-between">
                <span>Korting</span>
                <span>€--</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Totaal</span>
                <span>€--</span>
              </div>
            </div>
            <button className="w-full bg-[#DECDB7] hover:bg-[#CBB89A] cursor-pointer transition-colors duration-100 text-lg font-medium rounded-lg py-2 mt-2">
              Betaal
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
