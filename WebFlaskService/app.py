"""
This module provides an API for managing user profiles in a Firestore database.
It includes routes for creating, updating, and retrieving user data.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials,firestore

# from datetime import datetime
# import os
# from werkzeug.utils import secure_filename


app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 128 * 1024 * 1024
CORS(app) # 모든 출처의 요청 허용 (개발 중에만 사용)

# Firebase 인증 파일 로드 및 초기화
cred = credentials.Certificate("serviceAccountKey.json")
# firebase_admin.initialize_app(cred)
firebase_admin.initialize_app(cred, 
# {
    # 'storageBucket': 'roommate-533b0.appspot.com'  # Firebase Storage 버킷 URL
# }
)

# 파일 허용 형식
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# @app.route('/upload', methods=['POST'])
# def upload_image():
#     # 이미지 파일이 요청에 포함되어 있는지 확인
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part in the request"}), 400

#     file = request.files['file']

#     # 파일 이름이 유효한지 확인
#     if file.filename == '':
#         return jsonify({"error": "No selected file"}), 400

#     if file and allowed_file(file.filename):
#         # 파일명을 안전하게 처리
#         filename = secure_filename(file.filename)

#         # Firebase Storage에 업로드
#         bucket = storage.bucket()
#         blob = bucket.blob(f'images/{filename}')
#         blob.upload_from_file(file, content_type=file.content_type)

#         # 업로드된 파일의 URL 가져오기
#         blob.make_public()
#         file_url = blob.public_url

#         return jsonify({"url": file_url}), 200
#     else:
#         return jsonify({"error": "File type not allowed"}), 400


# Firestore 클라이언트 초기화
db = firestore.client()

# 모든 데이터를 가져오는 API 엔드포인트
# @app.route('/users', methods=['GET'])
# def get_data():
#     docs = db.collection('users').stream()
#     data = {doc.id: doc.to_dict() for doc in docs}
#     return jsonify(data)

# 데이터를 추가하는 API 엔드포인트
# @app.route('/users', methods=['POST'])
# def add_data():
#     data = request.json
#     db.collection('users').add(data)
#     return jsonify({"success": True}), 201


# user profile create
@app.route('/users', methods=['POST'])
def add_user():
    try:
        # JSON 요청에서 사용자 데이터 가져오기
        user_data = request.json
   
        # Firestore에 사용자 추가, 생성된 문서의 참조 반환
        doc_ref = db.collection('users').document()  # 문서 참조를 미리 생성
        doc_ref.set(user_data)  # set()을 사용하여 데이터를 설정

        # 생성된 문서 ID 가져오기
        new_user_id = doc_ref.id

        # Firestore 타임스탬프를 createdAt 필드에 추가
        doc_ref.update({"createdAt": firestore.SERVER_TIMESTAMP})

        # 새로 추가된 사용자 ID 반환
        return jsonify({"success": True, "userId": new_user_id}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# user profile select
@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user_ref = db.collection('users').document(user_id)  # 특정 ID로 문서 참조
        doc = user_ref.get()  # 문서 데이터 가져오기

        if not doc.exists:
            return jsonify({"error": "User not found"}), 404

        user_data = doc.to_dict()  # 문서를 딕셔너리로 변환
        return jsonify(user_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# user profile update
@app.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        # JSON 요청에서 업데이트할 사용자 데이터 가져오기
        updated_data = request.json

        # Firestore에서 해당 사용자 문서 참조
        user_ref = db.collection('users').document(user_id)
        doc = user_ref.get()  # 문서 존재 여부 확인

        if not doc.exists:
            return jsonify({"error": "User not found"}), 404

        # Firestore에서 사용자 문서 업데이트
        user_ref.update(updated_data)

        # 업데이트가 성공했음을 응답
        return jsonify({"success": True, "userId": user_id}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# # 가장 최근에 추가된 사용자 ID 가져오기
# @app.route('/users/latest', methods=['GET'])
# def get_latest_user():
#     try:
#         # createdAt 필드를 기준으로 내림차순 정렬하여 가장 최근에 추가된 사용자 가져오기
#         latest_user_query = db.collection('users').order_by('createdAt', direction=firestore.Query.DESCENDING).limit(1).stream()
        
#         latest_user = None
#         for doc in latest_user_query:
#             latest_user = doc

#         if latest_user:
#             return jsonify({"userId": latest_user.id})
#         else:
#             return jsonify({"error": "No users found"}), 404

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    


if __name__ == '__main__':
    app.run(debug=True)

