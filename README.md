# 🎨 ArtLoop - Connecting Hands to Homes

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Website-success?style=for-the-badge)](https://artloop-marketplace.vercel.app/) <!-- Replace this link with your actual live URL -->

ArtLoop is a premium full-stack MERN e-commerce marketplace dedicated to empowering rural Indian artisans. It provides a platform where authentic handcrafted art, jewelry, handloom, and tribal crafts can be sold directly to global customers, ensuring fair trade and preserving cultural heritage.

## 🚀 Live Project
**Live URL:** [https://artloop-marketplace.vercel.app/](https://artloop-marketplace.vercel.app/)  *(Update this with your actual deployed link)*

---

## ✨ Features

### 🛍️ For Customers
* **Beautiful User Interface:** A dynamic, premium shopping experience featuring smooth micro-animations (Framer Motion).
* **Curated Categories:** Browse through distinct Indian art forms (Paintings, Handloom, Pottery, Tribal Crafts, etc.).
* **Cart & Wishlist:** Fully functional global state management for adding items to your cart or saving them for later.
* **Verified Reviews:** Users can only leave reviews on products they have successfully purchased and received.
* **Real-time Stock Indicators:** See exactly how many units of a masterpiece are left before they sell out.

### 🏺 For Artisans
* **Dedicated Dashboard:** A secure, intuitive portal where artisans can manage their entire catalog.
* **Inventory Management:** Add new products, define cultural significance, set prices, and control exact stock levels.
* **Automated Stock Tracking:** When a customer buys a product, the inventory stock is automatically decremented.
* **Role-Based Access Control:** Artisans have a specialized view (e.g., hidden cart and wishlist icons since they are sellers, not buyers).

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS (Styling)
* Framer Motion (Animations)
* Lucide React (Icons)
* React Router DOM (Navigation)
* Context API (State Management for Auth, Cart, Wishlist)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Tokens (JWT) for secure Authentication
* bcryptjs (Password Hashing)

---

## 💻 Running the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/HarshithaPatel05/ArtLoop.git
cd ArtLoop
```

### 2. Setup the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add your environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

### 4. Open the App
Visit `http://localhost:5173` in your browser.

---

## 📸 Screenshots

*(You can drag and drop screenshots of your beautiful Homepage, Artisan Dashboard, and Product Pages here!)*

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
