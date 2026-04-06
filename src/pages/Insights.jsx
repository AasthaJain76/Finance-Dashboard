import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { CATEGORY_COLORS } from "../data/mockData";
import { TrendingUp, TrendingDown, Award, AlertCircle } from "lucide-react";

const fmt = (n) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

function InsightCard({ icon: Icon, label, value, sub, color, index }) {
  const { darkMode } = useApp();
  return (
    <motion.div custom={index} variants={fadeUp} initial="hidden" animate="visible"
      className={`rounded-2xl p-5 border shadow-sm flex gap-4 items-start
        ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          {label}
        </p>
        <p className={`text-xl font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}>{value}</p>
        {sub && <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function Insights() {
  const { transactions, darkMode } = useApp();

  // --- Category totals (expenses only) ---
  const categoryMap = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });
  const categoryData = Object.entries(categoryMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  const topCategory = categoryData[0];

  // --- Monthly totals ---
  const monthlyMap = {};
  transactions.forEach(t => {
    const m = t.date.slice(0, 7);
    if (!monthlyMap[m]) monthlyMap[m] = { month: m, income: 0, expenses: 0 };
    if (t.type === "income")  monthlyMap[m].income   += t.amount;
    if (t.type === "expense") monthlyMap[m].expenses += t.amount;
  });
  const monthlyData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));

  const formatMonth = (m) =>
    new Date(m + "-02").toLocaleString("default", { month: "short", year: "2-digit" });

  // Best & worst savings months
  const withSavings = monthlyData.map(m => ({ ...m, savings: m.income - m.expenses }));
  const bestMonth  = [...withSavings].sort((a, b) => b.savings - a.savings)[0];
  const worstMonth = [...withSavings].sort((a, b) => a.savings - b.savings)[0];

  // Average monthly expense
  const avgExpense = monthlyData.reduce((s, m) => s + m.expenses, 0) / (monthlyData.length || 1);

  const tickColor = darkMode ? "#9ca3af" : "#6b7280";
  const gridColor = darkMode ? "#1f2937" : "#f3f4f6";
  const cardBg    = darkMode ? "#111827" : "#ffffff";

  return (
    <div className="space-y-8">
      {/* Title */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Insights</h1>
        <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Patterns and observations from your spending
        </p>
      </motion.div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard index={1} icon={Award}       color="bg-amber-500"
          label="Top Spending Category"
          value={topCategory?.name || "—"}
          sub={topCategory ? fmt(topCategory.total) + " total" : ""} />
        <InsightCard index={2} icon={TrendingUp}  color="bg-emerald-500"
          label="Best Savings Month"
          value={bestMonth ? formatMonth(bestMonth.month) : "—"}
          sub={bestMonth ? fmt(bestMonth.savings) + " saved" : ""} />
        <InsightCard index={3} icon={TrendingDown} color="bg-rose-500"
          label="Worst Savings Month"
          value={worstMonth ? formatMonth(worstMonth.month) : "—"}
          sub={worstMonth ? fmt(worstMonth.savings) + " saved" : ""} />
        <InsightCard index={4} icon={AlertCircle} color="bg-blue-500"
          label="Avg Monthly Expense"
          value={fmt(Math.round(avgExpense))}
          sub="across all months" />
      </div>

      {/* Bar Chart - Spending by Category */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
        className={`rounded-2xl p-6 border shadow-sm
          ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
        <h2 className={`text-base font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Spending by Category
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={categoryData} barCategoryGap="30%">
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} />
            <YAxis tick={{ fill: tickColor, fontSize: 12 }} tickFormatter={v => "₹" + v / 1000 + "k"} />
            <Tooltip contentStyle={{ background: cardBg, border: "none", borderRadius: 12 }}
              formatter={v => fmt(v)} />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {categoryData.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#94a3b8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Monthly Comparison Table */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible"
        className={`rounded-2xl p-6 border shadow-sm
          ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
        <h2 className={`text-base font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Monthly Comparison
        </h2>
        <div className={`grid grid-cols-4 text-xs font-semibold uppercase tracking-wider pb-3 border-b
          ${darkMode ? "text-gray-500 border-gray-800" : "text-gray-400 border-gray-100"}`}>
          <span>Month</span>
          <span className="text-right">Income</span>
          <span className="text-right">Expenses</span>
          <span className="text-right">Savings</span>
        </div>
        {withSavings.map((m, i) => (
          <motion.div key={m.month} custom={i} variants={fadeUp} initial="hidden" animate="visible"
            className={`grid grid-cols-4 py-3 border-b last:border-0 text-sm
              ${darkMode ? "border-gray-800" : "border-gray-50"}`}>
            <span className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              {formatMonth(m.month)}
            </span>
            <span className="text-right text-emerald-500 font-medium">{fmt(m.income)}</span>
            <span className="text-right text-rose-500 font-medium">{fmt(m.expenses)}</span>
            <span className={`text-right font-semibold ${m.savings >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {fmt(m.savings)}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}