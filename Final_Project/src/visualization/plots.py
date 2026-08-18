"""Visualization module."""
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import os


def plot_overview(df: pd.DataFrame):
    """Create overview plots for the dataset and save them to file."""
    sns.set_style("whitegrid")
    
    os.makedirs("reports", exist_ok=True)

    # Price distribution
    plt.figure(figsize=(10, 6))
    if "Price (in rupees)" in df.columns:
        sns.histplot(df["Price (in rupees)"].dropna(), kde=True, bins=30)
        plt.title("Price Distribution")
        plt.xlabel("Price (in rupees)")
        plt.savefig("reports/price_distribution.png")
    plt.close()
    
    # Correlation heatmap
    numeric_df = df.select_dtypes(include=["number"])
    if not numeric_df.empty:
        plt.figure(figsize=(12, 8))
        sns.heatmap(numeric_df.corr(), annot=True, cmap="coolwarm", fmt=".2f")
        plt.title("Correlation Heatmap")
        plt.savefig("reports/correlation_heatmap.png")
        plt.close()
    print("Plots saved to reports directory.")