import { useState, useEffect } from "react";
import { CalendarCheck, Search, QrCode, Loader2, CheckCircle2, AlertCircle, UserCircle, Plus, X, Camera } from "lucide-react";
import { clsx } from "clsx";
import axios from "axios";
import { toast } from "sonner";
import { Html5QrcodeScanner } from "html5-qrcode";

export function Attendance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [summary, setSummary] = useState({ total_checkins: 0, peaking_hour: "---", currently_active: 0 });
  const [loading, setLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // QR Scanner Initialization
  useEffect(() => {
    let scanner = null;
    if (showScanner) {
      // Need a small timeout to ensure the DOM element is present
      const timeoutId = setTimeout(() => {
        scanner = new Html5QrcodeScanner("qr-reader", { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        }, false);

        scanner.render((decodedText) => {
          handleScannerResult(decodedText);
          scanner.clear();
          setShowScanner(false);
        }, (error) => {
          // Ignore scanning errors
        });
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (scanner) {
          scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        }
      };
    }
  }, [showScanner]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendancesRes, summaryRes] = await Promise.all([
        axios.get("/api/attendances"),
        axios.get("/api/attendances/summary")
      ]);
      setAttendances(attendancesRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      try {
        const allMembers = await axios.get("/api/members");
        const filtered = allMembers.data.filter(m => 
          m.name.toLowerCase().includes(query.toLowerCase()) || 
          m.email.toLowerCase().includes(query.toLowerCase()) ||
          (m.phone && m.phone.includes(query))
        );
        setSearchResults(filtered);
      } catch (error) {
        console.error("Search error", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleScannerResult = async (memberId) => {
    try {
      const response = await axios.get(`/api/members/${memberId}`);
      await checkIn(response.data);
    } catch (error) {
      toast.error("Invalid QR Code or Member not found");
    }
  };

  const checkIn = async (member) => {
    setIsCheckingIn(member.id);
    try {
      const response = await axios.post("/api/attendances", {
        member_id: member.id,
        status: member.status === 'Active' ? 'Success' : 'Warning'
      });
      setAttendances([response.data, ...attendances]);
      setSearchQuery("");
      setSearchResults([]);
      toast.success(`${member.name} checked in successfully`);
      fetchData(); // Refresh summary
    } catch (error) {
      toast.error("Failed to check in member");
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <div className="space-y-8 overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Attendance</h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500 max-w-lg leading-relaxed">Track member check-ins and gym usage in real-time.</p>
        </div>
        <button 
          onClick={() => setShowScanner(true)}
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] text-[15px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-95"
        >
          <QrCode className="-ml-1 mr-2.5 h-5 w-5 stroke-[2.5px]" />
          Scan QR Code
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Manual Check-in */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 flex flex-col items-center text-center">
             <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 shadow-inner border border-white">
               <CalendarCheck className="h-8 w-8 stroke-[2.25px]" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 tracking-tight">Manual Check-in</h3>
             <p className="text-[15px] font-medium text-slate-500 mt-2 mb-6">Search for a member to check them in manually.</p>
             
             <div className="w-full relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-200/80 rounded-xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                  placeholder="Search name or ID..."
                />

                {/* Search Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto no-scrollbar">
                      {searchResults.map((member) => (
                        <li 
                          key={member.id} 
                          className="hover:bg-indigo-50/50 p-4 flex items-center justify-between cursor-pointer transition-colors"
                          onClick={() => checkIn(member)}
                        >
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                              <UserCircle className="h-6 w-6 stroke-[1.5px]" />
                            </div>
                            <div className="ml-3 text-left">
                              <p className="text-[14px] font-bold text-slate-900 leading-tight">{member.name}</p>
                              <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">{member.plan}</p>
                            </div>
                          </div>
                          {isCheckingIn === member.id ? (
                            <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                          ) : (
                            <Plus className="h-5 w-5 text-slate-400" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
             </div>
          </div>
          
          {/* Summary Card */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-7 overflow-hidden relative">
             <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500 opacity-[0.03] blur-2xl font-bold" />
             <h3 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-6">Today's Summary</h3>
             <dl className="space-y-6">
               <div className="flex justify-between items-end">
                 <dt className="text-[15px] font-semibold text-slate-500">Total Check-ins</dt>
                 <dd className="text-2xl font-extrabold text-slate-900 leading-none">{summary.total_checkins}</dd>
               </div>
               <div className="flex justify-between items-end">
                 <dt className="text-[15px] font-semibold text-slate-500">Peak Hour</dt>
                 <dd className="text-[16px] font-bold text-indigo-600">{summary.peak_hour}</dd>
               </div>
               <div className="flex justify-between items-end">
                 <dt className="text-[15px] font-semibold text-slate-500">Currently Active</dt>
                 <dd className="text-2xl font-extrabold text-slate-900 leading-none">{summary.currently_active}</dd>
               </div>
             </dl>
          </div>
        </div>

        {/* Recent Check-ins List */}
        <div className="lg:col-span-2 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex flex-col backdrop-blur-3xl">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <h3 className="text-xl font-extrabold text-slate-900">Recent Check-ins</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[13px] font-bold text-indigo-600 uppercase tracking-widest">Live</span>
            </div>
          </div>
          <div className="no-scrollbar min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                <span className="text-slate-400 font-semibold">Loading feed...</span>
              </div>
            ) : attendances.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-5 border border-slate-100">
                  <CalendarCheck className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No check-ins yet</h3>
                <p className="mt-2 text-slate-500 max-w-xs mx-auto font-medium">Once members start checking in today, they will appear here in real-time.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {attendances.map((item, idx) => (
                  <li key={idx} className="px-8 py-5 flex items-center hover:bg-slate-50/80 transition-all duration-150 group cursor-pointer animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shadow-inner border border-white group-hover:scale-105 transition-transform">
                      {item.member.name.charAt(0)}
                    </div>
                    <div className="ml-5 flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.member.name}</p>
                      <p className="text-[13px] font-medium text-slate-400 mt-0.5 uppercase tracking-tighter">Checked in at {new Date(item.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    </div>
                    <span className={clsx(
                      "px-4 py-2 rounded-xl text-[12px] font-bold border flex items-center gap-1.5 shadow-sm",
                      item.status === "Success" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-500/10" 
                        : "bg-amber-50 text-amber-700 border-amber-100 shadow-amber-500/10"
                    )}>
                      {item.status === "Success" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                      {item.status === "Success" ? "Allowed" : "Payment Due"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
            onClick={() => setShowScanner(false)}
          />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200/50">
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">QR Scanner</h2>
                  <p className="mt-1 text-[15px] font-medium text-slate-500">Scan member's QR code to check them in.</p>
                </div>
                <button 
                  onClick={() => setShowScanner(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                >
                  <X />
                </button>
              </div>
            </div>

            <div className="p-8 pt-0">
               <div className="relative overflow-hidden rounded-[24px] border-4 border-indigo-100 aspect-square bg-slate-900">
                  <div id="qr-reader" className="w-full h-full overflow-hidden"></div>
                  
                  {/* Decorative Camera Guide */}
                  <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                     <div className="w-full h-full border-2 border-indigo-400/50 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 -mt-1 -ml-1"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 -mt-1 -mr-1"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 -mb-1 -ml-1"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 -mb-1 -mr-1"></div>
                     </div>
                  </div>

                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[12px] font-bold uppercase tracking-widest">
                    <Camera className="h-3.5 w-3.5" />
                    Live Camera
                  </div>
               </div>

               <button 
                onClick={() => setShowScanner(false)}
                className="mt-6 w-full px-5 py-4 text-[15px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
