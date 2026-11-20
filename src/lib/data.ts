// All data in this file is dummy content. Image URLs point at the Zipp Republic
// storefront CDN; swap any `img()` call or add `image` URLs of your own.

export type CategorySlug =
  | "tshirts"
  | "jackets-hoodies"
  | "slides"
  | "jewelry"
  | "hats";
export type Gender = "men" | "women" | "unisex";

export interface Variant {
  color: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategorySlug;
  gender: Gender;
  price: number;
  compareAt?: number;
  badge?: "Sale" | "Pre-Order" | "New";
  variants: Variant[];
  sizes: string[];
  rating: number;
  reviews: number;
  blurb: string;
  details: string[];
  newDrop?: boolean;
}

const CDN = "https://shopzipprepublic.com/cdn/shop/files/";
export const img = (file: string, v: string, w = 900) =>
  `${CDN}${file}?v=${v}&width=${w}`;

export const HERO_IMAGE =
  "https://shopzipprepublic.com/cdn/shop/files/27_82734cc5-e497-4689-a04a-ae4c8e59dd5b.jpg?v=1731972117&width=960";
// "https://shopzipprepublic.com/cdn/shop/files/FillB-ZippProds.jpg?v=1732249012&width=960";

export const LOGO_URL =
  "https://shopzipprepublic.com/cdn/shop/files/Zipp_Republic_logo_White_Web_Version.png?v=1733493130";
export const LOGO_WHITE = require("../../assets/images/zipp-logo-white.png");
export const MONOGRAM_WHITE = require("../../assets/images/zr-monogram-white.png");

const APPAREL = ["S", "M", "L", "XL", "XXL"];
const SLIDE_SIZES = ["40", "41", "42", "43", "44", "45", "46"];
const ONE = ["One size"];

const HEX = {
  red: "#C8201A",
  wine: "#6E1A24",
  black: "#111111",
  white: "#F5F4F0",
  pink: "#F2A6C0",
  blue: "#2F6FDE",
  grey: "#9A9A9A",
  brown: "#6B4A32",
  army: "#556B3C",
  beige: "#D9C7A8",
  gold: "#C9A24B",
  silver: "#C0C2C6",
};

export const PRODUCTS: Product[] = [
  {
    id: "zipp-2-0-jersey",
    name: "ZIPP 2.0 Jersey",
    category: "tshirts",
    gender: "unisex",
    price: 60750,
    compareAt: 135000,
    badge: "Pre-Order",
    newDrop: true,
    rating: 4.8,
    reviews: 126,
    sizes: APPAREL,
    blurb:
      "The Zipp 2.0 drop. A bold statement jersey cut for the street, built from 100% high quality materials.",
    details: [
      "Exclusive ZR design",
      "Breathable mesh-feel fabric",
      "Relaxed unisex fit",
      "Machine wash cold",
    ],
    variants: [
      {
        color: "Red",
        hex: HEX.red,
        image: img("FillB-ZippProds.jpg", "1732249012"),
      },
      {
        color: "Black",
        hex: HEX.black,
        image: img("27_82734cc5-e497-4689-a04a-ae4c8e59dd5b.jpg", "1731972117"),
      },
      {
        color: "Pink",
        hex: HEX.pink,
        image: img("24_92c812b5-77a1-4b18-8a01-b87c259fcae1.jpg", "1731972147"),
      },
      {
        color: "Blue",
        hex: HEX.blue,
        image: img("IMG_9611.jpg", "1732554341"),
      },
    ],
  },
  {
    id: "zipp-classic-tshirt",
    name: "ZIPP Classic TShirt",
    category: "tshirts",
    gender: "unisex",
    price: 35000,
    compareAt: 95000,
    badge: "Sale",
    newDrop: true,
    rating: 4.6,
    reviews: 84,
    sizes: APPAREL,
    blurb:
      "Heavyweight everyday tee with the Zipp mark. Soft hand-feel, structured shoulders.",
    details: [
      "100% cotton",
      "Heavyweight 240gsm",
      "Regular fit",
      "Pre-washed to avoid shrink",
    ],
    variants: [
      {
        color: "Blue",
        hex: HEX.blue,
        image: img("40_ee6d26fc-9f6a-4497-bc04-5c5a40a14941.jpg", "1732249067"),
      },
    ],
  },
  {
    id: "zipp-mouth-tshirt",
    name: "ZIPP Mouth TShirt",
    category: "tshirts",
    gender: "unisex",
    price: 35000,
    compareAt: 95000,
    badge: "Sale",
    newDrop: true,
    rating: 4.7,
    reviews: 61,
    sizes: APPAREL,
    blurb:
      "Graphic tee featuring the signature Zipp mouth print. Loud on purpose.",
    details: [
      "100% cotton",
      "Screen-printed graphic",
      "Regular fit",
      "Machine wash cold",
    ],
    variants: [
      {
        color: "Black",
        hex: HEX.black,
        image: img("35_66975425-bd1e-47b5-9802-347e9c82b3ee.jpg", "1732249094"),
      },
    ],
  },
  {
    id: "zipp-double-layer-set",
    name: "ZIPP Double Layer Vintage Streetwear Set",
    category: "tshirts",
    gender: "men",
    price: 95000,
    compareAt: 150000,
    badge: "Sale",
    newDrop: true,
    rating: 4.9,
    reviews: 47,
    sizes: APPAREL,
    blurb:
      "A two-piece double layer set with vintage wash. Wear together or split into separates.",
    details: [
      "2-piece set",
      "Double layer construction",
      "Vintage wash finish",
      "Oversized fit",
    ],
    variants: [
      { color: "Red", hex: HEX.red, image: img("44.jpg", "1732249105") },
      {
        color: "Grey",
        hex: HEX.grey,
        image: img("44_834a6cbf-079c-40c3-8f36-3ef4c556db97.jpg", "1732249117"),
      },
    ],
  },
  {
    id: "zipp-city-varsity",
    name: "ZIPP City Varsity Jacket",
    category: "jackets-hoodies",
    gender: "unisex",
    price: 50000,
    compareAt: 125000,
    badge: "Sale",
    rating: 4.8,
    reviews: 203,
    sizes: APPAREL,
    blurb:
      "Our signature varsity. Embroidered crest, snap closure and a clean boxy silhouette.",
    details: [
      "Embroidered ZR crest",
      "Snap-button closure",
      "Ribbed cuffs and hem",
      "Satin-lined interior",
    ],
    variants: [
      {
        color: "Brown",
        hex: HEX.brown,
        image: img("16_59586667-d66c-4425-989c-df5393a122ec.jpg", "1732249100"),
      },
      {
        color: "Black",
        hex: HEX.black,
        image: img("74_13fbf239-2c53-4cdb-9825-ecbdce5b5759.jpg", "1732249023"),
      },
      {
        color: "Pink",
        hex: HEX.pink,
        image: img("8_d10169d4-a5d9-41b9-af2d-2fc4ac9c0deb.jpg", "1732249140"),
      },
      {
        color: "Red",
        hex: HEX.red,
        image: img("FillPicsA-ZippProducts_1.jpg", "1732249078"),
      },
    ],
  },
  {
    id: "zipp-armless-varsity",
    name: "ZIPP Armless Varsity Jacket",
    category: "jackets-hoodies",
    gender: "unisex",
    price: 30150,
    compareAt: 85000,
    badge: "Sale",
    rating: 4.5,
    reviews: 39,
    sizes: APPAREL,
    blurb: "The varsity, sleeves off. Layer it over a tee or a hoodie.",
    details: [
      "Sleeveless varsity cut",
      "Snap-button closure",
      "Embroidered ZR crest",
      "Relaxed fit",
    ],
    variants: [
      {
        color: "Black",
        hex: HEX.black,
        image: img(
          "Version2BofZippProducts_3b90a70e-a6b7-4cc9-82e3-276299bf21db.jpg",
          "1732249083",
        ),
      },
    ],
  },
  {
    id: "zipp-shield-hoodie",
    name: "ZIPP Shield Washed Hoodie & Joggers",
    category: "jackets-hoodies",
    gender: "unisex",
    price: 112500,
    badge: "New",
    newDrop: true,
    rating: 4.9,
    reviews: 18,
    sizes: APPAREL,
    blurb:
      "A washed-out matching set. Heavy fleece hoodie with tapered joggers.",
    details: [
      "2-piece hoodie and joggers",
      "Garment washed fleece",
      "Kangaroo pocket",
      "Elastic cuffs",
    ],
    variants: [
      {
        color: "Blue",
        hex: HEX.blue,
        image: img("Screenshot2026-08-08at14.07.59.png", "1786194591"),
      },
      { color: "Red", hex: HEX.red },
      { color: "Black", hex: HEX.black },
    ],
  },
  {
    id: "zipp-mens-classic-slides",
    name: "Zipp ZR Men's Classic Slides",
    category: "slides",
    gender: "men",
    price: 23750,
    compareAt: 29687,
    badge: "Pre-Order",
    newDrop: true,
    rating: 4.9,
    reviews: 312,
    sizes: SLIDE_SIZES,
    blurb:
      "Buttery-soft footbed made for all-day wear. The slide the people keep talking about.",
    details: [
      "Cushioned footbed",
      "Non-slip outsole",
      "Embossed ZR logo strap",
      "EU sizing",
    ],
    variants: [
      {
        color: "Black",
        hex: HEX.black,
        image: img("IMG_9956.jpg", "1732607289"),
      },
      {
        color: "Gray",
        hex: HEX.grey,
        image: img("IMG_9967.jpg", "1732607328"),
      },
      { color: "Red", hex: HEX.red, image: img("IMG_9987.jpg", "1732607373") },
      {
        color: "Brown",
        hex: HEX.brown,
        image: img("IMG_9999.jpg", "1732607422"),
      },
      {
        color: "Army Green",
        hex: HEX.army,
        image: img("IMG_9977.jpg", "1732607358"),
      },
    ],
  },
  {
    id: "zipp-womens-slides",
    name: "Zipp ZR Women's Slides",
    category: "slides",
    gender: "women",
    price: 23750,
    compareAt: 29687,
    badge: "Sale",
    rating: 4.8,
    reviews: 154,
    sizes: ["36", "37", "38", "39", "40", "41"],
    blurb:
      "Soft, light and made for her. Same buttery footbed in a slimmer last.",
    details: [
      "Cushioned footbed",
      "Slimmer women's last",
      "Non-slip outsole",
      "EU sizing",
    ],
    variants: [
      {
        color: "Black",
        hex: HEX.black,
        image: img("IMG_0065.jpg", "1732606899"),
      },
      {
        color: "Beige",
        hex: HEX.beige,
        image: img("IMG_0034.jpg", "1732606870"),
      },
    ],
  },
  {
    id: "zipp-canvas-slides",
    name: "Zipp Republic ZR Unisex Canvas Slides",
    category: "slides",
    gender: "unisex",
    price: 28750,
    compareAt: 35937,
    badge: "Sale",
    rating: 4.7,
    reviews: 72,
    sizes: SLIDE_SIZES,
    blurb:
      "Canvas upper, cork-feel footbed. Lighter, breathable and easy with everything.",
    details: [
      "Canvas upper",
      "Cushioned footbed",
      "Non-slip outsole",
      "Unisex EU sizing",
    ],
    variants: [
      {
        color: "Black",
        hex: HEX.black,
        image: img("IMG_0103.jpg", "1732607051"),
      },
    ],
  },
  // Official Zipp Republic Jewelry & Hats
  {
    id: "zipp-stud-earrings",
    name: "Zipp Stud Unisex Earrings",
    category: "jewelry",
    gender: "unisex",
    price: 39063,
    compareAt: 91375,
    badge: "Sale",
    newDrop: true,
    rating: 4.9,
    reviews: 95,
    sizes: ONE,
    blurb:
      "Signature Zipp Republic stud earrings crafted with high-polish plating and handset stones for everyday shine.",
    details: [
      "Tarnish-resistant finish",
      "Secure butterfly backing",
      "Hypoallergenic post",
      "ZR presentation box included",
    ],
    variants: [
      {
        color: "Gold",
        hex: HEX.gold,
        image: img("49_29a9e218-d67a-49e6-b422-8f602336131e.jpg", "1732249151"),
      },
      {
        color: "Silver",
        hex: HEX.silver,
        image: img("51_1da77d84-b3b9-40c4-850a-531ee9945e4e.jpg", "1732249157"),
      },
    ],
  },
  {
    id: "zipp-zr-hoop-earrings",
    name: "ZIPP ZR Hoop Earrings",
    category: "jewelry",
    gender: "women",
    price: 40469,
    compareAt: 95625,
    badge: "Sale",
    rating: 4.8,
    reviews: 64,
    sizes: ONE,
    blurb:
      "Sculpted ZR emblem hoop earrings with a high-shine gold finish. Lightweight enough for all-day wear.",
    details: [
      "18k gold-tone finish",
      "Hinged snap closure",
      "Lightweight comfort fit",
      "Gift pouch included",
    ],
    variants: [
      {
        color: "Gold",
        hex: HEX.gold,
        image: img("58_8b452c81-a37f-4061-a98d-301177b4f4f2.jpg", "1732249046"),
      },
    ],
  },
  {
    id: "zipp-zr-dangle-earrings",
    name: "ZIPP ZR Dangle Earrings",
    category: "jewelry",
    gender: "women",
    price: 43656,
    compareAt: 99875,
    badge: "Sale",
    newDrop: true,
    rating: 4.9,
    reviews: 52,
    sizes: ONE,
    blurb:
      "Statement ZR monogram drop earrings designed to catch the light from every angle.",
    details: [
      "Signature ZR drop silhouette",
      "High-polish gold plating",
      "Hypoallergenic fastening",
      "ZR presentation box included",
    ],
    variants: [
      {
        color: "Gold",
        hex: HEX.gold,
        image: img("55_45948c5b-60b6-4af6-9890-c848e47be5b0.jpg", "1732249146"),
      },
    ],
  },
  {
    id: "zipp-denim-bucket-hat",
    name: "Zipp Republic Denim Bucket Hat",
    category: "hats",
    gender: "unisex",
    price: 15750,
    compareAt: 30000,
    badge: "Sale",
    newDrop: true,
    rating: 4.8,
    reviews: 78,
    sizes: ONE,
    blurb:
      "Distressed washed denim bucket hat featuring the embroidered Zipp Republic mark and structured stitched brim.",
    details: [
      "100% heavyweight denim",
      "Embroidered ZR logo",
      "Breathable eyelets",
      "Unisex one-size fit",
    ],
    variants: [
      {
        color: "Blue",
        hex: HEX.blue,
        image: img("IMG_9855.jpg", "1732607763"),
      },
      {
        color: "Gray",
        hex: HEX.grey,
        image: img("IMG_9888.jpg", "1732607768"),
      },
    ],
  },
  {
    id: "zipp-pattern-bucket-hat",
    name: "Zipp Republic Pattern Bucket Hat",
    category: "hats",
    gender: "unisex",
    price: 15750,
    compareAt: 30000,
    badge: "Sale",
    rating: 4.7,
    reviews: 49,
    sizes: ONE,
    blurb:
      "All-over monogram pattern bucket hat with a relaxed crown and wide shade brim.",
    details: [
      "Custom ZR jacquard pattern",
      "Structured stitched brim",
      "Soft interior sweatband",
      "One size fits most",
    ],
    variants: [
      {
        color: "Brown",
        hex: HEX.brown,
        image: img("IMG_9866.jpg", "1732609865"),
      },
      {
        color: "Black",
        hex: HEX.black,
        image: img("IMG_9863.jpg", "1732609865"),
      },
      {
        color: "Wine Red",
        hex: HEX.wine,
        image: img("IMG_9875.jpg", "1732609866"),
      },
    ],
  },
  {
    id: "zipp-zr-beanie-hat",
    name: "Zipp Republic ZR Beanie Hat",
    category: "hats",
    gender: "unisex",
    price: 11250,
    compareAt: 25000,
    badge: "Sale",
    rating: 4.8,
    reviews: 91,
    sizes: ONE,
    blurb:
      "Rib-knit cuffed beanie finished with the signature Zipp Republic crest on the fold.",
    details: [
      "Soft stretch rib-knit",
      "Fold-over cuff",
      "Embroidered ZR patch",
      "One size fits all",
    ],
    variants: [
      {
        color: "Gray",
        hex: HEX.grey,
        image: img("IMG_9831.jpg", "1732607509"),
      },
      {
        color: "Army Green",
        hex: HEX.army,
        image: img("IMG_9824.jpg", "1732607508"),
      },
      {
        color: "Black",
        hex: HEX.black,
        image: img("IMG_9836.jpg", "1732607509"),
      },
      {
        color: "Beige",
        hex: HEX.beige,
        image: img("IMG_9762.jpg", "1732607508"),
      },
      {
        color: "Wine Red",
        hex: HEX.wine,
        image: img("IMG_9849.jpg", "1732607509"),
      },
    ],
  },
  {
    id: "zipp-rhinestone-hat",
    name: "Zipp Republic Rhinestone Hat",
    category: "hats",
    gender: "women",
    price: 35000,
    compareAt: 55000,
    badge: "Sale",
    newDrop: true,
    rating: 4.9,
    reviews: 67,
    sizes: ONE,
    blurb:
      "Structured curved-brim cap embellished with crystal rhinestone ZR detailing across the crown.",
    details: [
      "Hand-set rhinestone ZR emblem",
      "Curved peak silhouette",
      "Adjustable back strap",
      "100% cotton twill",
    ],
    variants: [
      {
        color: "Black",
        hex: HEX.black,
        image: img("IMG_9930.jpg", "1732610426"),
      },
      {
        color: "White",
        hex: HEX.white,
        image: img("IMG_9949.jpg", "1732610427"),
      },
      {
        color: "Beige",
        hex: HEX.beige,
        image: img("IMG_9922.jpg", "1732610427"),
      },
    ],
  },
  {
    id: "zipp-snapback-hat",
    name: "Zipp Republic Snapback Hat",
    category: "hats",
    gender: "unisex",
    price: 30000,
    compareAt: 45000,
    badge: "Pre-Order",
    newDrop: true,
    rating: 4.8,
    reviews: 112,
    sizes: ONE,
    blurb:
      "High-crown 6-panel snapback cap with raised 3D Zipp Republic embroidery and adjustable snap closure.",
    details: [
      "3D raised front embroidery",
      "Structured 6-panel crown",
      "Adjustable snapback closure",
      "Breathable stitched eyelets",
    ],
    variants: [
      {
        color: "Red",
        hex: HEX.red,
        image: img("Screenshot_2026-08-08_at_17.00.12.png", "1786204855"),
      },
      {
        color: "Gray",
        hex: HEX.grey,
        image: img("IMG_9898.jpg", "1732610225"),
      },
      {
        color: "White",
        hex: HEX.white,
        image: img(
          "Screenshot_2026-08-08_at_16.45.24_c2952a21-bab5-4cde-b9cb-60d1ee20c74d.png",
          "1786205795",
        ),
      },
      {
        color: "Beige",
        hex: HEX.beige,
        image: img("Screenshot_2026-08-08_at_16.28.41.png", "1786205820"),
      },
      {
        color: "Pink",
        hex: HEX.pink,
        image: img("Pink_ZR_cap.png", "1787567607"),
      },
      {
        color: "Black",
        hex: HEX.black,
        image: img("Black_ZR_cap.png", "1787567639"),
      },
    ],
  },
  // Dummy women's pieces
  {
    id: "zipp-womens-crop-jersey",
    name: "ZIPP Women's Cropped Jersey",
    category: "tshirts",
    gender: "women",
    price: 38000,
    compareAt: 72000,
    badge: "Sale",
    newDrop: true,
    rating: 4.8,
    reviews: 41,
    sizes: ["XS", "S", "M", "L", "XL"],
    blurb:
      "A cropped take on the 2.0 jersey. Cut slightly boxy with a clean hem.",
    details: [
      "Cropped fit",
      "Breathable fabric",
      "Exclusive ZR design",
      "Machine wash cold",
    ],
    variants: [
      {
        color: "Pink",
        hex: HEX.pink,
        image: img("24_92c812b5-77a1-4b18-8a01-b87c259fcae1.jpg", "1731972147"),
      },
      {
        color: "Black",
        hex: HEX.black,
        image: img("27_82734cc5-e497-4689-a04a-ae4c8e59dd5b.jpg", "1731972117"),
      },
    ],
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const firstImage = (p: Product) =>
  p.variants.find((v) => v.image)?.image;

export const discountPct = (p: Product) =>
  p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;

export interface CollectionDef {
  slug: string;
  title: string;
  subtitle: string;
  image?: string;
  filter: (p: Product) => boolean;
}

const byId = (id: string) => PRODUCTS.find((p) => p.id === id)!;

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: "new",
    title: "New Arrivals",
    subtitle: "The newest drops from Zipp Republic",
    image: firstImage(byId("zipp-2-0-jersey")),
    filter: (p) => !!p.newDrop,
  },
  {
    slug: "men",
    title: "Men",
    subtitle: "Menswear and unisex essentials",
    image: firstImage(byId("zipp-double-layer-set")),
    filter: (p) => p.gender !== "women",
  },
  {
    slug: "women",
    title: "Women",
    subtitle: "Womenswear and unisex essentials",
    image: firstImage(byId("zipp-womens-slides")),
    filter: (p) => p.gender !== "men",
  },
  {
    slug: "tshirts",
    title: "Tshirts",
    subtitle: "Jerseys, tees and sets",
    image: firstImage(byId("zipp-mouth-tshirt")),
    filter: (p) => p.category === "tshirts",
  },
  {
    slug: "jackets-hoodies",
    title: "Jackets & Hoodies",
    subtitle: "Varsity jackets, hoodies and layers",
    image: firstImage(byId("zipp-city-varsity")),
    filter: (p) => p.category === "jackets-hoodies",
  },
  {
    slug: "accessories",
    title: "Accessories",
    subtitle: "Jewelry and headwear from Zipp Republic",
    image: firstImage(byId("zipp-stud-earrings")),
    filter: (p) => p.category === "jewelry" || p.category === "hats",
  },
  {
    slug: "jewelry",
    title: "Jewelry",
    subtitle: "Studs, hoops and monogram earrings",
    image: firstImage(byId("zipp-zr-hoop-earrings")),
    filter: (p) => p.category === "jewelry",
  },
  {
    slug: "hats",
    title: "Hats",
    subtitle: "Bucket hats, beanies, snapbacks and caps",
    image: firstImage(byId("zipp-denim-bucket-hat")),
    filter: (p) => p.category === "hats",
  },
  {
    slug: "slides",
    title: "Slides",
    subtitle: "Shop our premium slides",
    image: firstImage(byId("zipp-mens-classic-slides")),
    filter: (p) => p.category === "slides",
  },
  {
    slug: "sale",
    title: "Sale",
    subtitle: "Up to 65% off selected styles",
    image: firstImage(byId("zipp-armless-varsity")),
    filter: (p) => !!p.compareAt,
  },
  {
    slug: "all",
    title: "All Products",
    subtitle: "Everything in the Republic",
    filter: () => true,
  },
];

export const getCollection = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug) ??
  COLLECTIONS[COLLECTIONS.length - 1];
export const productsIn = (slug: string) =>
  PRODUCTS.filter(getCollection(slug).filter);

export const TICKER_A = ["100% HIGH QUALITY MATERIALS", "ZR EXCLUSIVE DESIGNS"];
export const TICKER_B = ["AFFORDABLE LUXURY", "PREMIUM LIFESTYLE"];

export const TESTIMONIALS = [
  {
    name: "Chidi O.",
    where: "Lagos",
    text: "I love the slides. They feel buttery soft on my feet, I can wear them all day long!",
  },
  {
    name: "Amaka E.",
    where: "Abuja",
    text: "Well done Zipp team! These executive watches are high-quality and look amazing. Everything is just on point!",
  },
  {
    name: "Tobi A.",
    where: "Port Harcourt",
    text: "If you're not rocking a Zipp Republic outfit right now, you're living under a rock.",
  },
];

export const REVIEWS = [
  {
    name: "Femi A.",
    rating: 5,
    date: "2 weeks ago",
    text: "Quality is far better than I expected for the price. Fits true to size.",
  },
  {
    name: "Sandra K.",
    rating: 5,
    date: "1 month ago",
    text: "Delivery was quick and packaging was premium. Already ordered another colour.",
  },
  {
    name: "David I.",
    rating: 4,
    date: "1 month ago",
    text: "Love the design. I would size up if you prefer a looser fit.",
  },
];

export const NG_STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Rivers",
  "Oyo",
  "Kano",
  "Plateau",
  "Enugu",
  "Kaduna",
  "Delta",
  "Ogun",
];

export const DELIVERY = [
  {
    id: "standard",
    label: "Standard delivery",
    eta: "3 to 5 working days",
    price: 3500,
  },
  {
    id: "express",
    label: "Express delivery",
    eta: "1 to 2 working days",
    price: 8000,
  },
];

export const FREE_SHIPPING_AT = 150000;
export const PROMO_CODES: Record<string, number> = {
  ZIPP10: 0.1,
  REPUBLIC15: 0.15,
};
