const API_BASE_URL = "http://localhost:8000";

export const fetchLocations = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/locations`);
        if (!response.ok) return ["thane", "mumbai", "pune", "bangalore"];
        return await response.json();
    } catch (e) {
        return ["thane", "mumbai", "pune", "bangalore"];
    }
};

export const predictPrice = async (formData: any): Promise<number> => {
    const payload = {
        location: formData.location || "thane",
        carpet_area: parseFloat(formData.carpetArea || formData.carpet_area || "500"),
        bathroom: parseInt(formData.bathroom || "1", 10),
        balcony: parseInt(formData.balcony || "0", 10),
        floor: parseFloat(formData.floor || "1"),
        parking: parseInt(formData.parking || "0", 10),
        furnishing: formData.furnishing || "unfurnished",
        facing: formData.facing || "unknown",
        transaction: formData.transaction || "resale"
    };

    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.predicted_price;
};