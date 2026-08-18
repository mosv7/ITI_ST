"""Preprocessing service for house price prediction."""
import pandas as pd
import numpy as np


def preprocess_input(data: dict) -> pd.DataFrame:
    """Preprocess input data for model prediction."""
    df = pd.DataFrame([data])
    # Select numeric features
    numeric_cols = ["carpet_area", "bathroom", "balcony"]
    df = df.select_dtypes(include=["number"])
    # Fill missing values
    df = df.fillna(df.mean())
    return df