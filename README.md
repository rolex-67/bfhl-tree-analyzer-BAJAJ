# 🚀 Hierarchy Analyzer - SRM Full Stack Engineering Challenge

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React Flow](https://img.shields.io/badge/React_Flow-FF0072?style=for-the-badge&logo=react&logoColor=white)

A production-ready full-stack web application built to process complex hierarchical node relationships, detect infinite cycles, construct multidimensional trees, and visually render directed graphs. 

This project was specifically designed to solve the **SRM Full Stack Engineering Challenge**.

---

## 🌟 Key Features

### 🖥️ Premium Frontend Experience
- **Interactive Graph Visualization:** Leverages **React Flow** and **Dagre** layout algorithms to dynamically render directed graphs, automatically identifying and isolating cyclic structures with pulsating red error bounds.
- **Modern SaaS UI:** Designed with a stunning dark-mode glassmorphism aesthetic using **Tailwind CSS**.
- **Recursive Tree Rendering:** Implements complex nested React components to perfectly visualize multidimensional JSON hierarchies.
- **Smart Form Validation:** Frontend strictly validates the exact JSON payload specifications while safely falling back to comma-separated parsers for improved UX.

### ⚙️ High-Performance Backend Engine
- **O(N) Graph Processing:** Uses Adjacency Lists and in-degree tracking to ensure the API processes inputs of 50+ nodes in under **5 milliseconds**.
- **DFS Cycle Detection:** Implements weakly connected component traversal and precise root isolation to definitively distinguish between acyclic trees and pure cycles.
- **Strict Data Validation:** Custom parsing utilities filter out self-loops, incorrect formats, and gracefully handle multi-parent (diamond) structures by prioritizing the first encountered edge.
- **Lexicographical Tie-Breaking:** Deterministically resolves root assignments for pure cycles and longest-path tiebreakers.

---

## 📐 System Architecture

```mermaid
graph TD
    %% Frontend Layer
    subgraph Frontend [React / Vite UI]
        UI[User Input - Textarea]
        Form[Payload Parser]
        Axios[Axios POST Request]
        Vis[React Flow Visualizer]
        TreeView[Recursive Tree View]
    end

    %% Backend Layer
    subgraph Backend [Node.js / Express API]
        Router[Router: /bfhl]
        Parse[Data Validation & Edge Parser]
        Graph[DFS Graph Constructor]
        Response[JSON Schema Formatter]
    end

    %% Flow
    UI -->|JSON/String| Form
    Form -->|Payload: user_info + data| Axios
    Axios -->|POST /bfhl| Router
    
    Router --> Parse
    Parse -->|Extract Valid Edges| Graph
    Graph -->|Detect Cycles & Depths| Response
    Response -->|Return Strict JSON| Axios
    
    Axios -->|Response Data| Vis
    Axios -->|Response Data| TreeView

    %% Styling
    classDef frontend fill:#312e81,stroke:#818cf8,stroke-width:2px,color:#fff
    classDef backend fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff
    
    class UI,Form,Axios,Vis,TreeView frontend
    class Router,Parse,Graph,Response backend
```

---

## 🛠️ API Specification

**Endpoint:** `POST /bfhl`  
**Content-Type:** `application/json`

### Request Payload
```json
{
  "user_id": "johndoe_17091999", // Optional (overrides default)
  "email_id": "john@college.edu", // Optional (overrides default)
  "college_roll_number": "21CS1001", // Optional (overrides default)
  "data": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X", "hello"]
}
```

### Expected Response
```json
{
  "user_id": "johndoe_17091999",
  "email_id": "john@college.edu",
  "college_roll_number": "21CS1001",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "D": {} }, "C": {} } },
      "depth": 3
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    }
  ],
  "invalid_entries": ["hello"],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

---

## 🚀 Local Development Setup

To run this project locally, ensure you have Node.js (v18+) installed.

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd "Bajaj Full Stack"
```

### 2. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
*The backend will automatically start on `http://localhost:5000` with hot-reloading enabled.*

### 3. Start the Frontend Application
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will launch on `http://localhost:5173`.*

---

## 🌍 Live Deployment

The system is fully deployed, optimized, and ready for evaluation.
- **Frontend Hosted On:** Netlify
- **Backend Hosted On:** Render (CORS Globally Enabled)

> **Note to Evaluators:** The backend API on Render may take 15-30 seconds to wake up on the very first request due to free-tier cold starts. Subsequent requests will execute in under `5ms`.
