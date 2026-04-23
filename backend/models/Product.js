const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    // 🔹 Images (support multiple images)
    images: [
      {
        type: String,
        required: true,
      },
    ],

    // 🔹 Category
    category: {
      type: String,
      required: true,
      enum: ['Paintings', 'Jewelry', 'Handloom', 'Home Decor', 'Tribal Crafts', 'Pottery'],
    },

    // 🔹 Artisan Info
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    artisanName: {
      type: String,
    },

    // 🔹 Cultural Storytelling (VERY IMPORTANT)
    origin: {
      type: String, // e.g., "Andhra Pradesh"
    },
    tradition: {
      type: String, // e.g., "Warli Art"
    },
    culturalMeaning: {
      type: String,
    },
    regionTag: {
      type: String, // e.g., "Madhubani", "Tribal"
    },

    // 🔹 Authenticity
    isAuthentic: {
      type: Boolean,
      default: true,
    },

    // 🔹 Stock
    stock: {
      type: Number,
      default: 10,
    },

    // 🔹 Reviews System
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    // 🔹 Future AI Support
    tags: [
      {
        type: String,
      },
    ],

    // 🔹 Created Time
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);