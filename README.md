<h1 align="center">E-Commerce MERN Stack Application 🛒</h1>

## Overview

This is a full-stack E-Commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). It provides a complete end-to-end shopping experience, from browsing products to secure checkout, along with a comprehensive admin dashboard for store management.

## Key Features

- **Robust Authentication:** Secure user signup and login using JWT (JSON Web Tokens) with access and refresh tokens.
- **Payment Gateway Integration:** Seamless and secure checkout process powered by Stripe.
- **Product & Category Management:** Create, update, and manage products and categories via a dedicated Admin Dashboard.
- **Shopping Cart System:** Fully functional cart with persistent state and real-time total calculation.
- **Coupons & Discounts:** Built-in dynamic coupon code system for promotional offers.
- **Performance Optimization:** Integrated Redis caching for lightning-fast database queries and response times.
- **Sales Analytics:** Track revenue and order statistics directly from the admin interface.
- **Modern UI/UX:** Responsive, aesthetically pleasing design built with Tailwind CSS.
- **Secure Data:** Comprehensive data protection and state-of-the-art security practices.

### Setup .env file

```bash
PORT=5000
MONGO_URI=your_mongo_uri

UPSTASH_REDIS_URL=your_redis_url

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Run this app locally

```shell
npm run build
```

### Start the app

```shell
npm run start
```
