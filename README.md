# 🌟 TinyTag - URL Shortener & QR Code Generator  

TinyTag is a simple yet powerful tool that allows users to **shorten URLs** and **generate QR codes** with custom aliases. Whether you need a quick link for social sharing or a scannable QR for offline access, TinyTag has you covered!  

🚀 **Live Demo:** [tiny-tag.vercel.app](https://tiny-tag.vercel.app)  

---

## ✨ Features  

✅ **Custom URL Aliases** – Create short, easy-to-remember links.  
✅ **QR Code Generation** – Generate QR codes instantly for any URL.  
✅ **Analytics** – Track the number of times a link has been accessed.  
✅ **Fast & Reliable** – Powered by Firebase for seamless performance.  

---

## 🛠 Tech Stack  

- **Frontend:** React (Vite), Tailwind CSS  
- **Backend:** Node.js (Express)  
- **Database:** Firebase  
- **Hosting:** Vercel (Frontend), Render (Backend)  

---

## 🏗️ Installation & Setup  

### 🔧 Prerequisites  
Make sure you have the following installed:  
- **Node.js** (v16+)  
- **npm** or **yarn**  
- **Firebase Account**  

### 📥 Clone the Repository  

```bash
git clone https://github.com/your-username/tinytag.git
cd tinytag
```

### 🔨 Install Dependencies

```bash
# For frontend
cd frontend
npm install   # or yarn install

# For backend
cd server
npm install   # or yarn install
```
### 🔑 Set Up Firebase

- Create a Firebase Project.
- Enable Firestore Database and Authentication if needed.
- Get your Firebase config keys and create a .env file in the server directory:

```bash
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### 🚀 Start the Development Server

```bash
# Start the frontend
cd client
npm run dev   # or yarn dev

# Start the backend
cd ../server
npm start   # or yarn start
```
gg