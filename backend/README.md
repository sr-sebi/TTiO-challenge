# 🧠 TTiO Technical Test – Backend

This is the backend API for the TTiO application. It provides a REST API to manage devices ("Things"), their configurations, and associated telemetry data. It also uses **WebSockets (Socket.io)** to deliver **real-time data updates**.

---

## 📡 Available Endpoints

- `GET /things`  
  List all things (devices).

- `GET /things/:thingId`  
  Get details of a specific thing.

- `POST /things/:thingId/telemetry`  
  Create a new telemetry data entry.

- `GET /things/:thingId/:variable`  
  Retrieve the history of a specific variable (e.g., temperature, humidity).

- `PATCH /things/:thingId`  
  Update the configuration of a thing.

- `POST /things/:thingId/config/parameter`  
  Add an individual configuration parameter.

- `POST /things/:thingId/config/variable`  
  Add a new telemetry variable to the device.

---

## 📦 Main Dependencies

- **Node.js**  
- **TypeScript**  
- **Express** – HTTP server  
- **Morgan** – Request logging middleware  
- **Socket.io** – Real-time communication  
- **Prisma** – Database ORM

---

## Running database with docker
```bash
$ docker-compose -f db/development_db.yml up -d 
```

## Generate primsa client
```bash
$ npx prisma generate  
```

## Execute Prisma migrations
```bash
$ npx prisma migrate dev --name init
```

## To seed the database
```bash
$ npm run seed
```

## To execute the server

Execute the commands above in order and serve

```bash
$ npm run dev
```