import { useState } from "react";
import {
    saveConcert,
    saveTicketmasterEvent
} from "../services/concertService";

function ConcertCard({ event }) {
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSave() {
        setSaving(true);
        setMessage("");

        try {
            // First, save the Ticketmaster event to our concerts table.
            const concert = await saveTicketmasterEvent(event);

            // Next, save that concert to the user's saved concerts.
            await saveConcert(concert.id);

            setMessage("Concert saved successfully!");
        } catch (error) {
            setMessage(error.message || "Could not save concert.");
        } finally {
            setSaving(false);
        }
    }
    const venue = event._embedded?.venues?.[0];
    const attraction = event._embedded?.attractions?.[0];

    const date =
        event.dates?.start?.dateTime ??
        event.dates?.start?.localDate;

    const imageUrl = event.images?.[0]?.url;

    return (
        <article className="concert-card">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={`Event poster for ${event.name}`}
                    className="concert-image"
                    loading="lazy"
                />
            ) : (
                <div
                    className="concert-image-placeholder"
                    role="img"
                    aria-label="No event image available"
                >
                    No image available
                </div>
            )}

            <div className="concert-card-content">
                <h3>{event.name}</h3>

                {attraction?.name && (
                    <p><strong>Artist:</strong> {attraction.name}</p>
                )}

                {venue?.name && (
                    <p>
                        <strong>Venue:</strong> {venue.name}
                        {venue.city?.name ? `, ${venue.city.name}` : ""}
                    </p>
                )}

                {date && (
                    <p>
                        <strong>Date:</strong>{" "}
                        {new Date(date).toLocaleString("en-US", {
                            dateStyle: "long",
                            ...(event.dates?.start?.dateTime && {
                                timeStyle: "short",
                            }),
                        })}
                    </p>
                )}

                {event.url && (
                    <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Tickets
                    </a>
                )}

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Concert"}
                </button>

                {message && <p role="status">{message}</p>}
            </div>
        </article>
    );
}

export default ConcertCard;
