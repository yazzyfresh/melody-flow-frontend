const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all concerts from the backend
export async function getConcerts() {
    const response = await fetch(`${API_BASE_URL}/concerts`);

    if (!response.ok) {
        throw new Error("Failed to load concerts. Please try again.");
    }

    return response.json();
}

// Search Ticketmaster events in a city
export async function searchTicketmasterEvents(city = "Tampa") {
    const response = await fetch(
        `${API_BASE_URL}/ticketmaster/events?city=${encodeURIComponent(city)}`
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to search Ticketmaster events.");
    }

    return response.json();
}

// Save a Ticketmaster event into the MelodyFlow database
export async function saveTicketmasterEvent(event) {
    const venue = event._embedded?.venues?.[0];
    const artist = event._embedded?.attractions?.[0];

    const dateTime = event.dates?.start?.dateTime;
    const localDate = event.dates?.start?.localDate;

    if (!dateTime && !localDate) {
        throw new Error("This event does not have a date available.");
    }

    if (!venue?.name || !venue?.city?.name) {
        throw new Error(
            "This event is missing its venue or city information."
        );
    }

    const eventDate = dateTime
        ? dateTime.slice(0, 19)
        : `${localDate}T12:00:00`;

    const requestBody = {
        externalId: event.id,
        name: event.name,
        eventDate,
        ticketUrl: event.url ?? null,
        artistName: artist?.name || event.name,
        artistExternalId: artist?.id || `artist-${event.id}`,
        venueName: venue.name,
        venueCity: venue.city.name,
        venueState: venue.state?.stateCode || null,
        venueAddress: venue.address?.line1 || null,
        venueExternalId: venue.id || `venue-${event.id}`,
    };

    const response = await fetch(
        `${API_BASE_URL}/concerts/from-ticketmaster`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        }
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to save the concert.");
    }

    return response.json();
}

// Get saved concerts
export async function getSavedConcerts() {
    const response = await fetch(`${API_BASE_URL}/saved-concerts`);

    if (!response.ok) {
        throw new Error(
            "Failed to load saved concerts. Please try again."
        );
    }

    return response.json();
}

// Save a concert
export async function saveConcert(concertId) {
    const response = await fetch(`${API_BASE_URL}/saved-concerts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ concertId }),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(
            message || "Failed to save concert. Please try again."
        );
    }

    return response.json();
}

// Remove a saved concert
export async function removeSavedConcert(savedConcertId) {
    const response = await fetch(
        `${API_BASE_URL}/saved-concerts/${savedConcertId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        const message = await response.text();

        throw new Error(
            message || "Failed to remove saved concert. Please try again."
        );
    }

    // HTTP 204 has no response body, so do not call response.json().
    return true;
}