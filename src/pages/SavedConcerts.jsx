
import { useEffect, useState } from "react";
import { getSavedConcerts } from "../services/ConcertService";
import "./Concerts.css";

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
        return (
            <main className="saved-page">
                <div className="saved-message">
                    <div className="saved-spinner" />
                    <p>Loading your concerts...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="saved-page">
                <section className="saved-hero">
                    <span className="saved-eyebrow">
                        YOUR MUSIC JOURNEY
                    </span>
                    <h1>Saved <span>Concerts.</span></h1>
                    <p>Keep your next unforgettable night close.</p>
                </section>

                <div className="saved-message saved-error" role="alert">
                    {error}
                </div>
            </main>
        );
    }

    return (
        <main className="saved-page">
            <section className="saved-hero">
                <span className="saved-eyebrow">
                    YOUR MUSIC JOURNEY
                </span>

                <h1>
                    Saved <span>Concerts.</span>
                </h1>

                <p>
                    Your next unforgettable night starts here.
                    Keep track of the shows you want to experience.
                </p>

                <div className="saved-count">
                    <span className="saved-count-number">
                        {savedConcerts.length}
                    </span>
                    <span>
                        {savedConcerts.length === 1
                            ? "concert saved"
                            : "concerts saved"}
                    </span>
                </div>
            </section>

            {savedConcerts.length === 0 ? (
                <section className="saved-empty">
                    <div className="saved-empty-icon">♫</div>
                    <h2>Your next favorite night awaits.</h2>
                    <p>
                        You haven't saved any concerts yet.
                        Explore upcoming shows and save the ones
                        you don't want to miss.
                    </p>
                </section>
            ) : (
                <section className="saved-section">
                    <div className="saved-section-heading">
                        <div>
                            <h2>Your collection</h2>
                            <p>All the shows on your radar.</p>
                        </div>
                    </div>

                    <div className="saved-concert-grid">
                        {savedConcerts.map((savedConcert) => {
                            const concert = savedConcert.concert;
                            const eventDate = concert?.eventDate
                                ? new Date(concert.eventDate)
                                : null;

                            const validDate =
                                eventDate &&
                                !Number.isNaN(eventDate.getTime());

                            return (
                                <article
                                    key={savedConcert.id}
                                    className="saved-concert-card"
                                >
                                    <div className="saved-card-banner">
                                        <span className="saved-card-tag">
                                            ♫ SAVED SHOW
                                        </span>
                                        <span className="saved-card-note">
                                            ♪
                                        </span>
                                    </div>

                                    <div className="saved-card-content">
                                        <h3>
                                            {concert?.name ??
                                                "Concert details unavailable"}
                                        </h3>

                                        <p className="saved-artist">
                                            {concert?.artist?.name ??
                                                "Artist details unavailable"}
                                        </p>

                                        <div className="saved-card-details">
                                            <div className="saved-detail">
                                                <span className="saved-detail-icon">
                                                    ◷
                                                </span>
                                                <div>
                                                    <span className="saved-detail-label">
                                                        DATE &amp; TIME
                                                    </span>
                                                    <span className="saved-detail-value">
                                                        {validDate
                                                            ? eventDate.toLocaleString(
                                                                undefined,
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                    hour: "numeric",
                                                                    minute: "2-digit",
                                                                }
                                                            )
                                                            : "Date to be announced"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="saved-detail">
                                                <span className="saved-detail-icon">
                                                    ♧
                                                </span>
                                                <div>
                                                    <span className="saved-detail-label">
                                                        VENUE
                                                    </span>
                                                    <span className="saved-detail-value">
                                                        {concert?.venue?.name ??
                                                            "Venue to be announced"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="saved-card-footer">
                                            <span className="saved-status">
                                                <span className="saved-status-dot" />
                                                On your list
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}
        </main>
    );
}

export default SavedConcerts;
