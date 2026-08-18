"""Main entry point for the House Price Prediction API."""
import os
import sys
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
from backend.app.schemas.prediction import PredictionInput, PredictionOutput
from backend.services.inference import predict_price

app = FastAPI(title="House Price Prediction API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "House Price Prediction API is running"}


@app.get("/locations")
def get_locations():
    locs_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'locations.json')
    if os.path.exists(locs_path):
        with open(locs_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return ["thane", "mumbai", "pune", "bangalore", "delhi", "gurgaon", "noida"]


@app.post("/predict")
def predict(data: PredictionInput):
    result = predict_price(data.dict())
    return {"predicted_price": result}