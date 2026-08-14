# 💎 Luxe Magnate — Developer Setup & Onboarding Guide

Welcome to the **Luxe Magnate** codebase! Follow this quick step-by-step guide to configure and launch your high-end AI E-Commerce platform.

---

## 🛠️ Quick Start & Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (v18.0.0 or higher)
* **npm** or **yarn**

### 2. Install Dependencies
Open your terminal in the root directory of the project and run:
```bash
npm install
```

### 3. Environment Variables
Copy the example environment file and configure your keys:
```bash
cp .env.example .env
```
Fill in `.env` with your Supabase, Stripe, and Lovable/Gemini API credentials. If you skip this, the app will run in **MOCK MODE**, simulating data for demo purposes.

### 4. Start Development Server
Run the local dev server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🚀 Building for Production
To build the app for production deployment:
```bash
npm run build
```
You can then start the production server with:
```bash
npm start
```
