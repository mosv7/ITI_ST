"""Inference service for house price prediction using XGBoost model."""
import os
import sys
import joblib
import pandas as pd

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
from backend.core.config import MODEL_PATH

_model = None


def get_model():
    """Lazy load pickled XGBoost pipeline model."""
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        _model = joblib.load(MODEL_PATH)
    return _model


def preprocess_input(data: dict) -> pd.DataFrame:
    """Transform incoming JSON dict into pandas DataFrame with engineered features."""
    carpet_area = float(data.get("carpet_area") if data.get("carpet_area") is not None else data.get("carpetArea", 500))
    bathroom = float(data.get("bathroom", 1))
    balcony = float(data.get("balcony", 0))
    floor = float(data.get("floor", 1.0))
    parking = int(data.get("parking", 0))
    
    location = str(data.get("location", "thane")).strip().lower()
    furnishing = str(data.get("furnishing", "unfurnished")).strip().lower()
    facing = str(data.get("facing", "unknown")).strip().lower()
    transaction = str(data.get("transaction", "resale")).strip().lower()

    # Feature Engineering
    room_count = bathroom + balcony
    sqft_per_room = carpet_area / (room_count + 1)

    return pd.DataFrame([{
        "carpet_area": carpet_area,
        "bathroom": bathroom,
        "balcony": balcony,
        "floor": floor,
        "parking": parking,
        "sqft_per_room": sqft_per_room,
        "location": location,
        "furnishing": furnishing,
        "facing": facing,
        "transaction": transaction
    }])


def predict_price(data: dict) -> float:
    """Predict house price based on input features."""
    model = get_model()
    processed = preprocess_input(data)
    prediction = model.predict(processed)[0]
    return round(float(prediction), 2)