"""Tests for house price prediction."""
import pytest
from ...schemas.prediction import PredictionInput


def test_prediction_schema():
    """Test that prediction input schema works."""
    data = {
        "location": "thane",
        "carpet_area": 500,
        "bathroom": 2,
        "balcony": 1,
    }
    input_data = PredictionInput(**data)
    assert input_data.location == "thane"
    assert input_data.carpet_area == 500