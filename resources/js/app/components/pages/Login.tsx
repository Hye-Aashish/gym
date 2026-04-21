import { useState } from "react";
import axios from "axios";
import { Dumbbell, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { clsx } from "clsx";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For Sanctum SPA, we should call csrf-cookie first if on same domain
      // await axios.get("/sanctum/csrf-cookie");
      
      const response = await axios.post("/api/login", { email, password });
      
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("isLoggedIn", "true");
      
      // Set default Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      
      toast.success("Welcome back, Captain!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials. Hint: admin@fitnesspoint.com / admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Abstract Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-20 w-20 bg-indigo-600 rounded-[28px] shadow-2xl shadow-indigo-200 mb-6 group animate-bounce-subtle">
            <Dumbbell className="h-10 w-10 text-white transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">
            Fitness <span className="text-indigo-600">Point</span>
          </h1>
          <p className="mt-3 text-[15px] font-medium text-slate-500">The ultimate gym management operating system.</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden transform transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
          <div className="p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Login</h2>
              <p className="text-sm font-medium text-slate-400 mt-1">Enter your credentials to access the console.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
                  </div>
                  <input
                    required
                    type="email"
                    className="block w-full pl-12 pr-5 py-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                    placeholder="name@fitnesspoint.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
                  </div>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    className="block w-full pl-12 pr-12 py-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="h-5 w-5 border-2 border-slate-200 rounded-lg group-hover:border-indigo-200 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all"></div>
                    <CheckCircle2 className="absolute h-3.5 w-3.5 text-white scale-0 peer-checked:scale-100 transition-transform left-[3px] top-[3px]" />
                  </div>
                  <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-bold text-[16px] shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="p-8 bg-slate-50/50 border-t border-slate-100 text-center">
             <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[2px]">Fitness Point v2.0-Alpha</p>
          </div>
        </div>
        
        <div className="mt-8 text-center px-10">
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
