const Footer = () => {
  return (
    <footer className="bg-[#2c2c2c] text-white flex flex-col md:flex-row justify-around items-start p-6 md:p-10 gap-6 md:gap-8">
      <div className="w-full md:w-1/3 min-w-0">
        <h3 className="font-bold mb-2">Your Linen Treasure</h3>
        <p className="text-sm leading-relaxed">
          Ontdek Coralynn, een zwemkledingmerk dat luxe en comfort samenbrengt
          in hoogwaardige linnen ontwerpen. De collecties zijn geïnspireerd op
          de zee en het gevoel van een verborgen schat aan de kust. Met Coralynn
          draag je niet zomaar zwemkleding, maar jouw persoonlijke linnen schat,
          perfect voor elke zomerse dag.
        </p>
      </div>
      <div className="w-full md:w-1/3 min-w-0">
        <h3 className="font-bold mb-2">Contact ons</h3>
        <p className="text-sm">Email: info@coralynn.com</p>
        <p className="text-sm">Phone: +31 20 123 4567</p>
        <p className="text-sm">Schelpstraat 124, Bikinibroek, Stille Oceaan</p>
      </div>
      <div className="w-full md:w-1/3 min-w-0">
        <h3 className="font-bold mb-2">Informatie</h3>
        <p className="text-sm break-all">
          <a href="https://github.com/TychoBohm/Coralynn">
            https://github.com/TychoBohm/Coralynn
          </a>
        </p>
        <p className="text-sm">Gemaakt door Tycho Böhm</p>
      </div>
    </footer>
  );
};

export default Footer;
