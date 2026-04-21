import { useState, useEffect } from "react";
import { BarChart3, Download, TrendingUp, Users, Calendar, DollarSign, Loader2 } from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";
import { clsx } from "clsx";
import axios from "axios";

export function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const reports = [
    { title: "Revenue Report", description: "Monthly income vs expenses breakdown", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Attendance Insights", description: "Peak hours and member visit frequency", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Membership Growth", description: "New sign-ups vs churn rate", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Lead Conversion", description: "Inquiry to active member conversion stats", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/dashboard-pulse");
      setData(response.data);
    } catch (error) {
      console.error("Report data error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col no-scrollbar">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Performance Reports</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium font-sans">Analyze your gym's key performance metrics and growth.</p>
        </div>
        <button className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all active:scale-95">
          <Download className="-ml-1 mr-2 h-5 w-5 text-slate-400" />
          Export All (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reports.map((report, idx) => (
          <div key={idx} className="bg-white overflow-hidden rounded-[24px] border border-slate-200/60 shadow-sm transition-all hover:shadow-md cursor-pointer group p-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className={clsx("flex-shrink-0 p-3 rounded-xl transition-transform group-hover:scale-110", report.bg)}>
                  <report.icon className={clsx("h-6 w-6", report.color)} />
                </div>
                <BarChart3 className="h-5 w-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">{report.title}</h3>
                <p className="mt-1 text-xs text-slate-500 font-medium">{report.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Generate</span>
                <TrendingUp className="h-4 w-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 p-8 flex-1 flex flex-col min-h-[400px] text-left">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Revenue Growth Insights</h3>
            <div className="flex gap-2">
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-widest">Income</div>
                <div className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-xs font-black uppercase tracking-widest">Target</div>
            </div>
        </div>

        <div className="flex-1 flex flex-col relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-2xl">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-2" />
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[3px]">Generating Report...</p>
            </div>
          ) : null}

          {data?.revenue_chart?.length > 0 ? (
            <div className="flex-1 h-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.revenue_chart}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={15} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} tickFormatter={(val) => `₹${val}`} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontWeight: 800, fontSize: '14px', color: '#10b981' }}
                        />
                        <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" animationDuration={1500} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[28px] bg-slate-50/30 font-sans">
                <div className="text-center">
                    <BarChart3 className="mx-auto h-16 w-16 text-slate-200 stroke-[1.5px]" />
                    <h3 className="mt-4 text-sm font-black text-slate-500 uppercase tracking-widest">No Trend Data Found</h3>
                    <p className="mt-1 text-xs text-slate-400 font-medium">Add more paid invoices to see historical growth.</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
