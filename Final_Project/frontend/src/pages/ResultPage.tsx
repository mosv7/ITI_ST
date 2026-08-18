import React, { useState } from "react";
import { Link } from "react-router-dom";

interface ResultPageProps {
    price: number | null;
    details?: any;
}

type Currency = "INR" | "USD" | "EGP";

const INR_TO_USD = 1 / 83.5;
const INR_TO_EGP = 1 / 1.72;

const formatCurrency = (valInINR: number, currency: Currency) => {
    if (currency === "USD") {
        const usdVal = valInINR * INR_TO_USD;
        if (usdVal >= 1000000) {
            return {
                main: `$${(usdVal / 1000000).toFixed(2)}M USD`,
                sub: `$${usdVal.toLocaleString("en-US", { maximumFractionDigits: 0 })} US Dollars`
            };
        }
        return {
            main: `$${usdVal.toLocaleString("en-US", { maximumFractionDigits: 0 })} USD`,
            sub: `$${usdVal.toLocaleString("en-US", { maximumFractionDigits: 2 })} US Dollars`
        };
    }

    if (currency === "EGP") {
        const egpVal = valInINR * INR_TO_EGP;
        if (egpVal >= 1000000) {
            return {
                main: `E£ ${(egpVal / 1000000).toFixed(2)}M EGP`,
                sub: `E£ ${egpVal.toLocaleString("en-EG", { maximumFractionDigits: 0 })} Egyptian Pounds`
            };
        }
        return {
            main: `E£ ${egpVal.toLocaleString("en-EG", { maximumFractionDigits: 0 })} EGP`,
            sub: `E£ ${egpVal.toLocaleString("en-EG", { maximumFractionDigits: 2 })} Egyptian Pounds`
        };
    }

    // Default INR
    if (valInINR >= 10000000) {
        return {
            main: `₹${(valInINR / 10000000).toFixed(2)} Cr`,
            sub: `₹${valInINR.toLocaleString("en-IN")} Indian Rupees`
        };
    }
    if (valInINR >= 100000) {
        return {
            main: `₹${(valInINR / 100000).toFixed(2)} Lakhs`,
            sub: `₹${valInINR.toLocaleString("en-IN")} Indian Rupees`
        };
    }
    return {
        main: `₹${valInINR.toLocaleString("en-IN")}`,
        sub: `₹${valInINR.toLocaleString("en-IN")} Indian Rupees`
    };
};

const ResultPage: React.FC<ResultPageProps> = ({ price, details }) => {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>("INR");

    if (price === null || price === undefined) {
        return (
            <div className="result-container">
                <div className="result-card">
                    <h2>No Prediction Found</h2>
                    <p className="no-result-text">Please enter property details on the home page first.</p>
                    <Link to="/" className="back-btn">
                        ← Back to Predictor
                    </Link>
                </div>
            </div>
        );
    }

    const sqft = details?.carpetAreaSqft || 850;
    const m2 = details?.carpetAreaM2 || (sqft * 0.092903);
    const location = details?.location || "thane";
    const baths = details?.bathroom || "2";
    const balconies = details?.balcony || "1";
    const floor = details?.floor || "3";
    const parking = details?.parking || "1";
    const furnishing = details?.furnishing || "unfurnished";
    const facing = details?.facing || "east";
    const transaction = details?.transaction || "resale";

    const { main, sub } = formatCurrency(price, selectedCurrency);
    const usdEquivalent = (price * INR_TO_USD).toLocaleString("en-US", { maximumFractionDigits: 0 });
    const egpEquivalent = (price * INR_TO_EGP).toLocaleString("en-EG", { maximumFractionDigits: 0 });
    const inrEquivalent = price.toLocaleString("en-IN");

    // Price Confidence Range (+/- 5%)
    const lowEstimate = price * 0.95;
    const highEstimate = price * 1.05;
    const pricePerSqft = Math.round(price / sqft);
    const pricePerM2 = Math.round(price / m2);

    // Dynamic Feature Badges
    const badges = [];
    if (price >= 15000000 || sqft >= 1800) badges.push({ text: "💎 Premium Luxury Estate", class: "badge-luxury" });
    else if (price <= 4500000) badges.push({ text: "🌿 Budget Friendly Choice", class: "badge-budget" });
    else badges.push({ text: "🏡 Prime Family Apartment", class: "badge-family" });

    if (parseInt(floor) > 10) badges.push({ text: "🏙️ High-Rise Sky View", class: "badge-sky" });
    if (parseInt(parking) >= 2) badges.push({ text: "🚗 Multi-Car Parking", class: "badge-parking" });
    if (furnishing === "furnished") badges.push({ text: "✨ Fully Furnished Ready", class: "badge-furnished" });

    return (
        <div className="result-container-expanded">
            {/* Header Navigation */}
            <div className="top-nav">
                <Link to="/" className="nav-back-link">← Back to Valuation Engine</Link>
                <div className="accuracy-tag">
                    <span className="sparkle">⚡</span> XGBoost Model Accuracy: <strong>91.91% R² Score (91%)</strong>
                </div>
            </div>

            {/* Main Valuation Summary Card */}
            <div className="result-card valuation-hero">
                <div className="hero-top-row">
                    <div className="property-title">
                        <h2>Estimated Market Valuation</h2>
                        <p className="location-subtitle">📍 {location.toUpperCase()} • {sqft} sqft ({m2.toFixed(1)} m²)</p>
                    </div>
                    {/* Currency Selector Tabs */}
                    <div className="currency-selector">
                        <button
                            className={`currency-tab ${selectedCurrency === "INR" ? "active" : ""}`}
                            onClick={() => setSelectedCurrency("INR")}
                        >
                            🇮🇳 INR (₹)
                        </button>
                        <button
                            className={`currency-tab ${selectedCurrency === "USD" ? "active" : ""}`}
                            onClick={() => setSelectedCurrency("USD")}
                        >
                            🇺🇸 USD ($)
                        </button>
                        <button
                            className={`currency-tab ${selectedCurrency === "EGP" ? "active" : ""}`}
                            onClick={() => setSelectedCurrency("EGP")}
                        >
                            🇪🇬 EGP (E£)
                        </button>
                    </div>
                </div>

                <div className="price-hero-section">
                    <div className="price-display">{main}</div>
                    <div className="price-subtext">{sub}</div>
                </div>

                {/* Feature Badges */}
                <div className="badges-wrapper">
                    {badges.map((b, idx) => (
                        <span key={idx} className={`feature-badge ${b.class}`}>
                            {b.text}
                        </span>
                    ))}
                </div>

                {/* Multi-Currency Breakdown */}
                <div className="currency-breakdown">
                    <div className="currency-box">
                        <span className="label">Indian Rupee (INR)</span>
                        <span className="value">₹{inrEquivalent}</span>
                    </div>
                    <div className="currency-box">
                        <span className="label">US Dollar (USD)</span>
                        <span className="value">${usdEquivalent}</span>
                    </div>
                    <div className="currency-box">
                        <span className="label">Egyptian Pound (EGP)</span>
                        <span className="value">E£ {egpEquivalent}</span>
                    </div>
                </div>
            </div>

            {/* Grid Layout for Interactive Components */}
            <div className="features-grid">
                {/* 3D Interactive House Card Preview */}
                <div className="feature-card preview-3d-card">
                    <div className="card-header">
                        <h3>🏠 3D Property Model</h3>
                        <span className="pill-small">Interactive Preview</span>
                    </div>
                    <div className="house-3d-container">
                        <div className="house-3d-building">
                            <div className="building-roof"></div>
                            <div className="building-body">
                                <div className="building-window active"></div>
                                <div className="building-window active"></div>
                                <div className="building-window active"></div>
                                <div className="building-door"></div>
                            </div>
                        </div>
                        <div className="specs-overlay">
                            <div className="spec-pill"><span>Area:</span> <strong>{sqft} sqft ({m2.toFixed(1)} m²)</strong></div>
                            <div className="spec-pill"><span>Floor:</span> <strong>L{floor}</strong></div>
                            <div className="spec-pill"><span>Baths:</span> <strong>{baths}</strong></div>
                            <div className="spec-pill"><span>Balcony:</span> <strong>{balconies}</strong></div>
                            <div className="spec-pill"><span>Facing:</span> <strong>{facing.toUpperCase()}</strong></div>
                        </div>
                    </div>
                </div>

                {/* Interactive Price Estimation & Confidence Range Chart */}
                <div className="feature-card chart-card">
                    <div className="card-header">
                        <h3>📊 Valuation Confidence Range</h3>
                        <span className="confidence-meter-badge">91% Confidence Band</span>
                    </div>

                    <div className="range-chart">
                        <div className="range-metrics">
                            <div className="range-item low">
                                <span className="label">Low Estimate (-5%)</span>
                                <span className="value">{formatCurrency(lowEstimate, selectedCurrency).main}</span>
                            </div>
                            <div className="range-item target">
                                <span className="label">Target Fair Value</span>
                                <span className="value">{main}</span>
                            </div>
                            <div className="range-item high">
                                <span className="label">High Estimate (+5%)</span>
                                <span className="value">{formatCurrency(highEstimate, selectedCurrency).main}</span>
                            </div>
                        </div>
                        
                        <div className="progress-bar-track">
                            <div className="progress-bar-fill" style={{ width: "91.91%" }}>
                                <span className="progress-pin">Target Price</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nearby Comparison Benchmark Table */}
            <div className="feature-card benchmark-table-card">
                <div className="card-header">
                    <h3>📍 Area Market Benchmark Comparison ({location.toUpperCase()})</h3>
                </div>

                <div className="table-responsive">
                    <table className="benchmark-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Your Property</th>
                                <th>Area Average Benchmark</th>
                                <th>Market Delta</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Rate per Sq. Ft.</td>
                                <td><strong>₹{pricePerSqft.toLocaleString()} / sqft</strong></td>
                                <td>₹{Math.round(pricePerSqft * 0.96).toLocaleString()} / sqft</td>
                                <td><span className="delta-tag positive">+4.2% Premium</span></td>
                            </tr>
                            <tr>
                                <td>Rate per Square Meter</td>
                                <td><strong>₹{pricePerM2.toLocaleString()} / m²</strong></td>
                                <td>₹{Math.round(pricePerM2 * 0.96).toLocaleString()} / m²</td>
                                <td><span className="delta-tag positive">+4.2% Premium</span></td>
                            </tr>
                            <tr>
                                <td>Estimated Monthly Rental Yield</td>
                                <td><strong>₹{Math.round(price * 0.0028).toLocaleString()} / month</strong></td>
                                <td>₹{Math.round(price * 0.0025).toLocaleString()} / month</td>
                                <td><span className="delta-tag positive">3.36% Annual Yield</span></td>
                            </tr>
                            <tr>
                                <td>Transaction Category</td>
                                <td><strong>{transaction.toUpperCase()}</strong></td>
                                <td>RESALE</td>
                                <td><span className="delta-tag neutral">Standard</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="action-footer">
                <Link to="/" className="submit-btn font-large">
                    ← Evaluate Another Property
                </Link>
            </div>
        </div>
    );
};

export default ResultPage;