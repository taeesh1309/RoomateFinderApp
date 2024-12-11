import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import numpy as np
import joblib

# Load the dataset
data = pd.read_csv('Cleaned_Roommate_Finder_Data.csv')

# Selecting only relevant columns
selected_columns = ["Gender", "Age", "Ethnicity 1", "Smoker 1", "Drinker 1", "Dietary Preference 1",
                    "Name", "Personal Email ID", "Rent", "Bedrooms", "Ethnicity", "Smoker",
                    "Drinker", "Dietary Preference"]

filtered_data = data[selected_columns].copy()

# Encoding categorical variables
label_encoders = {}
for column in ["Gender", "Ethnicity 1", "Smoker 1", "Drinker 1", "Dietary Preference 1"]:
    le = LabelEncoder()
    filtered_data[column] = le.fit_transform(filtered_data[column].astype(str))
    label_encoders[column] = le

# Define features (X) for nearest neighbor model
X = filtered_data[["Gender", "Age", "Ethnicity 1", "Smoker 1", "Drinker 1", "Dietary Preference 1"]]

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data into training and test sets
X_train, X_test = train_test_split(X_scaled, test_size=0.2, random_state=65)

# Train NearestNeighbors model with cosine similarity for recommendations
knn_model = NearestNeighbors(n_neighbors=10, metric='cosine')
knn_model.fit(X_train)

# Set tolerance level for similarity and evaluate the model
tolerance = 2.0  # Adjustable tolerance level for similarity matching
accuracy_scores = []

for i, test_instance in enumerate(X_test):
    distances, indices = knn_model.kneighbors([test_instance])

    # Count neighbors with similar features within the specified tolerance
    matching_neighbors = sum(np.allclose(test_instance, X_train[idx], atol=tolerance) for idx in indices[0])

    # Calculate the similarity accuracy for each test instance
    accuracy = matching_neighbors / len(indices[0])  # Proportion of similar neighbors
    accuracy_scores.append(accuracy)

# Calculate and print the average similarity-based accuracy
similarity_accuracy = np.mean(accuracy_scores)
print("Average similarity-based accuracy with tolerance adjustment:", similarity_accuracy)

# Save the model, scaler, and label encoders for Flask API use
joblib.dump(knn_model, 'roommate_knn_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(label_encoders, 'label_encoders.pkl')
