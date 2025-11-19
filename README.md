
# Vehicle Lead Capture

The project implements a complete workflow for capturing, organizing, and managing vehicle leads.

---

## Tech Stack

### **Backend**
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Valkey/Redis

### **Frontend**
- Next.js 
- React 
- Tailwind CSS
- HeroUI
- TanStack Query

### **Tooling**
- Docker
- Docker-Compose
- Shell Scripting
- RESTful API conventions

---

## Features

### 1. Dataset & Seeding
- Seeds the database automatically if empty.
- Fetches the required 50-lead dataset from:
  `https://gist.githubusercontent.com/codemk12/3691a622ba446e4e39d0e80ece702a44/raw/leads.json`

### 2. Relational Data Model
Implemented using Prisma with relationships across:
- Lead  
- Source  
- Status  
- Vehicle  

### 3. Complete CRUD API
Includes:
- Create 
- Update
- Delete
- Retrieve
- Filtering by status, source, vehicle

### 4. Interactive UI Dashboard
Built with Next.js + HeroUI:
- Display Leads
- Status, Source, and Vehicle management
- Edit, update, and delete operations
- Modal for editing/adding
- Sidebar navigation

### 5. Productivity Features
- Search
- Caching
- Grouping
- Real-time UI updates with TanStack Query


---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/omzkiii/Vehicle-Lead-Capture.git
cd Vehicle-Lead-Capture
```

### 2. Build Docker Image

```bash
docker-compose build
```

### 3. Run Docker Images

```bash
docker-compose up
```

---

## Run the App

### Seed the Database
You can seed the database by going to:
```
http://localhost:8000/seed
```

### Use the App
You can start using the app by going to:
```
http://localhost:3000/admin
```
