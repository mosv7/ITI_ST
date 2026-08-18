from pydantic import BaseModel, Field
from typing import Optional


class PredictionInput(BaseModel):
    """Enhanced input schema for house price prediction."""
    location: str = Field(..., description="Property location/area")
    carpet_area: float = Field(..., description="Carpet area in sqft", alias="carpetArea")
    bathroom: int = Field(1, ge=0, description="Number of bathrooms")
    balcony: int = Field(0, ge=0, description="Number of balconies")
    floor: Optional[float] = Field(1.0, description="Floor level")
    parking: Optional[int] = Field(0, ge=0, description="Car parking spaces")
    furnishing: Optional[str] = Field("unfurnished", description="Furnishing status")
    facing: Optional[str] = Field("unknown", description="Property facing direction")
    transaction: Optional[str] = Field("resale", description="Transaction type (Resale / New Property)")

    class Config:
        populate_by_name = True


class PredictionOutput(BaseModel):
    """Output schema for house price prediction."""
    predicted_price: float = Field(..., description="Predicted price in rupees")
    confidence: Optional[float] = Field(None, description="Model accuracy/R2 score")