import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictPrice, fetchLocations } from "../api/predictionClient";

interface PredictionFormProps {
    onPredict: (price: number, details: any) => void;
}

type AreaUnit = "sqft" | "m2";

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict }) => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [areaUnit, setAreaUnit] = useState<AreaUnit>("sqft");
    const [areaInput, setAreaInput] = useState("850");

    const [formData, setFormData] = useState({
        location: "thane",
        bathroom: "2",
        balcony: "1",
        floor: "3",
        parking: "1",
        furnishing: "unfurnished",
        facing: "east",
        transaction: "resale",
    });

    useEffect(() => {
        fetchLocations().then((locs) => {
            if (locs && locs.length > 0) {
                setLocations(locs);
                if (!locs.includes(formData.location)) {
                    setFormData((prev) => ({ ...prev, location: locs[0] }));
                }
            }
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getCarpetAreaInSqft = (): number => {
        const val = parseFloat(areaInput) || 0;
        return areaUnit === "m2" ? val * 10.7639 : val;
    };

    const getCarpetAreaInMeters = (): number => {
        const val = parseFloat(areaInput) || 0;
        return areaUnit === "sqft" ? val * 0.092903 : val;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const sqftVal = getCarpetAreaInSqft();
        if (sqftVal < 50) {
            setError("Carpet area must be at least 50 sqft (approx. 4.6 m²).");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                carpetArea: sqftVal
            };
            const price = await predictPrice(payload);
            const fullDetails = {
                ...payload,
                carpetAreaM2: getCarpetAreaInMeters(),
                carpetAreaSqft: sqftVal
            };
            onPredict(price, fullDetails);
            navigate("/result");
        } catch (err: any) {
            setError(err.message || "Failed to predict price. Make sure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card">
            <div className="form-header">
                <h2>Property Details</h2>
                <p className="form-subtitle">Enter specs to calculate instant Valuation</p>
            </div>

            {error && <div className="error-badge">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="location">Location / Neighborhood</label>
                        <select
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        >
                            {locations.length > 0 ? (
                                locations.map((loc) => (
                                    <option key={loc} value={loc}>
                                        📍 {loc.charAt(0).toUpperCase() + loc.slice(1)}
                                    </option>
                                ))
                            ) : (
                                <option value="thane">Thane</option>
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <div className="label-with-unit">
                            <label htmlFor="areaInput">Carpet Area</label>
                            <div className="unit-toggle">
                                <button
                                    type="button"
                                    className={`unit-btn ${areaUnit === "sqft" ? "active" : ""}`}
                                    onClick={() => {
                                        if (areaUnit === "m2") {
                                            setAreaInput((parseFloat(areaInput || "0") * 10.7639).toFixed(0));
                                        }
                                        setAreaUnit("sqft");
                                    }}
                                >
                                    sqft
                                </button>
                                <button
                                    type="button"
                                    className={`unit-btn ${areaUnit === "m2" ? "active" : ""}`}
                                    onClick={() => {
                                        if (areaUnit === "sqft") {
                                            setAreaInput((parseFloat(areaInput || "0") * 0.092903).toFixed(1));
                                        }
                                        setAreaUnit("m2");
                                    }}
                                >
                                    m²
                                </button>
                            </div>
                        </div>
                        <input
                            id="areaInput"
                            type="number"
                            step="any"
                            value={areaInput}
                            onChange={(e) => setAreaInput(e.target.value)}
                            placeholder={areaUnit === "sqft" ? "e.g. 850 sqft" : "e.g. 79 m²"}
                            required
                        />
                        <span className="area-conversion-hint">
                            Equivalent: <strong>{areaUnit === "sqft" ? `${getCarpetAreaInMeters().toFixed(1)} m²` : `${getCarpetAreaInSqft().toFixed(0)} sqft`}</strong>
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bathroom">Bathrooms</label>
                        <input
                            id="bathroom"
                            type="number"
                            name="bathroom"
                            min="1"
                            max="10"
                            value={formData.bathroom}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="balcony">Balconies</label>
                        <input
                            id="balcony"
                            type="number"
                            name="balcony"
                            min="0"
                            max="10"
                            value={formData.balcony}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="floor">Floor Level</label>
                        <input
                            id="floor"
                            type="number"
                            name="floor"
                            min="0"
                            max="100"
                            value={formData.floor}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="parking">Car Parking Spaces</label>
                        <input
                            id="parking"
                            type="number"
                            name="parking"
                            min="0"
                            max="10"
                            value={formData.parking}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="furnishing">Furnishing Status</label>
                        <select
                            id="furnishing"
                            name="furnishing"
                            value={formData.furnishing}
                            onChange={handleChange}
                        >
                            <option value="unfurnished">Unfurnished</option>
                            <option value="semi-furnished">Semi-Furnished</option>
                            <option value="furnished">Furnished</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="facing">Facing Direction</label>
                        <select
                            id="facing"
                            name="facing"
                            value={formData.facing}
                            onChange={handleChange}
                        >
                            <option value="east">East</option>
                            <option value="west">West</option>
                            <option value="north">North</option>
                            <option value="south">South</option>
                            <option value="north-east">North-East</option>
                            <option value="north-west">North-West</option>
                            <option value="south-east">South-East</option>
                            <option value="south-west">South-West</option>
                            <option value="unknown">Not Specified</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="transaction">Transaction Type</label>
                        <select
                            id="transaction"
                            name="transaction"
                            value={formData.transaction}
                            onChange={handleChange}
                        >
                            <option value="resale">Resale Property</option>
                            <option value="new property">New Construction</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? (
                        <span className="spinner-container">
                            <span className="spinner"></span> Running XGBoost Engine...
                        </span>
                    ) : (
                        "Calculate Estimate ⚡"
                    )}
                </button>
            </form>
        </div>
    );
};

export default PredictionForm;