"""Data loading module."""
import pandas as pd


def load_data(filepath: str) -> pd.DataFrame:
    """Load dataset from CSV file."""
    df = pd.read_csv(filepath)
    return df