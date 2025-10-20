🎮 GameStore - Modern E-Commerce Platform

A sleek, high-performance web application for browsing and purchasing video games, inspired by modern digital storefronts.

This project is a feature-rich demonstration of a modern e-commerce storefront, built from the ground up with a focus on polished user experience, clean architecture, and exceptional performance.

📸 Screenshots

Home Page (Epic Games Style Hero)

Product Detail Page (Trailer & Details)



Add your detail page screenshot here

Browse & Filter Games

Branded Login Page





✨ Core Features

Dynamic Hero Section: An immersive, auto-rotating hero banner inspired by the Epic Games Store, featuring trending games and high-quality artwork.

Advanced Search: A fast, fuzzy search powered by Fuse.js, accessible via a "/" keyboard shortcut, with instant type-ahead results.

Comprehensive Game Catalog: Browse, filter, and sort a large library of games with detailed product cards, deals, and free-to-play sections.

Guest Browsing & Authentication: Users can freely browse the store and are prompted to sign in only when performing actions like adding to the cart.

Rich Product Detail Pages: Dynamically generated pages featuring auto-playing trailers, an interactive media gallery, AI-generated descriptions, and detailed system requirements.

Shopping Cart & Preview: A persistent shopping cart with a mini-preview accessible from the navigation bar.

Mock API Backend: Utilizes Mock Service Worker (MSW) to simulate a real-world API, ensuring a realistic development and testing experience.

Exceptional Performance: Achieves outstanding Lighthouse scores, verified by running tests on a production build.

Fully Responsive: A beautiful, mobile-first design that adapts seamlessly to all screen sizes.

🚀 Tech Stack

Category

Technology

Framework

React 18, TypeScript

Bundler

Vite

Styling

Tailwind CSS

Routing

React Router v6

Server State

TanStack Query (React Query)

Client State

Zustand

Animations

Framer Motion

Fuzzy Search

Fuse.js

API Mocking

Mock Service Worker (MSW)

UI Components

Headless UI

⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

Clone the repository:

git clone [https://github.com/PriyanshuPilkhwal/Gamming-E-comerce.git](https://github.com/PriyanshuPilkhwal/Gamming-E-comerce.git)
cd Gamming-E-comerce


Install NPM packages:

npm install


Generate the MSW Service Worker:
This step is required for the mock API to function.

npx msw init public/ --save


Run the development server:

npm run dev


The application will be available at http://localhost:5173.

📈 Performance Testing

To replicate the high Lighthouse scores, run a production build:

Build for production:

npm run build


Preview the production build:

npm run preview


Then, use the Lighthouse tab in your browser's developer tools to analyze the preview URL.