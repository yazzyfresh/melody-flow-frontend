
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getExpenses(planId) {
    const response = await fetch(
        `${API_BASE_URL}/expenses/plan/${planId}`
    );

    if (!response.ok) {
        throw new Error("Could not load expenses.");
    }

    return response.json();
}

export async function addExpense(planId, expense) {
    const response = await fetch(
        `${API_BASE_URL}/expenses/plan/${planId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        }
    );

    if (!response.ok) {
        throw new Error("Could not save expense.");
    }

    return response.json();
}

export async function deleteExpense(expenseId) {
    const response = await fetch(
        `${API_BASE_URL}/expenses/${expenseId}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Could not delete expense.");
    }
}
