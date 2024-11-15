from flask import Blueprint, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

# Load the trained model, scaler, encoders, and dataset
knn_model = joblib.load('roommate_knn_model.pkl')
scaler = joblib.load('scaler.pkl')
label_encoders = joblib.load('label_encoders.pkl')
data = pd.read_csv('Cleaned_Roommate_Finder_Data.csv')

# Define a Blueprint for the Model API
model_bp = Blueprint('model', __name__)
CORS(model_bp)

@model_bp.route('/find_roommates', methods=['POST'])
def find_roommates():
    try:
        user_preferences = request.json
        input_data = [
            user_preferences["Gender"],
            user_preferences["Age"],
            user_preferences["Ethnicity"],
            user_preferences["Smoker"],
            user_preferences["Drinker"],
            user_preferences["Dietary Preference"]
        ]

        input_encoded = [
            label_encoders["Gender"].transform([input_data[0]])[0],
            int(input_data[1]),
            label_encoders["Ethnicity 1"].transform([input_data[2]])[0],
            label_encoders["Smoker 1"].transform([input_data[3]])[0],
            label_encoders["Drinker 1"].transform([input_data[4]])[0],
            label_encoders["Dietary Preference 1"].transform([input_data[5]])[0]
        ]

        input_scaled = scaler.transform([input_encoded])
        distances, indices = knn_model.kneighbors(input_scaled)

        tolerance = 2.0
        matches = []
        for idx, dist in zip(indices[0], distances[0]):
            if dist <= tolerance:
                matches.append(data.iloc[idx][[
                    "Name", "Age", "Gender", "Dietary Preference",
                    "Smoker", "Drinker", "Ethnicity", "Expected Rent",
                    "Personal Email ID", "Bedroom Preference"
                ]].to_dict())

        return jsonify({"status": "success", "matches": matches})

    except KeyError as e:
        return jsonify({"status": "error", "message": f"Missing field: {e}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
