import { useState, useEffect } from "react";
import { 
  Users, 
  Activity, 
  CalendarCheck, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Plus, 
  ChevronRight, 
  Bell,
  Loader2,
  IndianRupee,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  Cell
} from "recharts";
import { clsx } from "clsx";
import axios from "axios";
import { Link } from "react-router";

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [gymName, setGymName] = useState("Fitness Point");
  const [currency, setCurrency] = useState("₹");

  useEffect(() => {
    fetchDashboardStats();
    fetchGymName();
    fetchSettings();

    const handleSettingsUpdate = (event: any) => {
      if (event.detail) {
        if (event.detail.gym_name) setGymName(event.detail.gym_name);
        if (event.detail.currency) {
          const symbol = event.detail.currency.match(/\((.*)\)/)?.[1] || "₹";
          setCurrency(symbol);
        }
      }
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  const fetchGymName = async () => {
    try {
      const response = await axios.get("/api/settings");
      if (response.data && response.data.gym_name) {
        setGymName(response.data.gym_name);
      }
    } catch (error) {}
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/settings");
      if (response.data && response.data.currency) {
        const symbol = response.data.currency.match(/\((.*)\)/)?.[1] || "₹";
        setCurrency(symbol);
      }
    } catch (error) {}
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/v1/dashboard-pulse");
      setData(response.data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 bg-white rounded-[32px] border border-slate-100 min-h-[500px]">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing your gym pulse...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-6 bg-white rounded-[32px] border border-slate-100 min-h-[500px] p-10 text-center">
        <div className="h-20 w-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 ring-8 ring-rose-50">
          <AlertCircle className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase">Dashboard Offline</h2>
          <p className="mt-2 text-slate-500 font-medium max-w-sm mx-auto">{error || "Could not retrieve system statistics."}</p>
        </div>
        <button 
          onClick={fetchDashboardStats}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { stats, revenue_chart, attendance_chart, recent_members, expiring_soon } = data;

  const kpiStats = [
    { label: "Total Members", value: stats?.total_members || 0, change: "Active: " + (stats?.active_members || 0), icon: Users, color: "indigo" },
    { label: "Revenue", value: currency + (stats?.monthly_revenue || 0).toLocaleString('en-IN'), change: "This Month", icon: IndianRupee, color: "emerald" },
    { label: "Attendance", value: stats?.today_attendance || 0, change: "Check-ins Today", icon: CalendarCheck, color: "blue" },
    { label: "New Leads", value: stats?.total_leads || 0, change: "Prospects", icon: MessageSquare, color: "amber" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 no-scrollbar max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{gymName} Overview 👋</h1>
          <p className="mt-1.5 text-[15px] font-medium text-slate-500 max-w-lg leading-relaxed">Real-time snapshots of your gym's performance.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/members" className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-xl shadow-lg text-[15px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95">
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Member
          </Link>
          <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all relative group shadow-sm">
            <Bell className="h-5 w-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            {expiring_soon > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {expiring_soon}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-md transition-all group hover:border-indigo-100 text-left relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className={clsx(
                "h-12 w-12 rounded-2xl flex items-center justify-center ring-4 ring-opacity-10",
                stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 ring-indigo-500' :
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 ring-emerald-500' :
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600 ring-blue-500' :
                'bg-amber-50 text-amber-600 ring-amber-500'
              )}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </div>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
            <p className="mt-2 text-[12px] font-bold text-slate-400">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] p-8 border border-slate-200/60 shadow-sm text-left">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Revenue Trends</h3>
              <p className="text-sm font-medium text-slate-400">Monthly growth based on paid invoices.</p>
            </div>
            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="h-[300px]">
             {revenue_chart?.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue_chart}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 800, fontSize: '14px', color: '#6366f1' }}
                    formatter={(value) => [`${currency}${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#revenue)" />
                </AreaChart>
              </ResponsiveContainer>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                  <Activity className="h-10 w-10 opacity-20 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">No revenue data found</p>
               </div>
             )}
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-8 border border-slate-200/60 shadow-sm text-left">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Attendance</h3>
             <CalendarCheck className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="h-[250px]">
            {attendance_chart?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendance_chart}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', fontWeight: 800}} />
                  <Bar dataKey="count" radius={[4, 4, 4, 4]}>
                    {attendance_chart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === attendance_chart.length - 1 ? '#6366f1' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                <Clock className="h-8 w-8 opacity-20 mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">No activity recorded</p>
              </div>
            )}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Peak Hours</span>
              <span className="text-[12px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">6 PM - 9 PM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Avg Daily</span>
              <span className="text-[13px] font-black text-slate-700">
                {attendance_chart?.length > 0 ? Math.round(attendance_chart.reduce((acc, curr) => acc + curr.count, 0) / attendance_chart.length) : 0} Check-ins
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] p-8 border border-slate-200/60 shadow-sm text-left">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Signups</h3>
            <Link to="/members" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center group transition-all">
              All Members <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-4">
            {recent_members?.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-lg uppercase group-hover:scale-110 transition-transform">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-tight text-sm">{member.name}</h4>
                    <p className="text-xs font-medium text-slate-400">Joined on {new Date(member.join_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{member.plan}</span>
                  <div className={clsx(
                    "flex items-center text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded",
                    member.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  )}>
                    {member.status}
                  </div>
                </div>
              </div>
            ))}
            {(!recent_members || recent_members.length === 0) && (
               <div className="py-10 text-center text-slate-400">
                  <p className="text-xs font-bold uppercase tracking-widest">No recent members</p>
               </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[40px] p-8 text-left shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">System Alerts</h3>
              <div className="h-10 w-10 bg-white/10 rounded-2xl flex items-center justify-center">
                 <AlertCircle className="h-6 w-6 text-indigo-300" />
              </div>
            </div>
            
            <div className="flex-1 space-y-6">
               <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-inner">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Expiries</p>
                  <p className="text-[15px] font-bold text-slate-200 leading-snug">
                    <span className="text-rose-400">{expiring_soon} memberships</span> expiring this week.
                  </p>
                  <Link to="/members" className="inline-flex items-center text-xs font-bold text-indigo-300 mt-5 hover:text-indigo-400 transition-colors uppercase tracking-[2px]">
                    Alert Now <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
               </div>
               
               <div className="bg-white/5 p-6 rounded-3xl border border-white/10 opacity-60">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Infrastructure</p>
                  <p className="text-sm font-bold text-slate-300">Database health optimal. All systems nominal.</p>
               </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600">
                     S{i}
                   </div>
                 ))}
               </div>
               <span className="text-[9px] font-black text-slate-700 uppercase tracking-[4px]">{gymName} 2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
