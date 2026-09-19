<div align="center">
  <h1>🎉 Toyingiz Qayerda? (Where is your wedding?)</h1>
  <p><strong>A comprehensive platform for finding and booking wedding halls (Toyxona)</strong></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>
</div>

---

## 📖 About the Project

**Toyingiz Qayerda** is a full-stack web application designed to simplify the process of finding, comparing, and booking wedding halls (Toyxona). The platform connects venue owners with potential customers, providing a seamless booking experience.

Whether you are a customer looking for the perfect venue, a venue owner managing your business, or an administrator overseeing the platform, this application provides dedicated interfaces and tools for everyone.

---

## ✨ Key Features

### 👤 For Users (Customers)
- **Browse Venues:** Explore a wide range of wedding halls with detailed descriptions, images, and pricing.
- **Interactive Map:** Find venues based on their location using the integrated interactive map (`react-leaflet`).
- **Calendar & Availability:** Check available dates and book your preferred venue easily (`react-calendar`).
- **Contact Venue:** Directly send inquiries that are instantly forwarded via Telegram to the venue owner/admin.

### 🏢 For Venue Owners
- **Dashboard:** Manage your venue listings, update details, and upload photos.
- **Booking Management:** View and manage booking requests from customers.

### 👑 For Administrators
- **Platform Control:** Approve new venue listings, manage users, and oversee platform activity.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Routing:** React Router DOM
- **Maps:** Leaflet & React Leaflet
- **UI Components:** React Icons, Heroicons, React Slick (Carousel), React Calendar
- **Styling:** CSS / Tailwind CSS (Optional, based on setup)

### Backend
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (with `pg` driver)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **File Uploads:** Multer
- **Integrations:** Telegram Bot API (for instant notifications)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL installed and running

### 1. Clone the repository
```bash
git clone https://github.com/Ogabek-Mannonov/Toyingiz-Qayerda.git
cd Toyingiz-Qayerda
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and configure your environment variables:
```env
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```
Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

The application should now be running on `http://localhost:5173` (Frontend) and `http://localhost:5000` (Backend).

---

## 📸 Screenshots
*(Add screenshots of your application here to make your portfolio stand out!)*
- **Home Page**
- **Venue Details & Map**
- **User / Owner Dashboard**

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the MIT License.
