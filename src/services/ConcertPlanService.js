
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all concert plans
export async function getConcertPlans() {
    const response = await fetch(`${API_BASE_URL}/concert-plans`);

    if (!response.ok) {
        throw new Error("Could not load concert plans.");
    }

    return response.json();
}

// Get one concert plan by ID
export async function getConcertPlan(planId) {
    const response = await fetch(`${API_BASE_URL}/concert-plans/${planId}`);

    if (!response.ok) {
        throw new Error("Could not load concert plan.");
    }

    return response.json();
}

// Create a concert plan
export async function createConcertPlan(savedConcertId, budget) {
    const response = await fetch(`${API_BASE_URL}/concert-plans`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            savedConcertId,
            budget: Number(budget),
        }),
    });

    if (!response.ok) {
        throw new Error("Could not save concert plan.");
    }

    return response.json();
}

// Update an existing concert plan's budget
export async function updateConcertPlanBudget(planId, budget) {
    const response = await fetch(`${API_BASE_URL}/concert-plans/${planId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            savedConcertId: 1,
            budget: Number(budget),
        }),
    });

    if (!response.ok) {
        throw new Error("Could not save budget.");
    }

    return response.json();
}
