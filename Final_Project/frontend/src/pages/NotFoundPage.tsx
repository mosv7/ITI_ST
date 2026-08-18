import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
    return (
        <div className="result-container">
            <div className="result-card">
                <h2>404 - Page Not Found</h2>
                <p className="no-result-text">The page you are looking for does not exist.</p>
                <Link to="/" className="back-btn">
                    ← Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;