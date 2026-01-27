import Footer from "../components/footer";
import Navbar from "../components/navbar";
import productImage from "../assets/Heren-Wit.png";

const Product = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full p-4 z-10">
        <Navbar />
      </div>
      <section className="h-screen pt-30 flex gap-8 justify-center px-20">
        <div className="flex flex-col gap-4">
          <img
            src={productImage}
            alt="linnen zwembroek wit"
            className="w-50 h-auto"
          />
          <img
            src={productImage}
            alt="linnen zwembroek wit"
            className="w-50 h-auto"
          />
        </div>
        <div>
          <img
            src={productImage}
            alt="linnen zwembroek wit"
            className="w-130 h-auto"
          />
        </div>
        <div className="flex flex-col justify-evenly mb-25">
          <div>
            <h2 className="text-2xl font-medium justify-start">Product</h2>
            <p className="w-[50ch]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              augue ante, vestibulum in nisl at, malesuada laoreet orci. Nullam
              magna tortor, aliquet a sapien sit amet, auctor tempor sapien.
              Integer eget tellus tincidunt, tempus risus pretium, vestibulum
              turpis. Pellentesque
            </p>
            <p className="text-lg font-bold mt-4">€--,--</p>
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
