#  Zimer

### Find a place. Find your people. Start your next chapter.

**Zimer** is a rental discovery platform built for **students and working professionals**, making it easier to discover, compare, and find suitable **PGs, hostels, and rental accommodations**.

---

##  About Zimer

Finding affordable and suitable accommodation can be frustrating—especially for students and young professionals moving to a new city.

Zimer aims to simplify this process by bringing accommodation listings into one platform where users can:

*  Discover PGs, hostels & rental properties
*  Explore properties based on location
*  View detailed property information
*  Compare rental options
*  Connect with property owners
*  Save properties they're interested in
*  Access the platform across devices

Our goal is to make finding a place to live **faster, simpler, and more transparent**.

---

##  Features

###  For Tenants

* Search and discover accommodations
* Filter properties based on requirements
* View property details and amenities
* Explore rooms and availability
* Save preferred properties
* Contact property owners

###  For Property Owners

* Create and manage property listings
* Add rooms and accommodation details
* Upload property images
* Manage availability
* Reach potential tenants directly

###  Platform

* Secure authentication
* Role-based access
* Property management
* Image uploads
* Responsive interface
* RESTful API architecture

---

##  Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* GSAP

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer

### Tools & Services

* MongoDB Atlas
* Git & GitHub
* REST APIs

---

---

##  Project Structure

```text
Zimer/
│
├── client/              # React frontend
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/              # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── ...
│
├── README.md
└── package.json
```

---

##  Authentication

Zimer uses **JWT-based authentication** to securely manage users and their sessions.

Different user roles can access functionality specific to their requirements.

```text
User
 │
 ▼
Login / Register
 │
 ▼
JWT Authentication
 │
 ▼
Role Verification
 │
 ├── Tenant
 │
 └── Property Owner
```

---

##  Roadmap

Zimer is actively evolving. 

* [x] User authentication
* [x] Property listings
* [x] Property owner management
* [x] Room management
* [x] Image uploads
* [x] Responsive web interface
* [ ] Advanced property filtering
* [ ] Location-based discovery
* [ ] Online booking
* [ ] Payment integration
* [ ] Reviews & ratings
* [ ] Zimer mobile application
* [ ] AI-powered property recommendations

---

##  Vision

> **Make finding a home in a new city as simple as finding anything else online.**

Zimer is starting with students and young professionals, with the long-term goal of building a comprehensive rental ecosystem across cities.

---

##  Contributing

Zimer is currently under active development.

If you'd like to contribute, feel free to fork the repository, create a feature branch, and submit a pull request.

```bash
git clone https://github.com/kshit273/zimer.git

cd zimer

npm install

npm run dev
```

---

**Zimer** — Building a simpler way to find your next home.

⭐ If you find this project interesting, consider giving the repository a star!
