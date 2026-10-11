
function ConcertCard({ event }) {
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
                    <p>
                        <strong>Artist:</strong> {attraction.name}
                    </p>
                )}

                {venue?.name && (
                    <p>
                        <strong>Venue:</strong> {venue.name}
                        {venue.city?.name
                            ? `, ${venue.city.name}`
                            : ""}
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
            </div>
        </article>
    );
}

export default ConcertCard;
