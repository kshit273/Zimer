# Zimer – PG Discovery & Management Platform

Zimer is a platform built for **tenants to find PGs** and for **landlords to manage their PG properties** efficiently. It provides tools for property listing, tenant management, authentication, reviews, and more.

For questions or collaboration: **kshitijsharma273@gmail.com**

---

## 🚀 Features

### Tenants
- Search and explore PGs  
- Save preferred PGs  
- View PG details, photos, and reviews  
- Manage profile and authentication  

### Landlords
- Create and manage PG listings  
- Update PG photos and property details  
- Manage tenant invites and removals  
- View tenant batches and landlord data  

---

## 📌 API Endpoints

Zimer APIs are split into many groups, two major groups are : **Auth** and **PG Management**.

---

# 🔐 Auth Routes (`/auth`)

```js
POST   /landlord/signup           // with profilePicture
POST   /tenant/signup             // with profilePicture
POST   /login
POST   /logout

PUT    /update                    // auth required, with profilePicture

GET    /me                        // auth required

POST   /tenants-batch             // auth required
GET    /saved-pgs                 // auth required
POST   /saved-pgs                 // auth required
PUT    /update-landlord-pgs       // auth required

POST   /landlord-data             // auth required
```

# 🔐 Auth Routes (`/auth`)

```js
POST   /:pgId/reviews                // auth required
GET    /:pgId/reviews

GET    /                              // get all PGs
GET    /:pgId                         // auth required
GET    /show-data/:pgId               // auth required
POST   /                              // auth required, file upload
PUT    /:id                           // auth required
PUT    /:id/photos                    // auth required, file upload

POST   /remove-tenants
POST   /generate-tenant-token
GET    /validate-invite/:RID/:roomId   // auth required
GET    /tenant-pg/:pgId                // auth required
```

# Screenshots

<img width="1897" height="1079" alt="image" src="https://github.com/user-attachments/assets/aabb977c-c253-431d-9c87-3c16e4cf9202" />
<img width="1897" height="1005" alt="image" src="https://github.com/user-attachments/assets/931634be-7cc2-4d3e-922a-2ba38358ff35" />
<img width="1897" height="996" alt="image" src="https://github.com/user-attachments/assets/d0a3e772-0a84-4659-ab5a-8d28ee06bed6" />
<img width="1895" height="994" alt="image" src="https://github.com/user-attachments/assets/5e33a3ff-f156-49a7-8b2c-a03589c3493c" />



