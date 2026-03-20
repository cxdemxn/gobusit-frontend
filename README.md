# GoBusIt Frontend

The GoBusIt frontend provides the user interface for the transport system.

It displays routes, schedules, and live bus positions on a map and allows passengers to book trips.

---

## 🚀 Tech Stack

- React (or your framework choice)
- Map library (Leaflet / Mapbox / Google Maps)
- REST API integration
- WebSocket live updates

---

## 📦 Features

### Passenger Experience
- Live bus tracking map
- Route browsing
- Schedule search
- Ticket booking form

### Real‑Time Updates
- Buses move on the map
- Data streamed from backend simulation
- Instant refresh without reload

---

## 📂 Structure
```
/src
├── /components
├── /pages
├── /services
├── /map
```

---

## ⚙️ Running Locally

1. Install dependencies

npm install


2. Start app

npm start


App runs on: http://localhost:3000


Backend must be running for data.

---

## 🔗 Related Repositories

- gobusit-backend → API and simulation engine at https://github.com/cxdemxn/gobusit-backend
- gobusit-db → database schema documentation at https://github.com/cxdemxn/gobusit-db

---

## 📌 Status

Frontend will start minimal and expand as backend stabilizes.
