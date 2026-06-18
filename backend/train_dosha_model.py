import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def train_model():
    print("Loading dataset...")
    # Adjust path assuming this script is run from backend/ directory
    dataset_path = '../../data/ayurvedic_dosha_dataset (1).csv'
    
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)
    
    # Strip any trailing/leading whitespaces from column names
    df.columns = df.columns.str.strip()

    # Features and target
    target = 'Dosha'
    X = df.drop(columns=[target])
    y = df[target]

    print("Building ML Pipeline...")
    # All features are categorical strings
    categorical_features = X.columns.tolist()
    
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', categorical_transformer, categorical_features)
        ])

    # Append classifier to preprocessing pipeline
    clf = Pipeline(steps=[('preprocessor', preprocessor),
                          ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))])

    print("Training Model...")
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    clf.fit(X_train, y_train)
    
    score = clf.score(X_test, y_test)
    print(f"Model accuracy on test set: {score:.4f}")

    print("Saving Model...")
    joblib.dump(clf, 'dosha_model.pkl')
    print("Model saved to dosha_model.pkl")

    # Save feature names for backend to ensure order
    feature_names = X.columns.tolist()
    with open('feature_names.json', 'w') as f:
        import json
        json.dump(feature_names, f)

if __name__ == '__main__':
    train_model()
