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
    

@firebase_bp.route('/chats', methods=['POST'])
def add_chats():
    try:
        chats_data = request.json
        doc_ref = db.collection('chats').document()
        doc_ref.set(chats_data)
        doc_ref.update({"createdAt": firestore.SERVER_TIMESTAMP})
        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@firebase_bp.route('/chats/<user_id>', methods=['GET'])
def get_chats(user_id):
    try:
        # Firestore에서 userId 필드로 문서 검색
        chat_ref = db.collection('chats').where('userId', '==', user_id)
        docs = chat_ref.get()
        
         # 결과를 리스트로 변환하며 document ID 추가
        chat_data = [{"id": doc.id, **doc.to_dict()} for doc in docs]
        print(' doc.id, : ', chat_data)
        
        # 문서가 없을 경우 빈 리스트 반환
        if not chat_data:
            return jsonify([]), 200
        
        # # 문서가 없을 경우 처리
        # if not docs:
        #     return jsonify({"error": "Chat not found"}), 404


        
        return jsonify(chat_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    