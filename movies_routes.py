from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from model import db, User, MovieStatus

movies = Blueprint('movies', __name__)

@movies.route('/api/movies/to-watch', methods=['POST'])
@jwt_required()
def add_to_watch():
    data = request.get_json()
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user['username']).first()

    movie_id = data.get('movieId')

    # Add movie to the user's To Watch list
    status_entry = MovieStatus(user_id=user.id, movie_id=movie_id, status='To Watch')
    db.session.add(status_entry)
    db.session.commit()

    return jsonify({'msg': 'Movie added to To Watch list.'}), 201

@movies.route('/api/movies/watched', methods=['POST'])
@jwt_required()
def add_watched():
    data = request.get_json()
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user['username']).first()

    movie_id = data.get('movieId')

    # Add movie to the user's Watched list
    status_entry = MovieStatus(user_id=user.id, movie_id=movie_id, status='Watched')
    db.session.add(status_entry)
    db.session.commit()

    return jsonify({'msg': 'Movie added to Watched list.'}), 201
