from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from model import db, User
from routes.auth import auth
from routes.movies_routes import movies  # Import the movies routes
from config import Config
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  

# Initialize database
db.init_app(app)

# Initialize JWT manager
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth)
app.register_blueprint(movies)  # Register the movies blueprint

# Create database tables
with app.app_context():
    db.create_all()  # Create database tables

# Error handling for JWT
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({'msg': 'Missing authorization header'}), 401

@jwt.invalid_token_loader
def invalid_token_response(callback):
    return jsonify({'msg': 'Invalid token'}), 401

@jwt.expired_token_loader
def expired_token_response(callback):
    return jsonify({'msg': 'Token has expired'}), 401

# Profile route to retrieve user data, requires JWT token
@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()  # Get the current user's identity from the token
    user = User.query.filter_by(username=current_user['username']).first()

    if not user:
        return jsonify({'msg': 'User not found'}), 404

    # Retrieve user's movie status (Watched and To Watch)
    watched = [entry.movie_id for entry in user.movie_statuses if entry.status == 'Watched']
    to_watch = [entry.movie_id for entry in user.movie_statuses if entry.status == 'To Watch']

    return jsonify({
        'username': user.username,
        'email': user.email,
        'watched': watched,
        'to_watch': to_watch
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
