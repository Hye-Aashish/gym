import { NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Receipt, 
  Settings, 
  Dumbbell, 
  MessageSquare, 
  Wallet, 
  BarChart3, 
  ListTodo,
  LogOut,
  FileText
} from "lucide-react";
import { clsx } from "clsx";

export const NAVIGATION_ITEMS = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Members", path: "/members", icon: Users },
  { name: "Attendance", path: "/attendance", icon: CalendarCheck },
  { name: "Leads", path: "/leads", icon: MessageSquare },
  { name: "Form Builder", path: "/form-builder", icon: FileText },
  { name: "Plans", path: "/plans", icon: ListTodo },
  { name: "Billing", path: "/billing", icon: Receipt },
  { name: "Expenses", path: "/expenses", icon: Wallet },
  { name: "Reports", path: "/reports", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

export const BOTTOM_NAV_ITEMS = [
  { name: "Home", path: "/", icon: LayoutDashboard },
  { name: "Members", path: "/members", icon: Users },
  { name: "Check-in", path: "/attendance", icon: CalendarCheck },
  { name: "Leads", path: "/leads", icon: MessageSquare },
  { name: "More", path: "/menu", icon: Dumbbell },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-[260px] border-r border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] h-full z-10 relative">
      <div className="h-[72px] flex items-center px-6 border-b border-slate-100/80 shrink-0 mt-0 pt-0">
        <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center mr-3 shadow-sm shadow-indigo-200/50">
          <Dumbbell className="size-[22px] text-white transform -rotate-12" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">Fitness Point</span>
      </div>
      
      <div className="px-5 pt-6 pb-2">
        <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Menu</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-1 px-4 space-y-1.5 no-scrollbar">
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              clsx(
                "group flex items-center px-3.5 py-[11px] text-[14px] font-medium rounded-xl transition-all duration-200 ease-out",
                isActive
                  ? "bg-indigo-50/80 text-indigo-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] border border-indigo-100/50"
                  : "text-slate-600 border border-transparent hover:bg-slate-50 hover:text-slate-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={clsx(
                  "mr-3 size-5 flex-shrink-0 transition-all duration-200",
                  isActive ? "text-indigo-600 stroke-[2.2px]" : "text-slate-400 group-hover:text-slate-600 stroke-[1.8px]"
                )} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 m-4 mt-auto bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center w-full">
          <div className="size-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm border border-white">
            AD
          </div>
          <div className="ml-3 flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">admin@Fitness Point.com</p>
          </div>
        </div>
        <NavLink 
          to="/login"
          className="mt-4 flex items-center justify-center w-full py-2 px-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-rose-600 transition-colors group"
        >
          <LogOut className="mr-2 size-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
          Logout
        </NavLink>
      </div>
    </aside>
  );
}
