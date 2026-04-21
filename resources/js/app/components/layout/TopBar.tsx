import { Dumbbell, Bell, Search, Command } from "lucide-react";
import { Link } from "react-router";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_32px_-16px_rgba(0,0,0,0.05)] h-[72px] flex items-center justify-between px-6 md:px-8 shrink-0 transition-all duration-300">
      <Link to="/" className="flex items-center md:hidden">
        <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center mr-3 shadow-sm shadow-indigo-200/50">
          <Dumbbell className="size-[22px] text-white transform -rotate-12" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">Fitness Point</span>
      </Link>
      
      {/* Search on desktop */}
      <div className="hidden md:flex flex-1 items-center max-w-xl">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-12 py-3 border border-slate-200/80 rounded-2xl leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm font-medium transition-all duration-200"
            placeholder="Search members, bills, leads..."
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 font-semibold bg-white border border-slate-200 px-1.5 py-0.5 rounded-md">
              <Command className="size-3" />
              <span>K</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 md:space-x-5 ml-auto">
        <button className="relative p-2.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100/80 active:bg-slate-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <span className="absolute top-2 right-2 block h-[9px] w-[9px] rounded-full bg-rose-500 ring-[2.5px] ring-white" />
          <Bell className="h-[22px] w-[22px]" />
        </button>
        <Link to="/login" className="md:hidden size-10 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm border border-white active:scale-95 transition-all duration-200 relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          AD
        </Link>
      </div>
    </header>
  );
}
