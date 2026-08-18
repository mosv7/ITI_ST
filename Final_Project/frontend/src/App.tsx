import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";
import NotFoundPage from "./pages/NotFoundPage";

const App: React.FC = () => {
    const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
    const [propertyDetails, setPropertyDetails] = useState<any>(null);

    const handlePredict = (price: number, details: any) => {
        setPredictedPrice(price);
        setPropertyDetails(details);
    };

    return (
        <Router>
            <div className="app-layout">
                <Routes>
                    <Route path="/" element={<HomePage onPredict={handlePredict} />} />
                    <Route path="/result" element={<ResultPage price={predictedPrice} details={propertyDetails} />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;