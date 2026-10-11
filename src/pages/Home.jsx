
import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="home-page">
            <section className="hero">
                <p className="eyebrow">YOUR CONCERT. YOUR PLAN.</p>

                <h1>
                    Make every concert
                    <br />
                    experience count.
                </h1>

                <p className="hero-description">
                    Discover live music, plan your concert experience,
                    and keep your spending on track — all in one place.
                </p>

                <div className="home-actions">
                    <Link to="/concerts" className="button-primary">
                        Discover Concerts
                    </Link>

                    <Link to="/saved-concerts" className="button-secondary">
                        My Saved Concerts
                    </Link>
                </div>
            </section>

            <section className="features">
                <h2>Your concert journey starts here</h2>

                <div className="feature-grid">
                    <article className="feature-card">
                        <span className="feature-icon">🎤</span>
                        <h3>Discover</h3>
                        <p>
                            Explore artists and upcoming concerts to find
                            your next live music experience.
                        </p>
                        <Link to="/concerts">Explore concerts →</Link>
                    </article>

                    <article className="feature-card">
                        <span className="feature-icon">📅</span>
                        <h3>Plan</h3>
                        <p>
                            Organize your concert plans and set a budget
                            before the big day.
                        </p>
                        <Link to="/plan">Plan your experience →</Link>
                    </article>

                    <article className="feature-card">
                        <span className="feature-icon">💰</span>
                        <h3>Track</h3>
                        <p>
                            Keep track of tickets, travel, food,
                            parking, and other concert expenses.
                        </p>
                        <Link to="/expenses">Track expenses →</Link>
                    </article>
                </div>
            </section>
        </main>
    );
}

export default Home;
