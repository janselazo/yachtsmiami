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
    id: "sea-ray-40",
    name: "40' Sea Ray Sundancer",
    length: "40 ft",
    capacity: 10,
    priceFrom: 850,
    duration: "4 hours",
    highlight: "Perfect for intimate groups and skyline cruises.",
    image: "/video/Y1.png",
  },
  {
    id: "pink-yacht-52",
    name: "52' Pink Signature Yacht",
    length: "52 ft",
    capacity: 13,
    priceFrom: 1500,
    duration: "4 hours",
    highlight: "Our iconic pink yacht — luxury, style, and party-ready vibes.",
    image: "/video/Y2-hq.jpg",
    featured: true,
  },
  {
    id: "azimut-55",
    name: "55' Azimut Flybridge",
    length: "55 ft",
    capacity: 13,
    priceFrom: 1900,
    duration: "4 hours",
    highlight: "Spacious flybridge for premium day charters and events.",
    image: "/video/Y3.png",
  },
  {
    id: "sunseeker-70",
    name: "70' Sunseeker Manhattan",
    length: "70 ft",
    capacity: 13,
    priceFrom: 2900,
    duration: "4 hours",
    highlight: "Statement luxury for VIP groups and milestone celebrations.",
    image: "/video/Y1.png",
  },
  {
    id: "prestige-60",
    name: "60' Prestige",
    length: "60 ft",
    capacity: 13,
    priceFrom: 2400,
    duration: "4 hours",
    highlight: "Modern lines, open deck space, and a polished onboard experience.",
    image: "/video/Y2-hq.jpg",
  },
  {
    id: "numarine-80",
    name: "80' Numarine",
    length: "80 ft",
    capacity: 13,
    priceFrom: 5000,
    duration: "4 hours",
    highlight: "The ultimate Miami charter for large groups and grand occasions.",
    image: "/video/Y3.png",
  },
];
