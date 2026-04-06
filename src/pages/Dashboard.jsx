import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { CATEGORY_COLORS } from "../data/mockData";

// --- Helper: format numbers as ₹ ---
const fmt = (n) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

// --- Animation variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

// --- Summary Card ---
function SummaryCard({ title, amount, icon: Icon, color, index }) {
  const { darkMode } = useApp();
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`rounded-2xl p-6 flex items-center gap-5 shadow-sm border
        ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {title}
        </p>
        <p className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
          {fmt(amount)}
        </p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { totalBalance, totalIncome, totalExpenses, transactions, darkMode } = useApp();

  // --- Build monthly trend data ---
  const monthlyMap = {};
  transactions.forEach((t) => {
    const month = t.date.slice(0, 7); // "2025-01"
    if (!monthlyMap[month]) monthlyMap[month] = { month, income: 0, expenses: 0 };
    if (t.type === "income")  monthlyMap[month].income   += t.amount;
    if (t.type === "expense") monthlyMap[month].expenses += t.amount;
  });
  const trendData = Object.values(monthlyMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((d) => ({
      ...d,
      month: new Date(d.month + "-01").toLocaleString("default", { month: "short", year: "2-digit" }),
      balance: d.income - d.expenses,
    }));

  // --- Build spending breakdown (expenses only) ---
  const categoryMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const tickColor = darkMode ? "#9ca3af" : "#6b7280";
  const gridColor = darkMode ? "#1f2937" : "#f3f4f6";
  const cardBg    = darkMode ? "#111827" : "#ffffff";

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Overview
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Your financial summary at a glance
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard index={1} title="Total Balance" amount={totalBalance}  icon={Wallet}       color="bg-emerald-500" />
        <SummaryCard index={2} title="Total Income"  amount={totalIncome}   icon={TrendingUp}   color="bg-blue-500"   />
        <SummaryCard index={3} title="Total Expenses" amount={totalExpenses} icon={TrendingDown} color="bg-rose-500"   />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Area Chart - Balance Trend */}
        <motion.div
          custom={4} variants={fadeUp} initial="hidden" animate="visible"
          className={`rounded-2xl p-6 shadow-sm border
            ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        >
          <h2 className={`text-base font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Monthly Trend
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 12 }} />
              <YAxis tick={{ fill: tickColor, fontSize: 12 }}
                tickFormatter={(v) => "₹" + (v / 1000) + "k"} />
              <Tooltip
                contentStyle={{ background: cardBg, border: "none", borderRadius: 12 }}
                formatter={(v) => fmt(v)}
              />
              <Legend />
              <Area type="monotone" dataKey="income"   stroke="#22c55e" fill="url(#incomeGrad)"  strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="url(#expenseGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart - Spending Breakdown */}
        <motion.div
          custom={5} variants={fadeUp} initial="hidden" animate="visible"
          className={`rounded-2xl p-6 shadow-sm border
            ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        >
          <h2 className={`text-base font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Spending Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: cardBg, border: "none", borderRadius: 12 }}
                formatter={(v) => fmt(v)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        custom={6} variants={fadeUp} initial="hidden" animate="visible"
        className={`rounded-2xl p-6 shadow-sm border
          ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
      >
        <h2 className={`text-base font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Recent Transactions
        </h2>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className={`flex items-center justify-between py-2 border-b last:border-0
              ${darkMode ? "border-gray-800" : "border-gray-50"}`}>
              <div>
                <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {t.description}
                </p>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {t.category} · {t.date}
                </p>
              </div>
              <span className={`text-sm font-semibold
                ${t.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}