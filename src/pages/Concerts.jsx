
import { useEffect, useState } from "react";
import {
    getConcerts,
    searchTicketmasterEvents,
} from "../services/concertService";
import ConcertCard from "../components/ConcertCard";
import "./Concerts.css";

function Concerts() {
    // Concerts stored in our MySQL database
    const [concerts, setConcerts] = useState([]);

    // Real events returned by Ticketmaster
    const [ticketmasterEvents, setTicketmasterEvents] = useState([]);
    const [city, setCity] = useState("Tampa");
    const [ticketmasterLoading, setTicketmasterLoading] = useState(false);
    const [ticketmasterError, setTicketmasterError] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load concerts saved in our database
    useEffect(() => {
        async function loadConcerts() {
            try {
                const data = await getConcerts();
                setConcerts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadConcerts();
    }, []);

    // Search Ticketmaster when the user submits the city
    async function handleTicketmasterSearch(event) {
        event.preventDefault();

        setTicketmasterLoading(true);
        setTicketmasterError("");

        try {
            const data = await searchTicketmasterEvents(city);
            const events = data?._embedded?.events ?? [];

            setTicketmasterEvents(events);

            if (events.length === 0) {
                setTicketmasterError(
                    `No Ticketmaster events were found for ${city}. Try another city.`
                );
            }
        } catch (err) {
            setTicketmasterEvents([]);
            setTicketmasterError(err.message);
        } finally {
            setTicketmasterLoading(false);
        }
    }

    if (loading) {
        return <p>Loading concerts...</p>;
    }

    if (error) {
        return (
            <div>
                <h1>Discover Concerts</h1>
                <p role="alert">{error}</p>
            </div>
        );
    }

    return (
        <main>
            <h1 className="concerts-header">Discover Concerts</h1>

            <p className="concerts-description">
                Browse concerts and find your next live music experience.
            </p>

            <section>
                <h2>Find Real Concerts</h2>

                <form onSubmit={handleTicketmasterSearch}>
                    <label htmlFor="concert-city">City</label>

                    <input
                        id="concert-city"
                        type="text"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={ticketmasterLoading}
                    >
                        {ticketmasterLoading
                            ? "Searching..."
                            : "Search Events"}
                    </button>
                </form>

                {ticketmasterError && (
                    <p role="alert">{ticketmasterError}</p>
                )}

                {ticketmasterEvents.length > 0 && (
                    <div className="concert-grid">
                        {ticketmasterEvents.map((event) => (
                            <ConcertCard
                                key={event.id}
                                event={event}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2>Saved in Melody Flow</h2>

                {concerts.length === 0 ? (
                    <p>No concerts saved in our database yet.</p>
                ) : (
                    <div className="concert-grid">
                        {concerts.map((concert) => (
                            <article
                                key={concert.id}
                                className="concert-card"
                            >
                                <h3>{concert.name}</h3>

                                {concert.artist && (
                                    <p>
                                        Artist: {concert.artist.name}
                                    </p>
                                )}

                                {concert.venue && (
                                    <p>
                                        Venue: {concert.venue.name}
                                        {concert.venue.city
                                            ? `, ${concert.venue.city}`
                                            : ""}
                                    </p>
                                )}

                                {concert.eventDate && (
                                    <p>
                                        Date:{" "}
                                        {new Date(
                                            concert.eventDate
                                        ).toLocaleString("en-US", {
                                            dateStyle: "long",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                )}

                                {concert.ticketUrl && (
                                    <p>
                                        <a
                                            href={concert.ticketUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Tickets
                                        </a>
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Concerts;
