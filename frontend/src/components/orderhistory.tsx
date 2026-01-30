import HerenWit from "../assets/Heren-Wit.png";

const Bestelgeschiedenis = () => {
  return (
    <div className="p-5 flex flex-col gap-5 h-full">
      <h2 className="text-4xl font-extrabold">Bestel Geschiedenis</h2>
      <div className="overflow-y-auto max-h-full flex flex-col gap-5 pr-2">
        <div className="flex gap-5">
          <img
            src={HerenWit}
            alt="Heren zwembroek wit"
            className="w-40 h-auto"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold">Linnen Heren Zwembroek - Wit</h3>
            <p>Aantal: 1</p>
            <p>Prijs: €--,--</p>
            <p>Besteld op: </p>
            <button className="bg-[#D4B896] text-white px-6 py-2 rounded-md hover:bg-[#c9ad87] hover:cursor-pointer transition-colors">
              Voeg toe aan winkelwagen
            </button>
          </div>
        </div>
        <div className="flex gap-5">
          <img
            src={HerenWit}
            alt="Heren zwembroek wit"
            className="w-40 h-auto"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold">Linnen Heren Zwembroek - Wit</h3>
            <p>Aantal: 1</p>
            <p>Prijs: €--,--</p>
            <p>Besteld op: </p>
            <button className="bg-[#D4B896] text-white px-6 py-2 rounded-md hover:bg-[#c9ad87] hover:cursor-pointer transition-colors">
              Voeg toe aan winkelwagen
            </button>
          </div>
        </div>
        <div className="flex gap-5">
          <img
            src={HerenWit}
            alt="Heren zwembroek wit"
            className="w-40 h-auto"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold">Linnen Heren Zwembroek - Wit</h3>
            <p>Aantal: 1</p>
            <p>Prijs: €--,--</p>
            <p>Besteld op: </p>
            <button className="bg-[#D4B896] text-white px-6 py-2 rounded-md hover:bg-[#c9ad87] hover:cursor-pointer transition-colors">
              Voeg toe aan winkelwagen
            </button>
          </div>
        </div>
        <div className="flex gap-5">
          <img
            src={HerenWit}
            alt="Heren zwembroek wit"
            className="w-40 h-auto"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold">Linnen Heren Zwembroek - Wit</h3>
            <p>Aantal: 1</p>
            <p>Prijs: €--,--</p>
            <p>Besteld op: </p>
            <button className="bg-[#D4B896] text-white px-6 py-2 rounded-md hover:bg-[#c9ad87] hover:cursor-pointer transition-colors">
              Voeg toe aan winkelwagen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bestelgeschiedenis;
