from flask import Blueprint, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

# Define a Blueprint for the Firebase API
firebase_bp = Blueprint('firebase', __name__)
CORS(firebase_bp)

# Firebase 인증 파일 로드 및 초기화
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Firestore 클라이언트 초기화
db = firestore.client()

@firebase_bp.route('/users', methods=['POST'])
def add_user():
    try:
        user_data = request.json
        doc_ref = db.collection('users').document()
        doc_ref.set(user_data)
        new_user_id = doc_ref.id
        doc_ref.update({"createdAt": firestore.SERVER_TIMESTAMP})
        return jsonify({"success": True, "userId": new_user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@firebase_bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user_ref = db.collection('users').document(user_id)
        doc = user_ref.get()
        if not doc.exists:
            return jsonify({"error": "User not found"}), 404
        user_data = doc.to_dict()
        return jsonify(user_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@firebase_bp.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        updated_data = request.json
        user_ref = db.collection('users').document(user_id)
        doc = user_ref.get()
        if not doc.exists:
            return jsonify({"error": "User not found"}), 404
        user_ref.update(updated_data)
        return jsonify({"success": True, "userId": user_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
