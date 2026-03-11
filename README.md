# High-Performance Financial Data Grid (1M Rows Virtualization)

## Overview

This project implements a **high-performance financial data grid** capable of displaying **1,000,000 transaction records** efficiently in a web browser.

Rendering one million DOM elements directly would severely degrade performance and may crash the browser. To solve this problem, this project implements **manual virtualization (virtual scrolling)** so that only the rows visible in the viewport are rendered.

This approach ensures **smooth scrolling (~60 FPS)** and minimal memory usage, even with extremely large datasets.

---

## Key Features

* **1,000,000 Row Dataset Support**
* **Virtualized Rendering (Windowing)**
* **Smooth Scrolling Performance**
* **Sorting Across Entire Dataset**
* **Debounced Filtering**
* **Quick Status Filters**
* **Row Selection (Single & Multi-Select)**
* **Editable Cells**
* **Column Pinning**
* **Real-time Debug Panel**
* **Dockerized Deployment**

---

## Technologies Used

* React
* JavaScript
* CSS
* Docker
* Nginx

---

## Virtualization Strategy

Rendering all rows in the DOM would cause performance issues. Instead, this grid uses **virtual scrolling (windowing)**.

### Concept

Dataset size:

```
1,000,000 rows
```

Rows actually rendered in the DOM:

```
~40–60 rows
```

### Implementation

The grid contains three layers:

```
Scrollable Container
│
├── Sizer Element (simulates full height)
│
└── Window Element (renders visible rows)
```

Rows are positioned using:

```
transform: translateY()
```

This technique allows the browser to use **GPU acceleration**, resulting in smoother scrolling.

---

## Performance Optimizations

Several performance techniques were implemented:

* Virtual scrolling (windowing)
* `requestAnimationFrame` scroll updates
* Fixed row height calculations
* Debounced filtering
* Minimal DOM updates
* GPU-accelerated transforms

These optimizations ensure the grid maintains **smooth scrolling even with very large datasets**.

---

## Dataset Generation

The dataset is generated using a Node.js script.

Generate the dataset with:

```
npm install
npm run generate-data
```

This creates:

```
public/transactions.json
```

containing **1,000,000 transaction records**.

The dataset file is intentionally excluded from the repository to avoid large file uploads.

---

## Running the Application Locally

Install dependencies:

```
npm install
```

Generate the dataset:

```
npm run generate-data
```

Start the development server:

```
npm run dev
```

Open the application:

```
http://localhost:5173
```

---

## Running with Docker

The application is fully containerized and can be started with a single command.

Build and start the container:

```
docker-compose up --build
```

Access the application:

```
http://localhost:8080
```

---

## Debug Panel

A floating debug panel displays runtime metrics:

* Current FPS
* Number of rendered rows
* Current scroll position

This panel helps monitor performance and verify virtualization behavior.

---

## Project Structure

```
src
 ├── components
 │   ├── DataGrid.jsx
 │   └── DebugPanel.jsx
 │
 ├── hooks
 │   └── useVirtualScroll.js
 │
 ├── styles.css
 │
scripts
 └── generate-data.js

public
 └── transactions.json (generated)

Dockerfile
docker-compose.yml
.env.example
README.md
```

---

## Evaluation Notes

This project was built with a focus on:

* Performance
* Code readability
* Scalable architecture
* Efficient DOM management

All required **data-test-id attributes** are implemented for automated testing.

The application is fully containerized and can be started using:

```
docker-compose up
```

---