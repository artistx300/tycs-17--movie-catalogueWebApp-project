import React, { useEffect, useState } from "react";
import "./movie.css";
import { useParams } from "react-router-dom";

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState();
    const [availablePlatforms, setAvailablePlatforms] = useState({});
    const [userRating, setUserRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviews, setReviews] = useState([]);
    const [reportCounts, setReportCounts] = useState([]);
    const [isWatched, setIsWatched] = useState(false);
    const [isToWatch, setIsToWatch] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        getData();
        window.scrollTo(0, 0);
    }, []);

    const getData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                getAvailablePlatforms(data.id);
            });
    };

    const getAvailablePlatforms = (movieId) => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=4e44d9029b1270a757cddc766a1bcb63`)
            .then(res => res.json())
            .then(data => {
                if (data.results && data.results.IN) {
                    setAvailablePlatforms(data.results.IN);
                } else {
                    setAvailablePlatforms(null);
                }
            });
    };

    const handleEmojiClick = (rating) => {
        if (userRating === rating) {
            setUserRating(0);
        } else {
            setUserRating(rating);
        }
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (reviewText.trim()) {
            const newReview = {
                text: reviewText,
                reports: 0
            };
            setReviews([...reviews, newReview]);
            setReviewText("");
        }
    };

    const handleReportReview = (index) => {
        const updatedReports = [...reportCounts];
        updatedReports[index] = (updatedReports[index] || 0) + 1;
        setReportCounts(updatedReports);
    };

    const renderEmojis = () => {
        const emojiUrl = "https://static-00.iconduck.com/assets.00/popcorn-emoji-327x512-4wgylinf.png";
        return (
            <div className="emojiRating">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <img
                        key={rating}
                        src={emojiUrl}
                        alt={`Rate ${rating}`}
                        className={`emoji ${userRating >= rating ? "selected" : ""}`}
                        style={{
                            opacity: userRating === 0 ? 0.3 : userRating >= rating ? 1 : hoveredRating >= rating ? 0.7 : 0.3,
                        }}
                        onMouseEnter={() => setHoveredRating(rating)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => handleEmojiClick(rating)}
                    />
                ))}
            </div>
        );
    };

    const handleWatchedToggle = () => {
        setIsWatched(prev => !prev);
    };

    const handleToWatchToggle = async () => {
        // Deselect Watched if it's selected
        if (isWatched) {
            setIsWatched(false);
        }
        
        const newToWatchStatus = !isToWatch;
        setIsToWatch(newToWatchStatus);

        // Send request to backend
        const userId = "currentUserId"; // Replace with actual user ID from auth context or state
        const movieId = id;

        const requestData = {
            userId,
            movieId,
            status: newToWatchStatus ? "To Watch" : "Not To Watch"
        };

        try {
            const response = await fetch('/api/watchlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            const result = await response.json();
            if (response.ok) {
                alert(newToWatchStatus ? "Movie added to To Watch list" : "Movie removed from To Watch list");
            } else {
                alert(result.message || "Error updating movie status in the watchlist");
            }
        } catch (error) {
            alert("An error occurred: " + error.message);
        }
    };

    return (
        <div className="movie">
            <div className="movie__intro">
                <img className="movie__backdrop" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.backdrop_path : ""}`} alt="Movie Backdrop" />
            </div>
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`} alt="Movie Poster" />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail ? currentMovieDetail.original_title : ""}</div>
                        <div className="movie__tagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                        <div className="movie__rating">
                            {currentMovieDetail ? currentMovieDetail.vote_average.toFixed(1) : ""} <i className="fas fa-star" />
                            <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.vote_count + ") votes" : ""}</span>
                        </div>
                        <div className="movie__runtime">{currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}</div>
                        <div className="movie__releaseDate">{currentMovieDetail ? "Release date: " + currentMovieDetail.release_date : ""}</div>
                        <div className="movie__genres">
                            {currentMovieDetail && currentMovieDetail.genres
                                ? currentMovieDetail.genres.map(genre => (
                                    <span className="movie__genre" key={genre.id}>{genre.name}</span>
                                ))
                                : ""
                            }
                        </div>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="synopsisText">Synopsis</div>
                        <div>{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
                    </div>
                    <div className="movie__platforms">
                        <div className="platforms__heading">Available Platforms:</div>
                        <div className="platforms__list">
                            {availablePlatforms && availablePlatforms.flatrate ? (
                                availablePlatforms.flatrate.map(platform => (
                                    <span key={platform.provider_id} className="platform__item">
                                        <img src={`https://image.tmdb.org/t/p/original${platform.logo_path}`} alt={platform.provider_name} className="platform__logo" />
                                        <span>{platform.provider_name}</span>
                                    </span>
                                ))
                            ) : (
                                <div>No platforms available for this movie in India</div>
                            )}
                        </div>
                    </div>

                    {/* Emoji Rating Section */}
                    <div className="ratingSection">
                        <h3>Rate this Movie:</h3>
                        {renderEmojis()}
                    </div>

                    {/* To Watch and Watched Buttons */}
                    <div className="watchButtons">
                        <button onClick={handleToWatchToggle} className={isToWatch ? "active" : ""}>
                            {isToWatch ? "Remove from To Watch" : "Add to To Watch"}
                        </button>
                        <button onClick={handleWatchedToggle} className={isWatched ? "active" : ""}>
                            {isWatched ? "Remove from Watched" : "Mark as Watched"}
                        </button>
                    </div>

                    {/* Review Section */}
                    <div className="reviewSection">
                        <h3>Write a Review:</h3>
                        <form onSubmit={handleReviewSubmit}>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                rows="4"
                                placeholder="Write your review here..."
                                required
                            />
                            <button type="submit">Submit Review</button>
                        </form>
                        <div className="reviewsList">
                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <div key={index} className="reviewItem">
                                        <p>{review.text}</p>
                                        <div className="reviewActions">
                                            <button onClick={() => handleReportReview(index)}>Report</button>
                                            <span>Reported: {reportCounts[index] || 0} times</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet. Be the first to write one!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Movie;
