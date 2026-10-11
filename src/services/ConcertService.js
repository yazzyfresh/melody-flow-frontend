
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get concerts saved in our MySQL database through Spring Boot
export async function getConcerts() {
    const response = await fetch(`${API_BASE_URL}/concerts`);

    if (!response.ok) {
        throw new Error("Failed to load concerts. Please try again.");
    }

    return response.json();
}

// Get real concert events from Ticketmaster through Spring Boot
export async function searchTicketmasterEvents(city = "Tampa") {
    const response = await fetch(
        `${API_BASE_URL}/ticketmaster/events?city=${encodeURIComponent(city)}`
    );

    if (!response.ok) {
        throw new Error("Failed to load Ticketmaster events. Please try again.");
    }

    return response.json();
}

// Get the current user's saved concerts through Spring Boot
export async function getSavedConcerts() {
    const response = await fetch(`${API_BASE_URL}/saved-concerts`);

    if (!response.ok) {
        throw new Error("Failed to load saved concerts. Please try again.");
    }

    return response.json();
}

// Save a concert for the current user through Spring Boot
export async function saveConcert(concertId) {
    const response = await fetch(`${API_BASE_URL}/saved-concerts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ concertId }),
    });

    if (!response.ok) {
        throw new Error("Failed to save concert. Please try again.");
    }

    return response.json();
}

// Remove a saved concert for the current user through Spring Boot
export async function removeSavedConcert(savedConcertId) {
    const response = await fetch(       `${API_BASE_URL}/saved-concerts/${savedConcertId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to remove saved concert. Please try again.");
    }

    return response.json();
}