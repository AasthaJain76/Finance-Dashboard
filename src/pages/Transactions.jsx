import { useState } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { CATEGORIES } from "../data/mockData";

const fmt = (n) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.3 } }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

// ── Modal for Add / Edit ──────────────────────────────────────────────────────
function TransactionModal({ onClose, existing }) {
  const { addTransaction, editTransaction, darkMode } = useApp();
  const [form, setForm] = useState(
    existing || { description: "", amount: "", category: "Food", type: "expense", date: "" }
  );

  const handleSubmit = () => {
    if (!form.description || !form.amount || !form.date) return;
    const payload = { ...form, amount: Number(form.amount) };
    existing ? editTransaction(existing.id, payload) : addTransaction(payload);
    onClose();
  };

  const field = "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 " +
    (darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-800");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl
          ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">{existing ? "Edit Transaction" : "Add Transaction"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="space-y-3">
          <input className={field} placeholder="Description"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <input className={field} placeholder="Amount (₹)" type="number"
            value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />

          <input className={field} type="date"
            value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />

          <select className={field} value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.filter(c => c !== "Income").map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <div className="flex gap-3">
            {["expense", "income"].map((t) => (
              <button key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all
                  ${form.type === t
                    ? t === "income"
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-rose-500 text-white border-rose-500"
                    : darkMode
                      ? "border-gray-700 text-gray-400"
                      : "border-gray-200 text-gray-500"}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className={`flex-1 py-2 rounded-lg text-sm border
              ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
            <Check size={14} className="inline mr-1" />
            {existing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Transactions() {
  const { filteredTransactions, filters, setFilters, role, darkMode, deleteTransaction } = useApp();
  const [modal, setModal] = useState(null); // null | "add" | transaction object

  const isAdmin = role === "admin";

  const inputCls = "px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 " +
    (darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-700");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Transactions</h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {filteredTransactions.length} transactions found
          </p>
        </div>
        {isAdmin && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setModal("add")}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors shadow-md">
            <Plus size={16} /> Add Transaction
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className={`rounded-2xl p-4 border flex flex-wrap gap-3 items-center
        ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
        <SlidersHorizontal size={16} className="text-gray-400" />

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className={inputCls + " pl-8 w-full"} placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>

        {/* Category */}
        <select className={inputCls} value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Type */}
        <select className={inputCls} value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option>All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Sort */}
        <select className={inputCls} value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm
        ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>

        {/* Table Header */}
        <div className={`grid grid-cols-12 px-6 py-3 text-xs font-semibold uppercase tracking-wider
          ${darkMode ? "text-gray-500 border-b border-gray-800" : "text-gray-400 border-b border-gray-100"}`}>
          <span className="col-span-4">Description</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-2 text-right">Amount</span>
        </div>

        {/* Rows */}
        {filteredTransactions.length === 0 ? (
          <div className={`text-center py-16 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No transactions found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredTransactions.map((t, i) => (
              <motion.div key={t.id} custom={i} variants={fadeUp}
                initial="hidden" animate="visible" exit="exit"
                className={`grid grid-cols-12 px-6 py-4 items-center border-b last:border-0 group
                  ${darkMode
                    ? "border-gray-800 hover:bg-gray-800/50"
                    : "border-gray-50 hover:bg-gray-50"}`}>

                <span className={`col-span-4 text-sm font-medium truncate
                  ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {t.description}
                </span>

                <span className={`col-span-2 text-xs px-2 py-1 rounded-full w-fit
                  ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                  {t.category}
                </span>

                <span className={`col-span-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {t.date}
                </span>

                <span className={`col-span-2 text-xs font-medium px-2 py-1 rounded-full w-fit
                  ${t.type === "income"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"}`}>
                  {t.type}
                </span>

                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className={`text-sm font-semibold
                    ${t.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                  </span>

                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setModal(t)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => deleteTransaction(t.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <TransactionModal
            onClose={() => setModal(null)}
            existing={modal === "add" ? null : modal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}