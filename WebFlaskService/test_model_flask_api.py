import pytest
from flask import Flask
from model_flask_api import model_bp
import json

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(model_bp, url_prefix='/model')
    app.config.update({"TESTING": True})
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_find_roommates_success(client):
    # Define valid input data for the POST request
    request_data = {
        "Gender": "Female",
        "Age": "23",
        "Ethnicity": "Hindu",
        "Smoker": "Maybe",
        "Drinker": "Maybe",
        "Dietary Preference": "No Preference"
    }

    # Send POST request to the endpoint
    response = client.post(
        '/model/find_roommates',
        data=json.dumps(request_data),
        content_type='application/json'
    )

    # Validate the response
    assert response.status_code == 200
    response_json = response.get_json()
    assert response_json["status"] == "success"
    assert "matches" in response_json
    assert isinstance(response_json["matches"], list)

def test_find_roommates_missing_field(client):
    # Define input data with a missing field
    request_data = {
        "Gender": "Female",
        "Age": "23",
        "Ethnicity": "Hindu",
        "Smoker": "Maybe",
        "Drinker": "Maybe"
        # Missing 'Dietary Preference'
    }

    # Send POST request to the endpoint
    response = client.post(
        '/model/find_roommates',
        data=json.dumps(request_data),
        content_type='application/json'
    )

    # Validate the response
    assert response.status_code == 400
    response_json = response.get_json()
    assert response_json["status"] == "error"
    assert "Missing field" in response_json["message"]

def test_find_roommates_internal_error(client, mocker):
    # Mock an internal server error
    mocker.patch('model_flask_api.knn_model.kneighbors', side_effect=Exception("Test exception"))

    # Define valid input data for the POST request
    request_data = {
        "Gender": "Female",
        "Age": "23",
        "Ethnicity": "Hindu",
        "Smoker": "Maybe",
        "Drinker": "Maybe",
        "Dietary Preference": "No Preference"
    }

    # Send POST request to the endpoint
    response = client.post(
        '/model/find_roommates',
        data=json.dumps(request_data),
        content_type='application/json'
    )

    # Validate the response
    assert response.status_code == 500
    response_json = response.get_json()
    assert response_json["status"] == "error"
    assert "Test exception" in response_json["message"]
