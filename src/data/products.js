
export const products = [
  {
    id: "1",
    name: "Rainbow Unicorn T-shirt",
    price: 24.99,
    category: "Girls",
    ageGroup: "2-5y",
    image: "/placeholder.svg",
    description: "Adorable rainbow unicorn t-shirt made from 100% organic cotton. Perfect for your little one's everyday adventures."
  },
  {
    id: "2",
    name: "Dinosaur Print Shorts",
    price: 19.99,
    category: "Boys",
    ageGroup: "2-5y",
    image: "/placeholder.svg",
    description: "Cool and comfortable shorts with fun dinosaur prints. Features an elastic waistband and soft fabric."
  },
  {
    id: "3",
    name: "Soft Baby Booties",
    price: 14.99,
    category: "Shoes",
    ageGroup: "0-1y",
    image: "/placeholder.svg",
    description: "Super soft booties for newborns with non-slip soles and easy to put on design."
  },
  {
    id: "4",
    name: "Wooden Building Blocks",
    price: 29.99,
    category: "Toys",
    ageGroup: "1-3y",
    image: "/placeholder.svg",
    description: "Colorful wooden building blocks to develop motor skills and creativity. Set includes 20 pieces in different shapes."
  },
  {
    id: "5",
    name: "Bunny Ear Headband",
    price: 9.99,
    category: "Accessories",
    ageGroup: "2-5y",
    image: "/placeholder.svg",
    description: "Cute bunny ear headband made with soft fabric and comfortable fit. Perfect for parties or everyday wear."
  },
  {
    id: "6",
    name: "Newborn Gift Set",
    price: 39.99,
    category: "Newborn",
    ageGroup: "0-3m",
    image: "/placeholder.svg",
    description: "Complete newborn gift set including onesie, hat, mittens and booties. Made from organic materials."
  },
  {
    id: "7",
    name: "Space Explorer Pajamas",
    price: 27.99,
    category: "Boys",
    ageGroup: "5-8y",
    image: "/placeholder.svg",
    description: "Glow-in-the-dark space-themed pajamas. Soft and comfortable for a good night's sleep."
  },
  {
    id: "8",
    name: "Butterfly Flutter Dress",
    price: 32.99,
    category: "Girls",
    ageGroup: "5-8y",
    image: "/placeholder.svg",
    description: "Beautiful butterfly-themed dress with flutter sleeves. Perfect for special occasions."
  },
  {
    id: "9",
    name: "Light-up Sneakers",
    price: 34.99,
    category: "Shoes",
    ageGroup: "2-5y",
    image: "/placeholder.svg",
    description: "Fun sneakers with lights that activate when walking. Durable and comfortable for active kids."
  },
  {
    id: "10",
    name: "Musical Plush Elephant",
    price: 24.99,
    category: "Toys",
    ageGroup: "0-1y",
    image: "/placeholder.svg",
    description: "Soft plush elephant toy that plays gentle lullabies. Perfect for soothing your baby to sleep."
  },
  {
    id: "11",
    name: "Sun Hat with UV Protection",
    price: 16.99,
    category: "Accessories",
    ageGroup: "1-3y",
    image: "/placeholder.svg",
    description: "Wide-brimmed sun hat with UPF 50+ protection. Adjustable chin strap keeps it secure."
  },
  {
    id: "12",
    name: "Organic Cotton Romper",
    price: 22.99,
    category: "Newborn",
    ageGroup: "0-3m",
    image: "/placeholder.svg",
    description: "Buttery soft organic cotton romper with easy snap closures for quick diaper changes."
  }
];

export function getProductById(id) {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category) {
  return products.filter(product => product.category === category);
}

export function getProductsByAgeGroup(ageGroup) {
  return products.filter(product => product.ageGroup === ageGroup);
}

export function getFeaturedProducts(count = 4) {
  // In a real app, you might have a "featured" flag or use other criteria
  return products.slice(0, count);
}

export const categories = [
  { id: "girls", name: "Girls" },
  { id: "boys", name: "Boys" },
  { id: "shoes", name: "Shoes" },
  { id: "toys", name: "Toys" },
  { id: "accessories", name: "Accessories" },
  { id: "newborn", name: "Newborn" }
];

export const ageGroups = [
  { id: "0-3m", name: "0-3 Months" },
  { id: "0-1y", name: "0-1 Years" },
  { id: "1-3y", name: "1-3 Years" },
  { id: "2-5y", name: "2-5 Years" },
  { id: "5-8y", name: "5-8 Years" },
  { id: "8-12y", name: "8-12 Years" }
];
