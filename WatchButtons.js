import React from "react";
import "./WatchButtons.css";

const WatchButtons = ({ isWatched, setIsWatched, isToWatch, setIsToWatch }) => {
    return (
        <div className="watchButtons">
            <button onClick={() => setIsToWatch(!isToWatch)} className={isToWatch ? "active" : ""}>
                {isToWatch ? "Remove from To Watch" : "Add to To Watch"}
            </button>
            <button onClick={() => setIsWatched(!isWatched)} className={isWatched ? "active" : ""}>
                {isWatched ? "Remove from Watched" : "Mark as Watched"}
            </button>
        </div>
    );
};

export default WatchButtons;
