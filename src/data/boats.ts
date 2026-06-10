export type Boat = {
  id: string;
  name: string;
  length: string;
  capacity: number;
  priceFrom: number;
  duration: string;
  highlight: string;
  image: string;
  featured?: boolean;
};

export const boats: Boat[] = [
  {
    id: "tiffany-sunseeker-60",
    name: "Tiffany – Sunseeker 60FT",
    length: "60 ft",
    capacity: 13,
    priceFrom: 2400,
    duration: "4 hours",
    highlight: "Sunseeker luxury with room for up to 13 guests on Biscayne Bay.",
    image: "/images/fleet/y1.jpg",
    featured: true,
  },
  {
    id: "nodman-48-fly",
    name: "NODMAN 48 FT FLY",
    length: "48 ft flybridge",
    capacity: 12,
    priceFrom: 1500,
    duration: "4 hours",
    highlight: "Spacious flybridge layout for day charters, sandbar runs, and celebrations.",
    image: "/images/fleet/y2.jpg",
  },
];
