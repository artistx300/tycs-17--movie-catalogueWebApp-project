# backend/model.py

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class MovieStatus(db.Model):
    __tablename__ = 'movie_status'  # New table to track movie statuses

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    movie_id = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), nullable=False)  # "To Watch" or "Watched"

    def __repr__(self):
        return f'<MovieStatus {self.movie_id} - {self.status}>'
