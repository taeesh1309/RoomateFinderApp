from flask import Flask, jsonify
from flask_cors import CORS

from firebase_flask_api import firebase_bp  # Import the Firebase API blueprint
from model_flask_api import model_bp        # Import the Model API blueprint

app = Flask(__name__)

# Enable CORS for all routes in the main application
CORS(app)

# Register blueprints with URL prefixes
app.register_blueprint(firebase_bp, url_prefix='/firebase')
app.register_blueprint(model_bp, url_prefix='/model')

# Error handler for 404 Not Found
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"status": "error", "message": "Resource not found"}), 404

# Error handler for 500 Internal Server Error
@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"status": "error", "message": "Internal server error"}), 500

# Error handler for 400 Bad Request
@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({"status": "error", "message": "Bad request"}), 400

# Catch-all error handler for other HTTP errors
@app.errorhandler(Exception)
def handle_exception(error):
    response = {
        "status": "error",
        "message": str(error)
    }
    return jsonify(response), 500

if __name__ == '__main__':
    app.run(debug=True)
