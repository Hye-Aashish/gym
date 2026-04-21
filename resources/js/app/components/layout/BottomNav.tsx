import { NavLink } from "react-router";
import { BOTTOM_NAV_ITEMS } from "./Sidebar";
import { clsx } from "clsx";

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-200/50 pb-safe shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-[72px] px-2 mb-1">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300 relative group",
                isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={clsx(
                    "p-[11px] rounded-2xl transition-all duration-300 ease-out",
                    isActive 
                      ? "bg-indigo-50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)] border border-indigo-100/50 scale-105" 
                      : "bg-transparent scale-100 group-hover:bg-slate-50 group-active:scale-95"
                  )}
                >
                  <item.icon className={clsx("size-[22px]", isActive && "stroke-[2.5px] text-indigo-600 drop-shadow-sm")} />
                </div>
                <span
                  className={clsx(
                    "text-[10px] font-semibold leading-none tracking-wide",
                    isActive ? "text-indigo-700" : "text-slate-500"
                  )}
                >
                  {item.name}
                </span>
                
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_0_rgba(99,102,241,0.6)] animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
