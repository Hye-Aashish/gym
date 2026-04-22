import { useState, useEffect } from "react";
import { Building, CreditCard, Users, Bell, Shield, Paintbrush, Loader2, Save } from "lucide-react";
import { clsx } from "clsx";
import axios from "axios";
import { toast } from "sonner";

const SETTINGS_SECTIONS = [
  { id: "general", name: "General Settings", icon: Building, description: "Gym details, location, and business hours" },
  { id: "billing", name: "Payment & Billing", icon: CreditCard, description: "Payment gateways, tax rates, and currency" },
  { id: "plans", name: "Membership Plans", icon: Users, description: "Create and manage subscription tiers" },
  { id: "notifications", name: "Notifications", icon: Bell, description: "Email and SMS templates" },
  { id: "security", name: "Security & Access", icon: Shield, description: "Staff roles and permissions" },
  { id: "appearance", name: "Appearance", icon: Paintbrush, description: "Brand colors, logos, and themes" },
];

export function Settings() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    gym_name: "",
    gym_email: "",
    currency: "INR (₹)",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/settings");
      if (response.data) {
        setSettings({
          gym_name: response.data.gym_name || "Fitness Point",
          gym_email: response.data.gym_email || "support@fitnesspoint.com",
          currency: response.data.currency || "INR (₹)",
        });
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post("/api/settings", settings);
      toast.success("Settings saved successfully!");
      // Dispatch a custom event to update the gym name globally
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settings }));
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col no-scrollbar">
      <div className="text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-widest">Manage your gym system configurations.</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 p-6 space-y-2">
            {SETTINGS_SECTIONS.map((section) => (
              <button
                key={section.id}
                className={clsx(
                  "w-full flex items-start px-4 py-4 text-left rounded-2xl transition-all group",
                  section.id === "general" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"
                )}
              >
                <section.icon className={clsx(
                  "flex-shrink-0 mt-0.5 h-5 w-5",
                  section.id === "general" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <div className="ml-4">
                  <p className="text-sm font-bold uppercase tracking-tight">{section.name}</p>
                  <p className="text-[11px] mt-0.5 font-medium opacity-70 leading-tight">{section.description}</p>
                </div>
              </button>
            ))}
        </div>
        
        <div className="flex-1 p-8 md:p-12 bg-slate-50/30">
          <div className="max-w-xl space-y-10 text-left">
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">General Settings</h2>
              <p className="text-sm font-medium text-slate-400 mt-1">Basic configuration for your gym identity.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Gym Name</label>
                <input
                  type="text"
                  value={settings.gym_name}
                  onChange={(e) => setSettings({...settings, gym_name: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 font-bold text-slate-700 transition-all shadow-sm"
                  placeholder="Enter Gym Name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                <input
                  type="email"
                  value={settings.gym_email}
                  onChange={(e) => setSettings({...settings, gym_email: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 font-bold text-slate-700 transition-all shadow-sm"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Default Currency</label>
                <select 
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-bold text-slate-700 shadow-sm appearance-none cursor-pointer"
                >
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center py-5 px-6 bg-indigo-600 text-white rounded-2xl font-bold text-[15px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest active:scale-[0.98] disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                  {isSaving ? "Saving Config..." : "Update System Settings"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
