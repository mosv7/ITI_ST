"""API routes for prediction."""
from fastapi import APIRouter, HTTPException
from ...schemas.prediction import PredictionInput, PredictionOutput
from ...services.inference import predict_price

router = APIRouter(prefix="/predict", tags=["prediction"])


@router.post("/", response_model=PredictionOutput)
def predict_endpoint(input_data: PredictionInput):
    """Endpoint to predict house price."""
    try:
        result = predict_price(input_data.dict())
        return {"predicted_price": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))