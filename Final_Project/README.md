# 🏡 Real Estate House Price Prediction System

An AI-powered full-stack real estate valuation platform built with **FastAPI**, **XGBoost Machine Learning**, and **React + TypeScript**.

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![XGBoost](https://img.shields.io/badge/Model-XGBoost_Regressor-green.svg)
![Accuracy](https://img.shields.io/badge/R%C2%B2_Score-91.91%25-brightgreen.svg)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)
![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg)

---

## 🌟 Key Features

- **⚡ XGBoost Machine Learning Model**: Trained on over 187,000 real estate records achieving **91.91% R² Accuracy Score**.
- **🌍 Multi-Currency Conversion**: Instant toggle between:
  - 🇮🇳 **Indian Rupees (INR - ₹)**
  - 🇺🇸 **US Dollars (USD - $)**
  - 🇪🇬 **Egyptian Pounds (EGP - E£)**
- **📐 Dual Unit Area Conversion**: Supports property input in both **Square Feet (sqft)** and **Square Meters (m²)** with live bidirectional conversion.
- **🏡 3D Property Model Preview**: Visual isometric elevation card displaying floor level, facing direction, room counts, and square dimensions.
- **📊 Valuation Confidence Meter**: Visual 91% confidence band displaying target valuation along with Low (-5%) and High (+5%) estimate ranges.
- **📍 Market Benchmark Comparison**: Regional comparison table evaluating Rate/sqft, Rate/m², transaction category, and estimated monthly rental yield against neighborhood benchmarks.
- **🎨 Sleek Light Mode Design**: Clean, modern interface designed with Sapphire Ocean Blue accents and responsive full-screen layouts.

---

## 🛠️ Tech Stack

### Machine Learning & Data Pipeline
- **XGBoost Regressor** (`xgboost`)
- **Scikit-Learn Pipeline** (`ColumnTransformer`, `OneHotEncoder`, `StandardScaler`)
- **Pandas & NumPy** (Feature engineering, missing value imputation, domain ratio calculation)

### Backend API
- **FastAPI** (REST API microservice with CORS support)
- **Uvicorn** (ASGI server)
- **Pydantic** (Input/Output data validation)

### Frontend Application
- **React 18** + **TypeScript**
- **React Router DOM** (Single page navigation)
- **Vanilla CSS3** (Custom design system, glassmorphism, responsive grid)

---

## 🚀 Quick Start

### 1. One-Click Launcher (Windows)
Double-click `RUN_PROJECT.bat` in the project root directory to automatically start both the backend API server and frontend React application.

### 2. Manual Startup

#### Backend Server (FastAPI)
```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```
- API Endpoint: `http://localhost:8000`
- Swagger Documentation: `http://localhost:8000/docs`

#### Frontend Application (React)
```bash
cd frontend
npm install
npm start
```
- Local Web App: `http://localhost:3000`

---

## 📊 Model Performance

| Metric | Score |
| :--- | :--- |
| **Algorithm** | XGBoost Regressor |
| **R² Score** | **0.9191 (91.91%)** |
| **Mean Absolute Error (MAE)** | ₹14.09 Lakhs |
| **Features Used** | `carpet_area`, `bathroom`, `balcony`, `floor`, `parking`, `sqft_per_room`, `location`, `furnishing`, `facing`, `transaction` |

Detailed data exploration, feature engineering, and model training code can be found in the Jupyter Notebook:
📓 [notebooks/house_price_model.ipynb](file:///d:/git_hub/ITI_ST/Final_Project/notebooks/house_price_model.ipynb)

---

## 🔌 API Endpoints

### `POST /predict`
Submit property parameters to calculate predicted valuation.

**Request Payload:**
```json
{
  "location": "thane",
  "carpet_area": 850,
  "bathroom": 2,
  "balcony": 1,
  "floor": 3,
  "parking": 1,
  "furnishing": "unfurnished",
  "facing": "east",
  "transaction": "resale"
}
```

**Response:**
```json
{
  "predicted_price": 9385247.06
}
```

### `GET /locations`
Returns array of available location choices for dropdowns.

---

## 📁 Repository Structure

```
Final_Project/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application & CORS
│   │   └── schemas/             # Pydantic data schemas
│   ├── models/                  # Pickled XGBoost pipeline & location list
│   ├── services/                # Model inference service
│   └── core/                    # App configuration
├── frontend/
│   ├── src/
│   │   ├── api/                 # Prediction API client
│   │   ├── components/          # Prediction form & UI controls
│   │   ├── pages/               # Home, Result, and 404 pages
│   │   └── index.css            # Light Mode styling system
│   └── public/                  # HTML template
├── notebooks/
│   └── house_price_model.ipynb  # End-to-end model development notebook
├── src/
│   ├── models/                  # Trainer module with XGBoost
│   ├── data/                    # Data loader module
│   └── visualization/           # Matplotlib / Seaborn visualization plots
├── RUN_PROJECT.bat              # One-click startup script
└── README.md                    # Project documentation
```
