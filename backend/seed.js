const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const User = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection successful');

    await User.deleteMany({});
    await Product.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await User.collection.insertOne({
      name: 'Artloop Admin',
      email: 'admin@artloop.com',
      password: hashedPassword,
      role: 'admin',
      wishlist: [],
      createdAt: new Date()
    });

    const artisanId = admin.insertedId;
    console.log('Admin created');

    await Product.insertMany([
      { name: 'Madhubani Painting', price: 1200, category: 'Paintings', description: 'Traditional hand-painted Madhubani art from Bihar', images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400'], stock: 10, artisanId },
      { name: 'Warli Canvas Art', price: 950, category: 'Paintings', description: 'Tribal Warli art from Maharashtra', images: ['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=400'], stock: 8, artisanId },
      { name: 'Kundan Necklace', price: 3500, category: 'Jewelry', description: 'Handcrafted Kundan necklace from Rajasthan', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'], stock: 5, artisanId },
      { name: 'Silver Jhumkas', price: 1200, category: 'Jewelry', description: 'Traditional silver earrings from Rajasthan', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'], stock: 15, artisanId },
      { name: 'Banarasi Silk Saree', price: 8000, category: 'Handloom', description: 'Pure Banarasi silk saree from Varanasi', images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'], stock: 3, artisanId },
      { name: 'Kantha Stitch Dupatta', price: 1800, category: 'Handloom', description: 'Hand-embroidered Kantha dupatta from Bengal', images: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400'], stock: 7, artisanId },
      { name: 'Warli Wall Hanging', price: 750, category: 'Home Decor', description: 'Handpainted Warli wall art', images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400'], stock: 10, artisanId },
      { name: 'Dhokra Lamp', price: 2200, category: 'Home Decor', description: 'Brass Dhokra craft lamp from Odisha', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'], stock: 4, artisanId },
      { name: 'Dokra Figurine', price: 1800, category: 'Tribal Crafts', description: 'Ancient Dokra brass craft from Chhattisgarh', images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400'], stock: 6, artisanId },
      { name: 'Bamboo Basket', price: 450, category: 'Tribal Crafts', description: 'Hand-woven bamboo basket from Nagaland', images: ['https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?w=400'], stock: 20, artisanId },
      { name: 'Blue Pottery Vase', price: 650, category: 'Pottery', description: 'Traditional blue pottery from Jaipur', images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400'], stock: 12, artisanId },
      { name: 'Terracotta Pot', price: 350, category: 'Pottery', description: 'Hand-thrown terracotta pot from Manipur', images: ['https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?w=400'], stock: 25, artisanId }
    ]);

    console.log('✅ 12 products seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
