
import { useEffect, useState } from "react";
import { getSavedConcerts } from "../services/ConcertService";

function SavedConcerts() {
    const [savedConcerts, setSavedConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadSavedConcerts() {
            try {
                const data = await getSavedConcerts();
                setSavedConcerts(data);
            } catch (err) {
                setError(err.message || "Failed to load saved concerts.");
            } finally {
                setLoading(false);
            }
        }

        loadSavedConcerts();
    }, []);

    if (loading) {
        return <p>Loading saved concerts...</p>;
    }

    if (error) {
        return (
            <main>
                <h1>Saved Concerts</h1>
                <p role="alert">{error}</p>
            </main>
        );
    }

    return (
        <main>
            <h1>Saved Concerts</h1>
            <p>Your collection of concerts you want to attend.</p>

            {savedConcerts.length === 0 ? (
                <p>You haven't saved any concerts yet.</p>
            ) : (
                <div className="concert-grid">
                    {savedConcerts.map((savedConcert) => (
                        <article
                            key={savedConcert.id}
                            className="concert-card"
                        >
                            <h2>
                                {savedConcert.concert?.name ??
                                    "Concert details unavailable"}
                            </h2>

                            {savedConcert.concert?.artist?.name && (
                                <p>
                                    Artist: {savedConcert.concert.artist.name}
                                </p>
                            )}

                            {savedConcert.concert?.venue?.name && (
                                <p>
                                    Venue: {savedConcert.concert.venue.name}
                                </p>
                            )}

                            {savedConcert.concert?.eventDate && (
                                <p>
                                    Date:{" "}
                                    {new Date(
                                        savedConcert.concert.eventDate
                                    ).toLocaleString()}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default SavedConcerts;
