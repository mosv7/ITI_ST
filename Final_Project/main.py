"""Main entry point for House Price Prediction project."""
import pandas as pd
from src.data.loader import load_data
from src.models.trainer import train_model
from src.visualization.plots import plot_overview

def main():
    # Load data
    df = load_data("data/house_prices.csv")
    
    # Basic overview
    print("Dataset shape:", df.shape)
    print("\nColumns:", df.columns.tolist())
    print("\nFirst 5 rows:")
    print(df.head())
    
    # Train model
    model, score = train_model(df)
    print(f"\nModel R² score: {score:.4f}")
    
    # Plot overview
    plot_overview(df)

if __name__ == "__main__":
    main()