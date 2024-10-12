import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
    const [toWatch, setToWatch] = useState([]);
    const [watched, setWatched] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserMovies = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('You need to sign in to view your profile.');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5000/user/movies', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }

                const data = await response.json();
                setToWatch(data.toWatch);
                setWatched(data.watched);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserMovies();
    }, []);

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {error && <p className="error">{error}</p>}
            <div className="movie-lists">
                <div className="list">
                    <h3>To Watch</h3>
                    {toWatch.length === 0 ? (
                        <p>No movies to watch.</p>
                    ) : (
                        <ul>
                            {toWatch.map((movie) => (
                                <li key={movie.id}>{movie.title}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="list">
                    <h3>Watched</h3>
                    {watched.length === 0 ? (
                        <p>No watched movies.</p>
                    ) : (
                        <ul>
                            {watched.map((movie) => (
                                <li key={movie.id}>{movie.title}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
