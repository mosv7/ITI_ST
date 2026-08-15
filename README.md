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

# ITI_ST — Deep Learning Day 2: CNNs with TensorFlow/Keras

Three CNN notebooks on two image datasets (CIFAR-10 and Fashion-MNIST), covering a basic CNN, training callbacks, and `ImageDataGenerator`-based data augmentation.

## Datasets

### 1. CIFAR-10 — basic CNN (`0.0 cifar10_cnn.ipynb`)
10-class color image classification (32×32×3), 50k train / 10k test.

- Architecture: 2× (Conv 3×3 → MaxPool), Conv 3×3, Flatten, Dense 64, Dense 10 (logits)
- Trained with Adam, 10 epochs, batch 128, `validation_split=0.1`
- Fixes applied: one-hot labels via `to_categorical(train_labels.reshape(-1))` (raw labels are `(N,1)`, otherwise `to_categorical` yields a broken `(N,1,10)` shape); loss set to `CategoricalCrossentropy(from_logits=True)` (the final layer is linear — on this TF build the default `from_logits=False` computed a garbage loss and the model never learned)

| Metric | Value |
|---|---|
| Train accuracy | 0.731 |
| Val accuracy | 0.696 |
| Test accuracy | 0.674 |
| Test loss | 0.928 |

### 2. CIFAR-10 — training callbacks (`0.1 CNN_callbacks_Cifar-10.ipynb`)
Same CNN on CIFAR-10 with `EarlyStopping` + model checkpointing.

- Fix applied: conditional `load_model`/`load_weights` (the saved `cnn_model.h5` / `cnn.hdf5` files don't exist in the repo, so a fresh model is trained instead of crashing)
- EarlyStopping restored weights from the best epoch (epoch 7)

| Metric | Value |
|---|---|
| Macro avg precision | 0.59 |
| Macro avg recall | 0.54 |
| Macro avg F1 | 0.53 |
| BER | 0.464 |

### 3. Fashion-MNIST — data augmentation (`1.0 CNN_DataGen_Fom_RAM_clothing-image.ipynb`)
10-class grayscale clothing classification (28×28), 60k train / 10k test, fed from RAM via `ImageDataGenerator`.

| Model | Test accuracy |
|---|---|
| CNN, 10 epochs (no augmentation) | 0.905 |
| CNN, 20 epochs | 0.795 |
| CNN, 50 epochs (augmented) | 0.787 |

## Requirements

- Python 3.13
- tensorflow >= 2.21
- pandas, numpy, matplotlib, seaborn
- scikit-learn

Run notebooks with:

```bash
jupyter notebook Day2/
```