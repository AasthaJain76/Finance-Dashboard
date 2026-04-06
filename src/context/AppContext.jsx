import { createContext, useContext, useState, useEffect } from "react";
import { mockTransactions } from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [role, setRole] = useState("viewer");
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    type: "All",
    sortBy: "date-desc",
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  const addTransaction = (newTx) => {
    const id = Date.now();
    setTransactions((prev) => [{ id, ...newTx }, ...prev]);
  };

  const editTransaction = (id, updatedTx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTx } : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTransactions = transactions
    .filter((t) => {
      if (!t || !t.description || !t.category || !t.type) return false;
      const search = filters.search.toLowerCase();
      const matchSearch =
        t.description.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search);
      const matchCategory =
        filters.category === "All" || t.category === filters.category;
      const matchType =
        filters.type === "All" || t.type === filters.type;
      return matchSearch && matchCategory && matchType;
    })
    .sort((a, b) => {
      if (filters.sortBy === "date-desc")   return new Date(b.date) - new Date(a.date);
      if (filters.sortBy === "date-asc")    return new Date(a.date) - new Date(b.date);
      if (filters.sortBy === "amount-desc") return b.amount - a.amount;
      if (filters.sortBy === "amount-asc")  return a.amount - b.amount;
      return 0;
    });

  const value = {
    transactions,
    filteredTransactions,
    filters,
    setFilters,
    role,
    setRole,
    darkMode,
    setDarkMode,
    totalBalance,
    totalIncome,
    totalExpenses,
    addTransaction,
    editTransaction,
    deleteTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}