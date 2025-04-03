import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FiSun, FiMoon, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import "./App.css";

export default function App() {
  const categories = ["Food", "Transport", "Shopping", "Others"];
  const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#ffbb28"];

  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("expenses"));
    const storedTheme = JSON.parse(localStorage.getItem("darkMode"));
    if (storedExpenses) setExpenses(storedExpenses);
    if (storedTheme !== null) setDarkMode(storedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const addExpense = () => {
    if (!title || !amount) return;

    if (editingId !== null) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === editingId
            ? { ...expense, title, amount: parseFloat(amount), category }
            : expense
        )
      );
      setEditingId(null);
    } else {
      const newExpense = {
        id: Date.now(),
        title,
        amount: parseFloat(amount),
        category,
      };
      setExpenses([...expenses, newExpense]);
    }

    setTitle("");
    setAmount("");
    setCategory("Food");
  };

  const editExpense = (expense) => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setEditingId(expense.id);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const getTotal = () => {
    return expenses
      .filter(expense => filter === "All" || expense.category === filter)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const filteredExpenses = expenses.filter(
    (expense) => filter === "All" || expense.category === filter
  );

  const chartData = categories.map((cat) => ({
    name: cat,
    value: expenses
      .filter((expense) => expense.category === cat)
      .reduce((total, expense) => total + expense.amount, 0),
  })).filter((data) => data.value > 0);

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="tracker-box">
        {/* Header */}
        <div className="header">
          <h1>Expense Tracker</h1>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>

        {/* Expense Input Form */}
        <div className="input-section">
          <input
            type="text"
            placeholder="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select  className="category-dropdown" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="add-btn" onClick={addExpense}>
            {editingId ? "Update" : <FiPlus />}
          </button>
        </div>

       

        {/* Expense List */}
        <ul className="expense-list">
          {filteredExpenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <span className={`badge badge-${expense.category.toLowerCase()}`}>
                {expense.category}
              </span>
              <span>{expense.title} - ₹{expense.amount}</span>
              <button className="edit-btn" onClick={() => editExpense(expense)}><FiEdit /></button>
              <button className="delete-btn" onClick={() => deleteExpense(expense.id)}><FiTrash2 /></button>
            </li>
          ))}
        </ul>

        <h3 className="total-expense">Total: ₹{getTotal().toFixed(2)}</h3>

        {/* Expense Chart */}
        {chartData.length > 0 && (
          <div className="chart-container">
            <h2>Expense Chart</h2>
            <PieChart width={300} height={300}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        )}
      </div>
    </div>
  );
}
