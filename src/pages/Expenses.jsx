
import { useEffect, useState } from "react";
import {
    getExpenses,
    addExpense,
    deleteExpense
} from "../services/ExpenseService";

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Tickets");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [planId, setPlanId] = useState("1");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!planId || Number(planId) < 1) {
            setExpenses([]);
            return;
        }

        setLoading(true);
        setError("");

        getExpenses(planId)
            .then(setExpenses)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [planId]);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!description.trim() || !amount || Number(amount) <= 0 || !date) {
            setError("Enter a description, valid amount, and date.");
            return;
        }

        try {
            const savedExpense = await addExpense(planId, {
                category,
                description: description.trim(),
                amount: Number(amount),
                expenseDate: date
            });

            setExpenses((current) => [...current, savedExpense]);
            setDescription("");
            setCategory("Tickets");
            setAmount("");
            setDate("");
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDelete(id) {
        try {
            await deleteExpense(id);
            setExpenses((current) =>
                current.filter((expense) => expense.id !== id)
            );
        } catch (err) {
            setError(err.message);
        }
    }

    const totalSpent = expenses.reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0
    );

    return (
        <div className="page">
            <h1>Track Your Expenses</h1>
            <p>Record your concert spending.</p>

            <div className="card">
                <label htmlFor="planId">Concert Plan ID</label>
                <input
                    id="planId"
                    type="number"
                    min="1"
                    value={planId}
                    onChange={(event) => setPlanId(event.target.value)}
                />

                <h2>Add an Expense</h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="description">Description</label>
                    <input
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                    />

                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        <option>Tickets</option>
                        <option>Travel</option>
                        <option>Hotel</option>
                        <option>Parking</option>
                        <option>Food</option>
                        <option>Merchandise</option>
                        <option>Other</option>
                    </select>

                    <label htmlFor="amount">Amount ($)</label>
                    <input
                        id="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        required
                    />

                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        required
                    />

                    <button type="submit">Add Expense</button>
                </form>
            </div>

            {error && <p role="alert">{error}</p>}

            <div className="card">
                <h2>Expense Summary</h2>
                <p>Total recorded spending: ${totalSpent.toFixed(2)}</p>
            </div>

            <div className="card">
                <h2>Recorded Expenses</h2>

                {loading ? (
                    <p>Loading expenses...</p>
                ) : expenses.length === 0 ? (
                    <p>No expenses found for this plan.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>{expense.description}</td>
                                <td>{expense.category}</td>
                                <td>${Number(expense.amount).toFixed(2)}</td>
                                <td>{expense.expenseDate}</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(expense.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Expenses;
