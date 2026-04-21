import { NavLink } from "react-router";
import { ChevronRight, LogOut } from "lucide-react";
import { NAVIGATION_ITEMS } from "../layout/Sidebar";
import { Settings } from "lucide-react";
import { BOTTOM_NAV_ITEMS } from "../layout/Sidebar";

export function MobileMenu() {
  const bottomNavPaths = BOTTOM_NAV_ITEMS.map((i) => i.path);
  const remainingItems = NAVIGATION_ITEMS.filter((i) => !bottomNavPaths.includes(i.path));
  
  return (
    <div className="space-y-6 max-w-lg mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Menu</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <ul className="divide-y divide-neutral-100">
          {remainingItems.map((item, idx) => (
            <li key={idx}>
              <NavLink 
                to={item.path}
                className="flex items-center justify-between p-4 hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <item.icon className="size-5" />
                  </div>
                  <span className="ml-4 text-base font-medium text-neutral-900">{item.name}</span>
                </div>
                <ChevronRight className="size-5 text-neutral-400" />
              </NavLink>
            </li>
          ))}
          
          <li>
            <NavLink 
              to="/settings"
              className="flex items-center justify-between p-4 hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Settings className="size-5" />
                </div>
                <span className="ml-4 text-base font-medium text-neutral-900">Settings</span>
              </div>
              <ChevronRight className="size-5 text-neutral-400" />
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mt-auto pt-6">
        <NavLink 
          to="/login"
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-neutral-200 bg-white text-neutral-700 font-medium active:bg-neutral-50 transition-colors shadow-sm"
        >
          <LogOut className="size-5" />
          <span>Log out Admin</span>
        </NavLink>
      </div>
    </div>
  );
}
