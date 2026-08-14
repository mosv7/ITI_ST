# ITI_ST — Deep Learning Day 1: TensorFlow Models

Two self-contained Jupyter notebooks, one per dataset, each with EDA, preprocessing, TensorFlow/Keras neural network training, and hyperparameter tuning (grid search with early stopping).

## Datasets

### 1. Bengaluru House Prices (`bengaluru_house_prices.csv`)
Regression task — predict house price in Lakhs.

Notebook: [`bengaluru_house_prices_tensorflow.ipynb`](Day1/bengaluru_house_prices_tensorflow.ipynb)

- Cleaning: parses sqft ranges (`1056-1256`), extracts BHK from `size`, drops `society`, groups rare locations into `Other`, removes outliers (`price > 400`), log-transforms the target
- One-hot encoding + StandardScaler, 80/20/20 train/val/test split
- Tuned 5 architectures (layers/units/dropout/learning rate/batch size) with early stopping

**Best hyperparameters:** 3 hidden layers, 128 units, dropout 0.2, lr 5e-4, batch size 64

| Metric | Value |
|---|---|
| Test MAE | 26.24 Lakhs |
| Test RMSE | 45.83 Lakhs |
| Test R² | 0.58 |

### 2. Churn Modelling (`Churn_Modelling.csv`)
Binary classification — predict customer churn (`Exited`).

Notebook: [`churn_modelling_tensorflow.ipynb`](Day1/churn_modelling_tensorflow.ipynb)

- Drops identifiers (`RowNumber`, `CustomerId`, `Surname`), one-hot encodes `Geography`/`Gender`, scales numerics, stratified split (class imbalance 80/20)
- Tuned 5 architectures with early stopping

**Best hyperparameters:** 4 hidden layers, 128 units, dropout 0.3, lr 5e-4, batch size 64

| Metric | Value |
|---|---|
| Test Accuracy | 0.866 |
| Test Precision | 0.773 |
| Test Recall | 0.484 |
| Test F1 | 0.595 |
| Test AUC | 0.856 |

## Requirements

- Python 3.13
- tensorflow >= 2.21
- pandas, numpy, matplotlib, seaborn
- scikit-learn

Run notebooks with:

```bash
jupyter notebook Day1/
```