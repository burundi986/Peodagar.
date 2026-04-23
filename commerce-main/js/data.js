// Sample Products Data
const sampleProducts = [
  { id: 1, name: "Aether Watch", price: 18900, description: "Sapphire glass, premium leather strap.", category: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
  { id: 2, name: "Minimalist Backpack", price: 24900, description: "Water-resistant, laptop compartment.", category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
  { id: 3, name: "Wireless Headphones", price: 14500, description: "Noise cancellation, 30h battery.", category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
  { id: 4, name: "Ceramic Mug Set", price: 5600, description: "Handcrafted matte finish.", category: "Home & Living", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop" },
  { id: 5, name: "Leather Cardholder", price: 7900, description: "Premium Italian leather.", category: "Accessories", image: "https://images.unsplash.com/photo-1606768666853-403c90a981ad?w=400&h=400&fit=crop" },
  { id: 6, name: "Desk Lamp Pro", price: 12500, description: "Adjustable brightness.", category: "Home & Living", image: "https://images.unsplash.com/photo-1534073737927-85f1aebfd097?w=400&h=400&fit=crop" }
];

// Sample Orders Data
const sampleOrders = [
  { id: 1001, customer: "John Doe", items: [{ name: "Aether Watch", quantity: 1 }], total: 18900, status: "pending", date: "2025-01-15" },
  { id: 1002, customer: "Jane Smith", items: [{ name: "Wireless Headphones", quantity: 2 }], total: 29000, status: "shipped", date: "2025-01-14" },
  { id: 1003, customer: "Mike Johnson", items: [{ name: "Minimalist Backpack", quantity: 1 }], total: 24900, status: "delivered", date: "2025-01-12" }
];

// Initialize localStorage with sample data if empty
if (!localStorage.getItem('products')) {
  localStorage.setItem('products', JSON.stringify(sampleProducts));
}
if (!localStorage.getItem('orders')) {
  localStorage.setItem('orders', JSON.stringify(sampleOrders));
}