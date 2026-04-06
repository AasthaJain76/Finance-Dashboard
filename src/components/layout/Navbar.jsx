import { useApp } from "../../context/AppContext";
import { Menu, Sun, Moon } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  const { darkMode, setDarkMode, role, setRole } = useApp();

  return (
    <header className={`sticky top-0 z-10 flex items-center justify-between
      px-4 md:px-8 py-4 border-b shadow-sm
      ${darkMode
        ? "bg-gray-900 border-gray-700 text-white"
        : "bg-white border-gray-100 text-gray-800"}`}>

      {/* Left: hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Menu size={20} />
      </button>

      <div className="hidden md:block text-sm font-medium text-gray-400">
        Welcome back, Om 👋
      </div>

      {/* Right: role switcher + dark mode */}
      <div className="flex items-center gap-3">

        {/* Role Switcher */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={`text-sm px-3 py-2 rounded-lg border font-medium cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-emerald-400
            ${darkMode
              ? "bg-gray-800 border-gray-600 text-white"
              : "bg-gray-50 border-gray-200 text-gray-700"}`}
        >
          <option value="viewer">👁 Viewer</option>
          <option value="admin">🛠 Admin</option>
        </select>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg transition-colors
            ${darkMode
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}