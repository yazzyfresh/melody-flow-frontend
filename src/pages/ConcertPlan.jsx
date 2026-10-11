
import { useEffect, useState } from "react";
import { getExpenses } from "../services/ExpenseService";
import {
    getConcertPlan,
    updateConcertPlanBudget,
} from "../services/ConcertPlanService";

function ConcertPlan() {
    const [planId] = useState(1);
    const [budget, setBudget] = useState("500");
    const [savedBudget, setSavedBudget] = useState(500);
    const [expenses, setExpenses] = useState([]);
    const [ticketCost, setTicketCost] = useState("150");
    const [travelCost, setTravelCost] = useState("50");
    const [hotelCost, setHotelCost] = useState("100");
    const [parkingCost, setParkingCost] = useState("25");
    const [foodCost, setFoodCost] = useState("40");
    const [merchandiseCost, setMerchandiseCost] = useState("35");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [planData, expenseData] = await Promise.all([
                    getConcertPlan(planId),
                    getExpenses(planId),
                ]);

                setBudget(String(planData.budget));
                setSavedBudget(Number(planData.budget));
                setExpenses(expenseData);
            } catch (err) {
                setError("Could not load your saved plan or expenses.");
                console.error(err);
            }
        }

        loadData();
    }, [planId]);

    const estimatedTotal =
        Number(ticketCost || 0) +
        Number(travelCost || 0) +
        Number(hotelCost || 0) +
        Number(parkingCost || 0) +
        Number(foodCost || 0) +
        Number(merchandiseCost || 0);

    const actualSpent = expenses.reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0
    );

    const estimatedRemaining = Number(budget || 0) - estimatedTotal;
    const actualRemaining = savedBudget - actualSpent;

    async function handleSaveBudget(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        if (budget.trim() === "" || Number(budget) < 0) {
            setError("Enter a valid budget amount.");
            return;
        }

        try {
            const updatedPlan = await updateConcertPlanBudget(planId, budget);

            setSavedBudget(Number(updatedPlan.budget));
            setBudget(String(updatedPlan.budget));
            setMessage("Budget saved successfully!");
        } catch (err) {
            setError("Could not save your budget. Check that the backend is running.");
            console.error(err);
        }
    }

    return (
        <div className="page">
            <h1>Concert Budget Planner</h1>
            <p>Plan your concert costs and keep track of your spending.</p>

            {message && <p>{message}</p>}
            {error && <p role="alert">{error}</p>}

            <section className="card">
                <h2>Set Your Budget</h2>

                <form onSubmit={handleSaveBudget}>
                    <label htmlFor="budget">Total budget ($)</label>
                    <input
                        id="budget"
                        type="number"
                        min="0"
                        step="0.01"
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)}
                        required
                    />

                    <button type="submit">Save Budget</button>
                </form>
            </section>

            <section className="card">
                <h2>Estimated Concert Costs</h2>

                <label htmlFor="tickets">Tickets ($)</label>
                <input
                    id="tickets"
                    type="number"
                    min="0"
                    step="0.01"
                    value={ticketCost}
                    onChange={(event) => setTicketCost(event.target.value)}
                />

                <label htmlFor="travel">Travel ($)</label>
                <input
                    id="travel"
                    type="number"
                    min="0"
                    step="0.01"
                    value={travelCost}
                    onChange={(event) => setTravelCost(event.target.value)}
                />

                <label htmlFor="hotel">Hotel ($)</label>
                <input
                    id="hotel"
                    type="number"
                    min="0"
                    step="0.01"
                    value={hotelCost}
                    onChange={(event) => setHotelCost(event.target.value)}
                />

                <label htmlFor="parking">Parking ($)</label>
                <input
                    id="parking"
                    type="number"
                    min="0"
                    step="0.01"
                    value={parkingCost}
                    onChange={(event) => setParkingCost(event.target.value)}
                />

                <label htmlFor="food">Food ($)</label>
                <input
                    id="food"
                    type="number"
                    min="0"
                    step="0.01"
                    value={foodCost}
                    onChange={(event) => setFoodCost(event.target.value)}
                />

                <label htmlFor="merchandise">Merchandise ($)</label>
                <input
                    id="merchandise"
                    type="number"
                    min="0"
                    step="0.01"
                    value={merchandiseCost}
                    onChange={(event) => setMerchandiseCost(event.target.value)}
                />

                <h3>Estimated Total: ${estimatedTotal.toFixed(2)}</h3>
                <h3>Estimated Remaining: ${estimatedRemaining.toFixed(2)}</h3>
            </section>

            <section className="card">
                <h2>Actual Spending</h2>
                <p>Budget: ${savedBudget.toFixed(2)}</p>
                <p>Total Spent: ${actualSpent.toFixed(2)}</p>
                <p>Remaining: ${actualRemaining.toFixed(2)}</p>

                {expenses.length === 0 ? (
                    <p>No expenses recorded yet. Add expenses on the Expenses page.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>{expense.category}</td>
                                <td>{expense.description}</td>
                                <td>{expense.expenseDate}</td>
                                <td>${Number(expense.amount).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}

export default ConcertPlan;
