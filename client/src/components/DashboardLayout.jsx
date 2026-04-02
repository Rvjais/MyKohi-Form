import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronDown,
  LogOut,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/flows", icon: FileText, label: "Flows" },
  { to: "/submissions", icon: Users, label: "Submissions" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-sidebar flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-sidebar-border">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">MyKohi</span>
        </div>

        {/* Workspace */}
        <div className="px-3 py-3">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-text hover:bg-sidebar-hover transition-colors">
            <div className="w-5 h-5 bg-sidebar-active rounded flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">M</span>
            </div>
            <span className="flex-1 text-left text-sidebar-text-active text-sm font-medium">My Workspace</span>
            <ChevronDown className="w-3.5 h-3.5 text-sidebar-text" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-600/15 text-brand-400"
                    : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-3 mt-auto">
          <button className="flex items-center gap-2 px-3 py-2.5 w-full text-sm text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
