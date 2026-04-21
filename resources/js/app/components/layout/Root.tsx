import { Outlet, useNavigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";
import { useEffect } from "react";

export function Root() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);
  // Inject global styles to hide standard scrollbars but allow scrolling
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex h-[100dvh] bg-[#f8fafc] text-slate-900 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative w-full">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 no-scrollbar w-full relative z-0 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
