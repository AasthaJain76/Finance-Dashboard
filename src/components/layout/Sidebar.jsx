import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { LayoutDashboard, ArrowLeftRight, Lightbulb, X } from "lucide-react";

const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { to: "/insights", label: "Insights", icon: Lightbulb },
];

export default function Sidebar({ open, onClose }) {
  const { darkMode } = useApp();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto
          ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}
          shadow-xl border-r ${darkMode ? "border-gray-700" : "border-gray-100"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b
          ${darkMode ? 'border-gray-700' : 'border-gray-100'}">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">₹</span>
            </div>
            <span className="font-bold text-lg tracking-tight">FinTrack</span>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                  : darkMode
                    ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className={`px-6 py-4 border-t text-xs
          ${darkMode ? "border-gray-700 text-gray-500" : "border-gray-100 text-gray-400"}`}>
          Finance Dashboard v1.0
        </div>
      </aside>
    </>
  );
}