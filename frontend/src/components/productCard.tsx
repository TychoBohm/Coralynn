import React from "react";
import HerenWit from "../assets/heren-wit.png";

type CardProps = {
  title: string;
  description: string;
  price: string | number;
  imageUrl?: string;
  colors?: string[];
};

const Card: React.FC<CardProps> = ({ title, description, price, imageUrl }) => {
  // Gebruik de meegegeven URL of val terug op placeholder
  const imageSrc = imageUrl || HerenWit;
  return (
    <div className="w-70  bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between">
      <div className="relative">
        <img
          src={imageSrc}
          alt={title}
          className="w-full aspect-square object-cover"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-7 hover:cursor-pointer hover:scale-110 transition-all hover:fill-black"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-7 hover:cursor-pointer hover:scale-110 transition-all hover:fill-black"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
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
