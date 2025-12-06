import { useState, useMemo, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  productType: string; // Main type (e.g., "Bath Towel", "Kitchen Towel")
  productSubtype?: string; // Specific subtype (e.g., "Premium / Luxury Hotel Bath Towel")
  description: string;
  price: string;
  priceValue: number;
  imageEmoji: string;
  highlight?: string;
  createdAt: number;
  imageUrl?: string;
}

export const towelImageMap: Record<string, string> = {
  'bath towel': '/towel/bathtowel/bathtowel (1).jpg',
  napkin: '/towel/napkin/hand towel (1).jpg',
  'face towel': '/towel/face towel/face towel (1).jpg',
  'beach towel': '/towel/beach towel/beach towel (1).jpg',
  bathrobe: '/towel/bathrobe/bathrobe (1).jpg',
  'kitchen towel': '/towel/kitchn towel/kitchn towel (1).jpg',
  'terry kitchen towel': '/towel/terry kitchen towel/terry kitchen towel (1).jpg',
};

export const getImageForType = (productType: string) => {
  return towelImageMap[productType?.toLowerCase()] || undefined;
};

const ADMIN_EMAIL = 'admin@123.com';

export const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton Bath Towels',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    productSubtype: 'Premium / Luxury Hotel Bath Towel',
    description: 'Ultra-soft 100% cotton bath towels with superior absorbency. Perfect for luxury hotels and spas.',
    price: '₹45.00',
    priceValue: 45,
    imageEmoji: '🧺',
    highlight: 'Best Seller',
    createdAt: 1,
    imageUrl: getImageForType('Bath Towel'),
  },
  {
    id: '2',
    name: 'Luxury Hand Towels Set',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Napkin',
    productSubtype: 'Dinner Table Napkin',
    description: 'Set of 6 premium hand towels with elegant borders. Bulk orders available.',
    price: '₹32.00',
    priceValue: 32,
    imageEmoji: '🧺',
    highlight: 'Bulk Available',
    createdAt: 2,
    imageUrl: getImageForType('Napkin'),
  },
  {
    id: '3',
    name: 'Egyptian Cotton Face Towels',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Face Towel',
    productSubtype: 'Organic Cotton Face Towel',
    description: 'Soft and durable face towels made from premium Egyptian cotton fibers.',
    price: '₹18.00',
    priceValue: 18,
    imageEmoji: '🧺',
    createdAt: 3,
    imageUrl: getImageForType('Face Towel'),
  },
  {
    id: '4',
    name: 'Beach Towel Collection',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Beach Towel',
    productSubtype: 'Printed Beach Towel',
    description: 'Large, colorful beach towels perfect for resorts and beach clubs.',
    price: '₹52.00',
    priceValue: 52,
    imageEmoji: '🧺',
    createdAt: 4,
    imageUrl: getImageForType('Beach Towel'),
  },
  {
    id: '9',
    name: 'Regular Terry Bath Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    productSubtype: 'Regular Terry Bath Towel',
    description: 'Classic terry cloth bath towel with excellent absorbency. Great for everyday use.',
    price: '₹38.00',
    priceValue: 38,
    imageEmoji: '🧺',
    createdAt: 9,
    imageUrl: getImageForType('Bath Towel'),
  },
  {
    id: '10',
    name: 'Microfiber Quick-Dry Bath Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    productSubtype: 'Microfiber Quick-Dry Bath Towel',
    description: 'Lightweight and fast-drying microfiber towel. Perfect for gym and travel.',
    price: '₹42.00',
    priceValue: 42,
    imageEmoji: '🧺',
    highlight: 'Quick Dry',
    createdAt: 10,
    imageUrl: getImageForType('Bath Towel'),
  },
  {
    id: '11',
    name: 'Cotton Face Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Face Towel',
    productSubtype: 'Cotton Face Towel',
    description: 'Gentle cotton face towel for daily skincare routine. Soft and absorbent.',
    price: '₹15.00',
    priceValue: 15,
    imageEmoji: '🧺',
    createdAt: 11,
    imageUrl: getImageForType('Face Towel'),
  },
  {
    id: '12',
    name: 'Makeup Removal Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Face Towel',
    productSubtype: 'Makeup Removal Towel',
    description: 'Specialized towel designed for gentle makeup removal. Ultra-soft texture.',
    price: '₹22.00',
    priceValue: 22,
    imageEmoji: '🧺',
    highlight: 'Makeup Friendly',
    createdAt: 12,
    imageUrl: getImageForType('Face Towel'),
  },
  {
    id: '13',
    name: 'Terry Cotton Bathrobe',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bathrobe',
    productSubtype: 'Terry Cotton Bathrobe',
    description: 'Comfortable terry cotton bathrobe for post-bath relaxation. Available in multiple sizes.',
    price: '₹85.00',
    priceValue: 85,
    imageEmoji: '🧺',
    highlight: 'Premium',
    createdAt: 13,
    imageUrl: getImageForType('Bathrobe'),
  },
  {
    id: '14',
    name: 'Hooded Bathrobe',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bathrobe',
    productSubtype: 'Hooded Bathrobe',
    description: 'Warm and cozy hooded bathrobe. Perfect for cold mornings and spa days.',
    price: '₹95.00',
    priceValue: 95,
    imageEmoji: '🧺',
    highlight: 'Hooded',
    createdAt: 14,
    imageUrl: getImageForType('Bathrobe'),
  },
  {
    id: '15',
    name: 'Round Beach Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Beach Towel',
    productSubtype: 'Round Beach Towel',
    description: 'Unique round-shaped beach towel. Eye-catching design for beach outings.',
    price: '₹58.00',
    priceValue: 58,
    imageEmoji: '🧺',
    highlight: 'Round Design',
    createdAt: 15,
    imageUrl: getImageForType('Beach Towel'),
  },
  {
    id: '16',
    name: 'Kids Beach Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Beach Towel',
    productSubtype: 'Kids Beach Towel',
    description: 'Fun and colorful beach towel designed for kids. Features playful patterns.',
    price: '₹35.00',
    priceValue: 35,
    imageEmoji: '🧺',
    highlight: 'Kids',
    createdAt: 16,
    imageUrl: getImageForType('Beach Towel'),
  },
  {
    id: '17',
    name: 'Terry Kitchen Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Kitchen Towel',
    productSubtype: 'Terry Kitchen Towel',
    description: 'Heavy-duty terry kitchen towel for all your kitchen needs. Highly absorbent.',
    price: '₹28.00',
    priceValue: 28,
    imageEmoji: '🧺',
    createdAt: 17,
    imageUrl: getImageForType('Kitchen Towel'),
  },
  {
    id: '18',
    name: 'Dish Drying Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Kitchen Towel',
    productSubtype: 'Dish Drying Towel',
    description: 'Specialized towel for drying dishes. Quick-drying and lint-free.',
    price: '₹25.00',
    priceValue: 25,
    imageEmoji: '🧺',
    createdAt: 18,
    imageUrl: getImageForType('Kitchen Towel'),
  },
  {
    id: '19',
    name: 'Cotton Cloth Napkin',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Napkin',
    productSubtype: 'Cotton Cloth Napkin',
    description: 'Elegant cotton cloth napkins for fine dining. Reusable and eco-friendly.',
    price: '₹20.00',
    priceValue: 20,
    imageEmoji: '🧺',
    highlight: 'Eco-Friendly',
    createdAt: 19,
    imageUrl: getImageForType('Napkin'),
  },
  {
    id: '20',
    name: 'Restaurant Fine-Dining Napkin',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Napkin',
    productSubtype: 'Restaurant Fine-Dining Napkin',
    description: 'Premium quality napkins for restaurants and fine dining establishments.',
    price: '₹30.00',
    priceValue: 30,
    imageEmoji: '🧺',
    highlight: 'Restaurant Grade',
    createdAt: 20,
    imageUrl: getImageForType('Napkin'),
  },
  {
    id: '21',
    name: 'Heavy Absorbent Terry Cloth Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Terry Kitchen Towel',
    productSubtype: 'Heavy Absorbent Terry Cloth Towel',
    description: 'Extra absorbent terry cloth towel for heavy-duty kitchen cleaning.',
    price: '₹35.00',
    priceValue: 35,
    imageEmoji: '🧺',
    highlight: 'Heavy Duty',
    createdAt: 21,
    imageUrl: getImageForType('Terry Kitchen Towel'),
  },
  {
    id: '22',
    name: 'Gym / Sports Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'All-Purpose Towels',
    productSubtype: 'Gym / Sports Towel',
    description: 'Lightweight and quick-drying towel perfect for gym and sports activities.',
    price: '₹40.00',
    priceValue: 40,
    imageEmoji: '🧺',
    highlight: 'Sports',
    createdAt: 22,
    imageUrl: getImageForType('All-Purpose Towels'),
  },
  {
    id: '23',
    name: 'Microfiber Cleaning Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'All-Purpose Towels',
    productSubtype: 'Microfiber Cleaning Towel',
    description: 'Versatile microfiber cleaning towel for household and commercial use.',
    price: '₹18.00',
    priceValue: 18,
    imageEmoji: '🧺',
    createdAt: 23,
    imageUrl: getImageForType('All-Purpose Towels'),
  },
  {
    id: '24',
    name: 'Bamboo Bath Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    productSubtype: 'Bamboo Bath Towel',
    description: 'Eco-friendly bamboo bath towel. Naturally antibacterial and super soft.',
    price: '₹48.00',
    priceValue: 48,
    imageEmoji: '🧺',
    highlight: 'Eco-Friendly',
    createdAt: 24,
    imageUrl: getImageForType('Bath Towel'),
  },
  {
    id: '25',
    name: 'Turkish Cotton Bath Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    productSubtype: 'Turkish Cotton Bath Towel',
    description: 'Luxurious Turkish cotton bath towel. Known for its softness and durability.',
    price: '₹55.00',
    priceValue: 55,
    imageEmoji: '🧺',
    highlight: 'Luxury',
    createdAt: 25,
    imageUrl: getImageForType('Bath Towel'),
  },
  {
    id: '26',
    name: 'Luxury Spa / Hotel Bathrobe',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bathrobe',
    productSubtype: 'Luxury Spa / Hotel Bathrobe',
    description: 'Premium spa-grade bathrobe for hotels and luxury spas. Ultra-plush fabric.',
    price: '₹120.00',
    priceValue: 120,
    imageEmoji: '🧺',
    highlight: 'Spa Grade',
    createdAt: 26,
    imageUrl: getImageForType('Bathrobe'),
  },
  {
    id: '27',
    name: 'Travel Quick-Dry Beach Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Beach Towel',
    productSubtype: 'Travel Quick-Dry Beach Towel',
    description: 'Compact and quick-drying beach towel perfect for travel. Lightweight and packable.',
    price: '₹45.00',
    priceValue: 45,
    imageEmoji: '🧺',
    highlight: 'Travel',
    createdAt: 27,
    imageUrl: getImageForType('Beach Towel'),
  },
  {
    id: '28',
    name: 'Waffle Knit Kitchen Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Kitchen Towel',
    productSubtype: 'Waffle Knit Kitchen Towel',
    description: 'Textured waffle knit kitchen towel. Excellent for drying and cleaning.',
    price: '₹22.00',
    priceValue: 22,
    imageEmoji: '🧺',
    createdAt: 28,
    imageUrl: getImageForType('Kitchen Towel'),
  },
  // Additional Face Towel subtypes
  {
    id: '29',
    name: 'Microfiber Face Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Face Towel',
    productSubtype: 'Microfiber Face Towel',
    description: 'Ultra-soft microfiber face towel for gentle cleansing.',
    price: '₹16.00',
    priceValue: 16,
    imageEmoji: '🧺',
    createdAt: 29,
    imageUrl: getImageForType('Face Towel'),
  },
  {
    id: '30',
    name: 'Quick-Dry Face Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Face Towel',
    productSubtype: 'Quick-Dry Face Towel',
    description: 'Fast-drying face towel perfect for daily use.',
    price: '₹14.00',
    priceValue: 14,
    imageEmoji: '🧺',
    createdAt: 30,
    imageUrl: getImageForType('Face Towel'),
  },
  {
    id: '31',
    name: 'Bamboo Face Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Face Towel',
    productSubtype: 'Bamboo Face Towel',
    description: 'Natural bamboo face towel with antibacterial properties.',
    price: '₹19.00',
    priceValue: 19,
    imageEmoji: '🧺',
    highlight: 'Natural',
    createdAt: 31,
    imageUrl: getImageForType('Face Towel'),
  },
  {
    id: '32',
    name: 'Anti-Bacterial Charcoal Infused Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Face Towel',
    productSubtype: 'Anti-Bacterial / Charcoal Infused Towel',
    description: 'Charcoal-infused face towel with natural antibacterial properties.',
    price: '₹24.00',
    priceValue: 24,
    imageEmoji: '🧺',
    highlight: 'Anti-Bacterial',
    createdAt: 32,
    imageUrl: getImageForType('Face Towel'),
  },
  // All-Purpose Towels subtypes
  {
    id: '33',
    name: 'Utility Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'All-Purpose Towels',
    productSubtype: 'Utility Towel',
    description: 'Versatile utility towel for various cleaning tasks.',
    price: '₹16.00',
    priceValue: 16,
    imageEmoji: '🧺',
    createdAt: 33,
    imageUrl: getImageForType('All-Purpose Towels'),
  },
  {
    id: '34',
    name: 'Multi-Use Terry Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'All-Purpose Towels',
    productSubtype: 'Multi-Use Terry Towel',
    description: 'Multi-purpose terry towel for home and commercial use.',
    price: '₹20.00',
    priceValue: 20,
    imageEmoji: '🧺',
    createdAt: 34,
    imageUrl: getImageForType('All-Purpose Towels'),
  },
  {
    id: '35',
    name: 'Sweat Absorbent Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'All-Purpose Towels',
    productSubtype: 'Sweat Absorbent Towel',
    description: 'Highly absorbent towel designed for active use.',
    price: '₹18.00',
    priceValue: 18,
    imageEmoji: '🧺',
    highlight: 'High Absorbency',
    createdAt: 35,
    imageUrl: getImageForType('All-Purpose Towels'),
  },
  {
    id: '36',
    name: 'Car Cleaning Cloth',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'All-Purpose Towels',
    productSubtype: 'Car Cleaning Cloth',
    description: 'Specialized microfiber cloth for car cleaning and detailing.',
    price: '₹15.00',
    priceValue: 15,
    imageEmoji: '🧺',
    highlight: 'Car Care',
    createdAt: 36,
    imageUrl: getImageForType('All-Purpose Towels'),
  },
  // Bathrobe subtypes
  {
    id: '37',
    name: 'Waffle Weave Bathrobe',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bathrobe',
    productSubtype: 'Waffle Weave Bathrobe',
    description: 'Lightweight waffle weave bathrobe with textured design.',
    price: '₹75.00',
    priceValue: 75,
    imageEmoji: '🧺',
    createdAt: 37,
    imageUrl: getImageForType('Bathrobe'),
  },
  {
    id: '38',
    name: 'Velour Finish Bathrobe',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bathrobe',
    productSubtype: 'Velour Finish Bathrobe',
    description: 'Luxurious velour finish bathrobe for ultimate comfort.',
    price: '₹110.00',
    priceValue: 110,
    imageEmoji: '🧺',
    highlight: 'Velour',
    createdAt: 38,
    imageUrl: getImageForType('Bathrobe'),
  },
  {
    id: '39',
    name: 'Kimono Style Bathrobe',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bathrobe',
    productSubtype: 'Kimono Style Bathrobe',
    description: 'Elegant kimono-style bathrobe with wrap-around design.',
    price: '₹90.00',
    priceValue: 90,
    imageEmoji: '🧺',
    highlight: 'Kimono Style',
    createdAt: 39,
    imageUrl: getImageForType('Bathrobe'),
  },
  {
    id: '40',
    name: 'Microfiber Bathrobe',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bathrobe',
    productSubtype: 'Microfiber Bathrobe',
    description: 'Lightweight and quick-drying microfiber bathrobe.',
    price: '₹70.00',
    priceValue: 70,
    imageEmoji: '🧺',
    highlight: 'Quick Dry',
    createdAt: 40,
    imageUrl: getImageForType('Bathrobe'),
  },
  {
    id: '41',
    name: 'Kids Bathrobe',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bathrobe',
    productSubtype: 'Kids Bathrobe',
    description: 'Adorable bathrobe designed for children. Soft and comfortable.',
    price: '₹55.00',
    priceValue: 55,
    imageEmoji: '🧺',
    highlight: 'Kids',
    createdAt: 41,
    imageUrl: getImageForType('Bathrobe'),
  },
  {
    id: '42',
    name: 'Lightweight Summer Bathrobe',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bathrobe',
    productSubtype: 'Lightweight Summer Bathrobe',
    description: 'Breathable summer bathrobe perfect for warm weather.',
    price: '₹65.00',
    priceValue: 65,
    imageEmoji: '🧺',
    highlight: 'Summer',
    createdAt: 42,
    imageUrl: getImageForType('Bathrobe'),
  },
  {
    id: '43',
    name: 'Plush Winter Bathrobe',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bathrobe',
    productSubtype: 'Plush Winter Bathrobe',
    description: 'Extra warm and plush bathrobe for cold winter days.',
    price: '₹105.00',
    priceValue: 105,
    imageEmoji: '🧺',
    highlight: 'Winter',
    createdAt: 43,
    imageUrl: getImageForType('Bathrobe'),
  },
  // Bath Towel subtypes
  {
    id: '44',
    name: 'Organic Cotton Bath Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    productSubtype: 'Organic Cotton Bath Towel',
    description: 'Eco-friendly organic cotton bath towel. Chemical-free and sustainable.',
    price: '₹50.00',
    priceValue: 50,
    imageEmoji: '🧺',
    highlight: 'Organic',
    createdAt: 44,
    imageUrl: getImageForType('Bath Towel'),
  },
  {
    id: '45',
    name: 'Zero-Twist Cotton Bath Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    productSubtype: 'Zero-Twist Cotton Bath Towel',
    description: 'Premium zero-twist cotton bath towel with exceptional softness.',
    price: '₹60.00',
    priceValue: 60,
    imageEmoji: '🧺',
    highlight: 'Zero-Twist',
    createdAt: 45,
    imageUrl: getImageForType('Bath Towel'),
  },
  {
    id: '46',
    name: 'Egyptian Cotton Bath Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    productSubtype: 'Egyptian Cotton Bath Towel',
    description: 'Luxurious Egyptian cotton bath towel. Known for its premium quality.',
    price: '₹65.00',
    priceValue: 65,
    imageEmoji: '🧺',
    highlight: 'Egyptian Cotton',
    createdAt: 46,
    imageUrl: getImageForType('Bath Towel'),
  },
  {
    id: '47',
    name: 'Spa Grade Bath Sheet',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    productSubtype: 'Spa Grade Bath Sheet (Extra Large)',
    description: 'Extra large spa-grade bath sheet for ultimate comfort and coverage.',
    price: '₹75.00',
    priceValue: 75,
    imageEmoji: '🧺',
    highlight: 'Extra Large',
    createdAt: 47,
    imageUrl: getImageForType('Bath Towel'),
  },
  // Beach Towel subtypes
  {
    id: '48',
    name: 'Hooded Beach Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Beach Towel',
    productSubtype: 'Hooded Beach Towel',
    description: 'Beach towel with built-in hood for sun protection.',
    price: '₹62.00',
    priceValue: 62,
    imageEmoji: '🧺',
    highlight: 'Hooded',
    createdAt: 48,
    imageUrl: getImageForType('Beach Towel'),
  },
  {
    id: '49',
    name: 'Sand-Resistant Microfiber Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Beach Towel',
    productSubtype: 'Sand-Resistant Microfiber Towel',
    description: 'Microfiber beach towel that repels sand and dries quickly.',
    price: '₹50.00',
    priceValue: 50,
    imageEmoji: '🧺',
    highlight: 'Sand-Resistant',
    createdAt: 49,
    imageUrl: getImageForType('Beach Towel'),
  },
  {
    id: '50',
    name: 'Velour Beach Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Beach Towel',
    productSubtype: 'Velour Beach Towel',
    description: 'Luxurious velour beach towel with plush texture.',
    price: '₹68.00',
    priceValue: 68,
    imageEmoji: '🧺',
    highlight: 'Velour',
    createdAt: 50,
    imageUrl: getImageForType('Beach Towel'),
  },
  // Kitchen Towel subtypes
  {
    id: '51',
    name: 'Microfiber Kitchen Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Kitchen Towel',
    productSubtype: 'Microfiber Kitchen Towel',
    description: 'Highly absorbent microfiber kitchen towel for efficient cleaning.',
    price: '₹20.00',
    priceValue: 20,
    imageEmoji: '🧺',
    createdAt: 51,
    imageUrl: getImageForType('Kitchen Towel'),
  },
  {
    id: '52',
    name: 'Utility Cleaning Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Kitchen Towel',
    productSubtype: 'Utility Cleaning Towel',
    description: 'Versatile utility towel for kitchen and household cleaning.',
    price: '₹18.00',
    priceValue: 18,
    imageEmoji: '🧺',
    createdAt: 52,
    imageUrl: getImageForType('Kitchen Towel'),
  },
  {
    id: '53',
    name: 'Printed Decorative Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Kitchen Towel',
    productSubtype: 'Printed Decorative Towel',
    description: 'Beautifully printed decorative kitchen towel for stylish kitchens.',
    price: '₹24.00',
    priceValue: 24,
    imageEmoji: '🧺',
    highlight: 'Decorative',
    createdAt: 53,
    imageUrl: getImageForType('Kitchen Towel'),
  },
  {
    id: '54',
    name: 'Cotton Linen Blend Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Kitchen Towel',
    productSubtype: 'Cotton Linen Blend Towel',
    description: 'Premium cotton-linen blend kitchen towel. Durable and absorbent.',
    price: '₹26.00',
    priceValue: 26,
    imageEmoji: '🧺',
    highlight: 'Linen Blend',
    createdAt: 54,
    imageUrl: getImageForType('Kitchen Towel'),
  },
  {
    id: '55',
    name: 'Absorbent Food-Safe Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Kitchen Towel',
    productSubtype: 'Absorbent Food-Safe Towel',
    description: 'Food-safe kitchen towel perfect for food preparation areas.',
    price: '₹22.00',
    priceValue: 22,
    imageEmoji: '🧺',
    highlight: 'Food-Safe',
    createdAt: 55,
    imageUrl: getImageForType('Kitchen Towel'),
  },
  // Napkin subtypes
  {
    id: '56',
    name: 'Linen Napkin',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Napkin',
    productSubtype: 'Linen Napkin',
    description: 'Elegant linen napkins for sophisticated dining experiences.',
    price: '₹28.00',
    priceValue: 28,
    imageEmoji: '🧺',
    highlight: 'Linen',
    createdAt: 56,
    imageUrl: getImageForType('Napkin'),
  },
  {
    id: '57',
    name: 'Printed Decorative Napkin',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Napkin',
    productSubtype: 'Printed / Decorative Napkin',
    description: 'Beautifully printed decorative napkins to enhance your table setting.',
    price: '₹25.00',
    priceValue: 25,
    imageEmoji: '🧺',
    highlight: 'Decorative',
    createdAt: 57,
    imageUrl: getImageForType('Napkin'),
  },
  {
    id: '58',
    name: 'Recyclable Disposable Napkin',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Napkin',
    productSubtype: 'Recyclable / Disposable Napkin',
    description: 'Eco-friendly recyclable disposable napkins for events and parties.',
    price: '₹8.00',
    priceValue: 8,
    imageEmoji: '🧺',
    highlight: 'Disposable',
    createdAt: 58,
    imageUrl: getImageForType('Napkin'),
  },
  {
    id: '59',
    name: 'Cocktail Napkin',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Napkin',
    productSubtype: 'Cocktail Napkin',
    description: 'Small cocktail napkins perfect for drinks and appetizers.',
    price: '₹12.00',
    priceValue: 12,
    imageEmoji: '🧺',
    highlight: 'Cocktail',
    createdAt: 59,
    imageUrl: getImageForType('Napkin'),
  },
  // Terry Kitchen Towel subtypes
  {
    id: '60',
    name: 'Striped Terry Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Terry Kitchen Towel',
    productSubtype: 'Striped Terry Towel',
    description: 'Classic striped terry kitchen towel with timeless design.',
    price: '₹30.00',
    priceValue: 30,
    imageEmoji: '🧺',
    highlight: 'Striped',
    createdAt: 60,
    imageUrl: getImageForType('Terry Kitchen Towel'),
  },
  {
    id: '61',
    name: 'Plain Terry Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Terry Kitchen Towel',
    productSubtype: 'Plain Terry Towel',
    description: 'Simple and elegant plain terry kitchen towel.',
    price: '₹26.00',
    priceValue: 26,
    imageEmoji: '🧺',
    createdAt: 61,
    imageUrl: getImageForType('Terry Kitchen Towel'),
  },
  {
    id: '62',
    name: 'Printed Pattern Terry Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Terry Kitchen Towel',
    productSubtype: 'Printed / Pattern Terry Towel',
    description: 'Beautifully patterned terry kitchen towel with vibrant designs.',
    price: '₹32.00',
    priceValue: 32,
    imageEmoji: '🧺',
    highlight: 'Patterned',
    createdAt: 62,
    imageUrl: getImageForType('Terry Kitchen Towel'),
  },
  {
    id: '63',
    name: 'Hanging Loop Terry Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Terry Kitchen Towel',
    productSubtype: 'Hanging Loop Terry Towel',
    description: 'Terry kitchen towel with convenient hanging loop for easy storage.',
    price: '₹28.00',
    priceValue: 28,
    imageEmoji: '🧺',
    highlight: 'Hanging Loop',
    createdAt: 63,
    imageUrl: getImageForType('Terry Kitchen Towel'),
  },
  {
    id: '64',
    name: 'Industrial Commercial Grade Terry Towels',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Terry Kitchen Towel',
    productSubtype: 'Industrial / Commercial Grade Terry Towels',
    description: 'Heavy-duty commercial grade terry towels for industrial use.',
    price: '₹40.00',
    priceValue: 40,
    imageEmoji: '🧺',
    highlight: 'Commercial Grade',
    createdAt: 64,
    imageUrl: getImageForType('Terry Kitchen Towel'),
  },
  {
    id: '5',
    name: 'Organic Cow Dung Cakes',
    category: 'Cow Dung Products',
    categorySlug: 'cow-dung',
    productType: 'Cow Dung Cakes',
    description: 'Traditional handmade cow dung cakes for rituals and eco-friendly purposes.',
    price: '₹12.00',
    priceValue: 12,
    imageEmoji: '🌿',
    highlight: 'Traditional',
    createdAt: 5,
  },
  {
    id: '6',
    name: 'Aromatic Dhoop Sticks',
    category: 'Cow Dung Products',
    categorySlug: 'cow-dung',
    productType: 'Dhoop Sticks',
    description: 'Pure organic dhoop sticks made from cow dung and natural herbs.',
    price: '₹15.00',
    priceValue: 15,
    imageEmoji: '🌿',
    highlight: 'Pure & Organic',
    createdAt: 6,
  },
  {
    id: '7',
    name: 'Natural Incense Cones',
    category: 'Cow Dung Products',
    categorySlug: 'cow-dung',
    productType: 'Incense Cones',
    description: 'Handcrafted incense cones with natural fragrances. Chemical-free.',
    price: '₹10.00',
    priceValue: 10,
    imageEmoji: '🌿',
    createdAt: 7,
  },
  {
    id: '8',
    name: 'Organic Fertilizer Pellets',
    category: 'Cow Dung Products',
    categorySlug: 'cow-dung',
    productType: 'Fertilizer',
    description: 'Rich organic fertilizer made from processed cow dung. Perfect for gardens.',
    price: '₹25.00',
    priceValue: 25,
    imageEmoji: '🌿',
    createdAt: 8,
  },
];

// Towel types and their subtypes - exported for use in AdminPage
export const towelTypesData: Record<string, { name: string; subtypes: string[] }> = {
  'Face Towel': {
    name: 'Face Towel',
    subtypes: [
      'Cotton Face Towel',
      'Microfiber Face Towel',
      'Makeup Removal Towel',
      'Quick-Dry Face Towel',
      'Organic Cotton Face Towel',
      'Bamboo Face Towel',
      'Anti-Bacterial / Charcoal Infused Towel'
    ]
  },
  'All-Purpose Towels': {
    name: 'All-Purpose Towels',
    subtypes: [
      'Microfiber Cleaning Towel',
      'Utility Towel',
      'Multi-Use Terry Towel',
      'Gym / Sports Towel',
      'Sweat Absorbent Towel',
      'Car Cleaning Cloth'
    ]
  },
  'Bathrobe': {
    name: 'Bathrobe',
    subtypes: [
      'Terry Cotton Bathrobe',
      'Waffle Weave Bathrobe',
      'Hooded Bathrobe',
      'Luxury Spa / Hotel Bathrobe',
      'Velour Finish Bathrobe',
      'Kimono Style Bathrobe',
      'Microfiber Bathrobe',
      'Kids Bathrobe',
      'Lightweight Summer Bathrobe',
      'Plush Winter Bathrobe'
    ]
  },
  'Bath Towel': {
    name: 'Bath Towel',
    subtypes: [
      'Regular Terry Bath Towel',
      'Premium / Luxury Hotel Bath Towel',
      'Microfiber Quick-Dry Bath Towel',
      'Bamboo Bath Towel',
      'Organic Cotton Bath Towel',
      'Zero-Twist Cotton Bath Towel',
      'Turkish Cotton Bath Towel',
      'Egyptian Cotton Bath Towel',
      'Gym / Sports Bath Towel',
      'Spa Grade Bath Sheet (Extra Large)'
    ]
  },
  'Beach Towel': {
    name: 'Beach Towel',
    subtypes: [
      'Printed Beach Towel',
      'Round Beach Towel',
      'Hooded Beach Towel',
      'Sand-Resistant Microfiber Towel',
      'Velour Beach Towel',
      'Kids Beach Towel',
      'Travel Quick-Dry Beach Towel'
    ]
  },
  'Kitchen Towel': {
    name: 'Kitchen Towel',
    subtypes: [
      'Terry Kitchen Towel',
      'Waffle Knit Kitchen Towel',
      'Microfiber Kitchen Towel',
      'Dish Drying Towel',
      'Utility Cleaning Towel',
      'Printed Decorative Towel',
      'Cotton Linen Blend Towel',
      'Absorbent Food-Safe Towel'
    ]
  },
  'Napkin': {
    name: 'Napkin',
    subtypes: [
      'Dinner Table Napkin',
      'Cotton Cloth Napkin',
      'Linen Napkin',
      'Printed / Decorative Napkin',
      'Recyclable / Disposable Napkin',
      'Restaurant Fine-Dining Napkin',
      'Cocktail Napkin'
    ]
  },
  'Terry Kitchen Towel': {
    name: 'Terry Kitchen Towel',
    subtypes: [
      'Heavy Absorbent Terry Cloth Towel',
      'Striped Terry Towel',
      'Plain Terry Towel',
      'Printed / Pattern Terry Towel',
      'Hanging Loop Terry Towel',
      'Industrial / Commercial Grade Terry Towels'
    ]
  }
};

interface ProductsPageProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact' | 'admin') => void;
}

export default function ProductsPage({ onNavigate }: ProductsPageProps = {}) {
  // Check if we should go directly to products view (from homepage card click)
  const shouldShowProductsDirectly = sessionStorage.getItem('navigateToProducts') === 'true';
  const savedCategory = sessionStorage.getItem('selectedCategory') || 'all';
  const [viewMode, setViewMode] = useState<'categories' | 'products'>(shouldShowProductsDirectly ? 'products' : 'categories');
  const [selectedCategory, setSelectedCategory] = useState(savedCategory);
  
  // Clear the flags after using them
  useEffect(() => {
    if (shouldShowProductsDirectly) {
      sessionStorage.removeItem('navigateToProducts');
      sessionStorage.removeItem('selectedCategory');
    }
  }, [shouldShowProductsDirectly]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTowelType, setSelectedTowelType] = useState<string>('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        if (snapshot.empty) {
          setProducts(demoProducts);
        } else {
          const list: Product[] = snapshot.docs.map((d) => {
            const data = d.data() as any;
            const imageFromType = getImageForType(data.productType ?? '');

            let priceValue = Number(data.priceValue);
            if (Number.isNaN(priceValue)) {
              const numericFromString = parseFloat(String(data.price || '').replace(/[^0-9.]/g, ''));
              priceValue = Number.isNaN(numericFromString) ? 0 : numericFromString;
            }
            const priceString = data.price
              ? String(data.price).replace(/^\$/, '₹')
              : `₹${priceValue.toFixed(2)}`;

            return {
              // Use Firestore document ID to guarantee uniqueness
              id: d.id,
              name: data.name ?? '',
              category: data.category ?? '',
              categorySlug: data.categorySlug ?? 'towels',
              productType: data.productType ?? '',
              productSubtype: data.productSubtype,
              description: data.description ?? '',
              price: priceString,
              priceValue,
              imageEmoji: data.imageEmoji ?? '🧺',
              highlight: data.highlight,
              createdAt: data.createdAt ?? 0,
              imageUrl: data.imageUrl ?? imageFromType,
            };
          });
          setProducts(list);
        }
      } catch (err: any) {
        console.error('Failed to load products from Firestore', err);
        setLoadError(err.message || 'Failed to load products');
        setProducts(demoProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    });
    return unsubscribe;
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.categorySlug === selectedCategory);
    }

    // Filter by main towel type if selected
    if (selectedCategory === 'towels' && selectedTowelType) {
      filtered = filtered.filter((p) => p.productType === selectedTowelType);
    }

    // Filter by subtype if selected
    if (selectedType !== 'all') {
      // Filter by subtype if it exists, otherwise by productType
      filtered = filtered.filter((p) => 
        (p.productSubtype && p.productSubtype === selectedType) || 
        (!p.productSubtype && p.productType === selectedType)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }

    const sorted = [...filtered];

    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return sorted;
  }, [products, selectedCategory, selectedTowelType, selectedType, sortBy, searchQuery]);

  const handleReset = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedTowelType('');
    setSortBy('newest');
    setSearchQuery('');
  };

  const towelTypes = Object.keys(towelTypesData);
  const cowDungTypes = ['Cow Dung Cakes', 'Dhoop Sticks', 'Incense Cones', 'Fertilizer'];
  
  // Get available types based on category and selected towel type
  const availableTypes = useMemo(() => {
    if (selectedCategory === 'towels') {
      if (selectedTowelType && towelTypesData[selectedTowelType]) {
        return towelTypesData[selectedTowelType].subtypes;
      }
      return []; // Show empty if no towel type selected (subtypes will show in dropdown)
    } else if (selectedCategory === 'cow-dung') {
      return cowDungTypes;
    }
    return [];
  }, [selectedCategory, selectedTowelType]);

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setViewMode('products');
  };

  const categories = [
    {
      id: 'towels',
      name: 'Towels',
      emoji: '🧺',
      description: 'Premium export-quality cotton towels',
      slug: 'towels',
      image: '/towel/Towelmain/banner.jpg',
    },
    {
      id: 'cow-dung',
      name: 'Cow Dung Products',
      emoji: '🌿',
      description: 'Organic cow dung cakes & dhoop',
      slug: 'cow-dung',
      image: '/cow dung/cowbanner/banner.jpg',
    },
  ];

  if (viewMode === 'categories') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation onNavigate={onNavigate} />
        <div className="pt-16 pb-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Products</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Discover our range of premium export products carefully sourced and crafted for quality and sustainability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategorySelect(category.slug)}
                  className="group bg-white rounded-xl border-2 border-gray-200 hover:border-amber-500 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{category.name}</h3>
                    <p className="text-slate-600">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onNavigate={onNavigate} />

      <div className="pt-4">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Management Product</h1>
                <p className="text-slate-600 text-xs md:text-sm">Add Product to your store</p>
              </div>
              <button
                onClick={() => {
                  setViewMode('categories');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setSelectedTowelType('');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 text-xs md:text-sm text-slate-600 hover:text-slate-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                ← Back
              </button>
            </div>

            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => {
                setSelectedCategory(cat);
                setSelectedType('all');
                setSelectedTowelType('');
              }}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              availableTypes={availableTypes}
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTowelType={selectedTowelType}
              onTowelTypeChange={setSelectedTowelType}
              towelTypes={towelTypes}
            />
            {loadError && (
              <div className="text-sm text-red-600 mt-2">
                {loadError}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            {isLoading ? (
              <p className="text-sm text-slate-600">Loading products...</p>
            ) : filteredAndSortedProducts.length === 0 ? (
              <EmptyState onReset={handleReset} />
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-xs md:text-sm text-slate-600">
                    Showing {filteredAndSortedProducts.length} product
                    {filteredAndSortedProducts.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      name={product.name}
                      category={product.category}
                      description={product.description}
                      price={product.price}
                      imageEmoji={product.imageEmoji}
                      imageUrl={product.imageUrl}
                      highlight={product.highlight}
                      showAdminControls={isAdmin}
                      onEdit={() => onNavigate?.('admin')}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Product detail modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedProduct(null)}
          ></div>
          <div className="relative z-[1051] w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Image left */}
              <div className="md:w-1/2 relative">
                {selectedProduct.imageUrl ? (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-64 md:h-full flex items-center justify-center bg-slate-100 text-7xl">
                    {selectedProduct.imageEmoji}
                  </div>
                )}
                {/* Mobile close button - over image */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition md:hidden"
                  aria-label="Close product details"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
              {/* Info right */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                      {selectedProduct.category}
                    </p>
                    <h2 className="mt-1 text-2xl md:text-3xl font-bold text-slate-900">
                      {selectedProduct.name}
                    </h2>
                    {selectedProduct.productType && (
                      <p className="mt-1 text-sm text-slate-600">
                        Type: <span className="font-semibold">{selectedProduct.productType}</span>
                      </p>
                    )}
                  </div>
                  {/* Desktop close button - top right of content card */}
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="hidden md:inline-flex p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
                    aria-label="Close product details"
                  >
                    <span className="sr-only">Close</span>
                    ✕
                  </button>
                </div>

                {selectedProduct.highlight && (
                  <span className="inline-flex self-start rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {selectedProduct.highlight}
                  </span>
                )}

                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Price</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedProduct.price}</p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p>Category: {selectedProduct.category}</p>
                    {selectedProduct.productType && <p>Type: {selectedProduct.productType}</p>}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-semibold hover:bg-slate-800 transition"
                  >
                    Enquire Now
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        onNavigate?.('admin');
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-amber-500 text-amber-800 px-4 py-2 text-sm font-semibold hover:bg-amber-50 transition"
                    >
                      Edit in Admin Panel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
