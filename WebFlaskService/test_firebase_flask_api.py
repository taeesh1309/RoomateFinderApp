import pytest
from flask import Flask
from firebase_flask_api import firebase_bp
import json

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(firebase_bp, url_prefix='/firebase')
    app.config.update({"TESTING": True})
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_add_user_success(client, mocker):
    # Mock Firestore interactions
    mock_doc_ref = mocker.Mock()
    mock_doc_ref.id = "TEST_USER_ID"
    mocker.patch('firebase_flask_api.db.collection', return_value=mocker.Mock(document=mocker.Mock(return_value=mock_doc_ref)))

    request_data = {
        "name": "John",
        "bio": "I need roommate",
        "phone": "2342345324",
        "email": "john@vt.edu",
        "program": "CS",
        "selectedEthnicity": "White or Caucasian",
        "hometown": "Iowa",
        "budget": "100023",
        "gender": "Male",
        "dietary": "Veg",
        "smoking": "No",
        "drinking": "No",
        "preference": {
            "genderOfInterest": "Male",
            "selectedEthnicityOfInterest": "No Preference",
            "dietary": "None",
            "smoking": "No",
            "drinking": "No",
            "ageOfInterest": "25"
        },
        "home": {
            "apartment_type": "Studio",
            "move_in_date": "2024-12-11T00:24:08.029Z"
        },
        "age": "23"
    }

    response = client.post(
        '/firebase/users',
        data=json.dumps(request_data),
        content_type='application/json'
    )

    assert response.status_code == 201
    response_json = response.get_json()
    assert response_json["success"] is True
    assert response_json["userId"] == "TEST_USER_ID"

def test_get_user_success(client, mocker):
    mock_doc = mocker.Mock()
    mock_doc.exists = True
    mock_doc.to_dict.return_value = {
        "name": "John",
        "bio": "I need roommate",
        "email": "john@vt.edu",
    }
    mocker.patch('firebase_flask_api.db.collection', return_value=mocker.Mock(document=mocker.Mock(return_value=mocker.Mock(get=mocker.Mock(return_value=mock_doc)))))

    response = client.get('/firebase/users/TEST_USER_ID')

    assert response.status_code == 200
    response_json = response.get_json()
    assert response_json["name"] == "John"
    assert response_json["email"] == "john@vt.edu"

def test_get_user_not_found(client, mocker):
    mock_doc = mocker.Mock()
    mock_doc.exists = False
    mocker.patch('firebase_flask_api.db.collection', return_value=mocker.Mock(document=mocker.Mock(return_value=mocker.Mock(get=mocker.Mock(return_value=mock_doc)))))

    response = client.get('/firebase/users/NON_EXISTENT_USER')

    assert response.status_code == 404
    response_json = response.get_json()
    assert "error" in response_json
    assert response_json["error"] == "User not found"

def test_add_user_internal_error(client, mocker):
    mocker.patch('firebase_flask_api.db.collection', side_effect=Exception("Test exception"))

    request_data = {
        "name": "John",
        "bio": "I need roommate",
        "phone": "2342345324",
        "email": "john@vt.edu",
        "program": "CS"
    }

    response = client.post(
        '/firebase/users',
        data=json.dumps(request_data),
        content_type='application/json'
    )

    assert response.status_code == 500
    response_json = response.get_json()
    assert "error" in response_json
    assert response_json["error"] == "Test exception"
