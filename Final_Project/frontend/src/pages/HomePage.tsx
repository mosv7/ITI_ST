import React from "react";
import PredictionForm from "../components/PredictionForm";

interface HomePageProps {
    onPredict: (price: number, details: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPredict }) => {
    return (
        <div className="home-container">
            <header className="hero">
                <div className="badge">⚡ XGBoost AI Engine • 91.91% R² Accuracy (91%)</div>
                <h1>House Price Prediction Engine</h1>
                <p className="subtitle">
                    Calculate instant property market valuations in <strong>INR (₹)</strong>, <strong>USD ($)</strong>, and <strong>EGP (E£)</strong> with <strong>sqft / m²</strong> conversion.
                </p>
            </header>
            <main>
                <PredictionForm onPredict={onPredict} />
            </main>
        </div>
    );
};

export default HomePage;