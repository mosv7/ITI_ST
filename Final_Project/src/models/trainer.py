"""Model training module using XGBoost and Enhanced Feature Engineering."""
import re
import json
import os
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score, mean_absolute_error, root_mean_squared_error


def parse_amount(val) -> float:
    """Parse Amount string into price in rupees."""
    if pd.isna(val):
        return np.nan
    val = str(val).strip()
    m_lac = re.search(r'([\d\.]+)\s*Lac', val, re.IGNORECASE)
    if m_lac:
        return float(m_lac.group(1)) * 100000
    m_cr = re.search(r'([\d\.]+)\s*Cr', val, re.IGNORECASE)
    if m_cr:
        return float(m_cr.group(1)) * 10000000
    m_k = re.search(r'([\d\.]+)\s*K', val, re.IGNORECASE)
    if m_k:
        return float(m_k.group(1)) * 1000
    m_num = re.search(r'([\d\.]+)', val.replace(',', ''))
    if m_num:
        return float(m_num.group(1))
    return np.nan


def parse_sqft(val) -> float:
    """Parse Carpet Area / Super Area string into sqft float."""
    if pd.isna(val):
        return np.nan
    m = re.search(r'([\d\.]+)', str(val).replace(',', ''))
    return float(m.group(1)) if m else np.nan


def parse_floor(val) -> float:
    """Parse floor text into numeric floor number."""
    if pd.isna(val):
        return 1.0
    val_str = str(val).lower()
    if 'ground' in val_str or 'basement' in val_str:
        return 0.0
    m = re.search(r'(\d+)', val_str)
    return float(m.group(1)) if m else 1.0


def parse_parking(val) -> int:
    """Parse car parking text into count of spaces."""
    if pd.isna(val):
        return 0
    val_str = str(val).lower()
    m = re.search(r'(\d+)', val_str)
    if m:
        return int(m.group(1))
    return 1 if any(k in val_str for k in ['covered', 'open', 'yes']) else 0


def train_model(df: pd.DataFrame, save_path: str = "backend/models/house_price.pkl"):
    """Clean data, engineer features, train XGBoost pipeline, and save model."""
    print("Preprocessing dataset and engineering features for XGBoost...")
    df = df.copy()
    df["price"] = df["Amount(in rupees)"].apply(parse_amount)
    df["carpet_area"] = df["Carpet Area"].apply(parse_sqft).fillna(df["Super Area"].apply(parse_sqft))
    
    if "Bathroom" in df.columns:
        df["bathroom"] = pd.to_numeric(df["Bathroom"].astype(str).str.extract(r'(\d+)')[0], errors="coerce").fillna(1)
    else:
        df["bathroom"] = 1
        
    if "Balcony" in df.columns:
        df["balcony"] = pd.to_numeric(df["Balcony"].astype(str).str.extract(r'(\d+)')[0], errors="coerce").fillna(0)
    else:
        df["balcony"] = 0

    df["floor"] = df["Floor"].apply(parse_floor) if "Floor" in df.columns else 1.0
    df["parking"] = df["Car Parking"].apply(parse_parking) if "Car Parking" in df.columns else 0

    df["location"] = df["location"].fillna("unknown").astype(str).str.lower().str.strip()
    df["furnishing"] = df["Furnishing"].fillna("unfurnished").astype(str).str.lower().str.strip() if "Furnishing" in df.columns else "unfurnished"
    df["facing"] = df["facing"].fillna("unknown").astype(str).str.lower().str.strip() if "facing" in df.columns else "unknown"
    df["transaction"] = df["Transaction"].fillna("resale").astype(str).str.lower().str.strip() if "Transaction" in df.columns else "resale"

    # Feature Engineering
    df["room_count"] = df["bathroom"] + df["balcony"]
    df["sqft_per_room"] = df["carpet_area"] / (df["room_count"] + 1)

    # Filter invalid rows and extreme outliers
    df_clean = df.dropna(subset=["price", "carpet_area"]).copy()
    df_clean = df_clean[
        (df_clean["carpet_area"] >= 100) & 
        (df_clean["carpet_area"] <= 10000) & 
        (df_clean["price"] >= 100000) & 
        (df_clean["price"] <= 500000000)
    ]

    unique_locations = sorted(list(df_clean["location"].unique()))

    features = [
        "carpet_area", "bathroom", "balcony", "floor", "parking", 
        "sqft_per_room", "location", "furnishing", "facing", "transaction"
    ]
    X = df_clean[features]
    y = df_clean["price"]

    num_cols = ["carpet_area", "bathroom", "balcony", "floor", "parking", "sqft_per_room"]
    cat_cols = ["location", "furnishing", "facing", "transaction"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]), num_cols),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), cat_cols)
        ]
    )

    model = xgb.XGBRegressor(
        n_estimators=150,
        learning_rate=0.08,
        max_depth=8,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        n_jobs=-1
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", model)
    ])

    print("Splitting data and training XGBoost model...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    score = float(r2_score(y_test, y_pred))
    mae = float(mean_absolute_error(y_test, y_pred))
    rmse = float(np.sqrt(np.mean((y_test - y_pred) ** 2)))

    print(f"XGBoost Model Performance:")
    print(f"  R² Score: {score:.4f}")
    print(f"  MAE: {mae:,.2f}")
    print(f"  RMSE: {rmse:,.2f}")

    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    print(f"Saving model to {save_path}...")
    joblib.dump(pipeline, save_path)

    locs_path = os.path.join(os.path.dirname(save_path), "locations.json")
    with open(locs_path, "w", encoding="utf-8") as f:
        json.dump(unique_locations, f)

    return pipeline, score