import React from "react";
import HerenWit from "../assets/heren-wit.png";

type CardProps = {
  title: string;
  description: string;
  price: string | number;
  imageUrl?: string;
  colors?: string[];
  isInWishlist?: boolean;
  onWishlistToggle?: () => void;
};

const Card: React.FC<CardProps> = ({
  title,
  description,
  price,
  imageUrl,
  isInWishlist = false,
  onWishlistToggle,
}) => {
  // Gebruik de meegegeven URL of val terug op placeholder
  const imageSrc = imageUrl || HerenWit;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); // voorkomt navigatie als kaart in een link zit
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle();
    }
  };

  return (
    <div className="w-56 sm:w-64 md:w-70 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between">
      <div className="relative">
        <img
          src={imageSrc}
          alt={title}
          className="w-full aspect-square object-cover"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isInWishlist ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`size-7 hover:cursor-pointer hover:scale-110 transition-all ${isInWishlist ? "text-red-500" : "hover:fill-black"}`}
            onClick={handleWishlistClick}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="text-lg font-semibold text-gray-800 leading-tight">
          {title}
        </div>
        <div className="text-md font-light text-gray-500 mb-2 line-clamp-2">
          {description}
        </div>
        <div className="text-base font-bold text-gray-700">€ {price}</div>
      </div>
    </div>
  );
};

export default Card;
