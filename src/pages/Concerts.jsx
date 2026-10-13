import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getSavedConcerts,
    removeSavedConcert,
    searchTicketmasterEvents,
} from "../services/ConcertService";
import ConcertCard from "../components/ConcertCard";
import "./Concerts.css";

function Concerts() {
    const [concerts, setConcerts] = useState([]);
    const navigate = useNavigate();
    const [ticketmasterEvents, setTicketmasterEvents] = useState([]);
    const [city, setCity] = useState("");
    const [ticketmasterLoading, setTicketmasterLoading] = useState(false);
    const [ticketmasterError, setTicketmasterError] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState(null);
    const [removeError, setRemoveError] = useState("");

    async function loadSavedConcerts() {
        try {
            const data = await getSavedConcerts();
            setConcerts(data);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to load saved concerts.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSavedConcerts();
    }, []);

    async function handleTicketmasterSearch(event) {
        event.preventDefault();

        const searchCity = city.trim();

        if (!searchCity) {
            setTicketmasterError("Please enter a city to search.");
            return;
        }

        setTicketmasterLoading(true);
        setTicketmasterError("");
        setTicketmasterEvents([]);

        try {
            const data = await searchTicketmasterEvents(searchCity);
            const events = data?._embedded?.events ?? [];

            setTicketmasterEvents(events);

            if (events.length === 0) {
                setTicketmasterError(
                    `No Ticketmaster events were found for ${searchCity}. Try another city.`
                );
            }
        } catch (err) {
            setTicketmasterError(
                err.message || "Unable to load concerts. Please try again."
            );
        } finally {
            setTicketmasterLoading(false);
        }
    }

    async function handleRemoveConcert(savedConcertId) {
        const confirmed = window.confirm(
            "Are you sure you want to remove this saved concert?"
        );

        if (!confirmed) {
            return;
        }

        setRemovingId(savedConcertId);
        setRemoveError("");

        try {
            await removeSavedConcert(savedConcertId);

            // Immediately remove the deleted concert from the screen.
            setConcerts((currentConcerts) =>
                currentConcerts.filter(
                    (savedConcert) => savedConcert.id !== savedConcertId
                )
            );


            // Make sure the error message is cleared.
            setRemoveError("");
        } catch (err) {
            setRemoveError(
                err.message || "Unable to remove this saved concert."
            );
        } finally {
            setRemovingId(null);
        }
    }

    if (loading) {
        return (
            <main className="concerts-page">
                <p className="concerts-status">Loading saved concerts...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="concerts-page">
                <h1 className="concerts-header">Discover Concerts</h1>
                <p className="concerts-error" role="alert">
                    {error}
                </p>
            </main>
        );
    }

    return (
        <main className="concerts-page">
            <header className="concerts-intro">
                <p className="concerts-eyebrow">YOUR NEXT NIGHT OUT</p>
                <h1 className="concerts-header">Discover Concerts</h1>
                <p className="concerts-description">
                    Find your next live music experience, one show at a time.
                </p>
            </header>

            <section className="concerts-section">
                <div className="concerts-section-heading">
                    <p className="concerts-eyebrow">FIND YOUR SHOW</p>
                    <h2>Explore live events</h2>
                    <p>
                        Search by city to discover concerts near your
                        destination.
                    </p>
                </div>

                <form
                    className="concert-search-form"
                    onSubmit={handleTicketmasterSearch}
                >
                    <label htmlFor="concert-city">Where are you going?</label>

                    <div className="concert-search-controls">
                        <input
                            id="concert-city"
                            type="text"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            placeholder="Enter a city (e.g., Tampa)"
                            autoComplete="address-level2"
                            required
                        />

                        <button
                            className="concert-search-button"
                            type="submit"
                            disabled={ticketmasterLoading}
                        >
                            {ticketmasterLoading
                                ? "Searching..."
                                : "Search events"}
                        </button>
                    </div>
                </form>

                {ticketmasterError && (
                    <p className="concerts-error" role="alert">
                        {ticketmasterError}
                    </p>
                )}

                {ticketmasterEvents.length > 0 && (
                    <div className="concert-grid">
                        {ticketmasterEvents.map((event) => (
                            <ConcertCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </section>

            <section className="concerts-section saved-concerts-section">
                <div className="concerts-section-heading">
                    <p className="concerts-eyebrow">KEEP THE PLANS</p>
                    <h2>Saved concerts</h2>
                    <p>The shows you have saved for later.</p>
                </div>

                {removeError && (
                    <p className="concerts-error" role="alert">
                        {removeError}
                    </p>
                )}

                {concerts.length === 0 ? (
                    <div className="concerts-empty-state">
                        <h3>No concerts saved yet</h3>
                        <p>
                            Your saved concerts will appear here when you add
                            them to your collection.
                        </p>
                    </div>
                ) : (
                    <div className="concert-grid">
                        {concerts.map((savedConcert) => {
                            const concert = savedConcert.concert;

                            if (!concert) {
                                return null;
                            }

                            return (
                                <article
                                    key={savedConcert.id}
                                    className="concert-card"
                                >
                                    <div className="concert-card-content">
                                        <p className="concert-card-label">
                                            SAVED SHOW
                                        </p>

                                        <h3>{concert.name}</h3>

                                        {concert.artist && (
                                            <p>
                                                <strong>Artist:</strong>{" "}
                                                {concert.artist.name}
                                            </p>
                                        )}

                                        {concert.venue && (
                                            <p>
                                                <strong>Venue:</strong>{" "}
                                                {concert.venue.name}
                                                {concert.venue.city
                                                    ? `, ${concert.venue.city}`
                                                    : ""}
                                            </p>
                                        )}

                                        {concert.eventDate && (
                                            <p>
                                                <strong>Date:</strong>{" "}
                                                {new Date(
                                                    concert.eventDate
                                                ).toLocaleString("en-US", {
                                                    dateStyle: "long",
                                                    timeStyle: "short",
                                                })}
                                            </p>
                                        )}

                                        {concert.ticketUrl && (
                                            <a
                                                className="concert-ticket-link"
                                                href={concert.ticketUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View tickets →
                                            </a>
                                        )}

                                        <div className="saved-concert-actions">
                                            <Button
                                                onClick={() => navigate("/plan")}
                                                variant="primary"
                                            >
                                                Plan this concert →
                                            </Button>

                                            <Button
                                                onClick={() => handleRemoveConcert(savedConcert.id)}
                                                disabled={removingId === savedConcert.id}
                                                variant="danger"
                                            >
                                                {removingId === savedConcert.id
                                                    ? "Removing..."
                                                    : "Remove saved concert"}
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Concerts;
