import { useState, useEffect } from "react";
import { Plus, Check, Clock, Edit2, Trash2, X, Loader2, IndianRupee, Award, ListChecks } from "lucide-react";
import { clsx } from "clsx";
import axios from "axios";
import { toast } from "sonner";

export function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    duration: "1 Month",
    price: "",
    features: "",
    recommended: false
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/plans");
      setPlans(response.data);
    } catch (error) {
      toast.error("Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Convert features string to array
      const featuresArray = formData.features.split("\n").filter(f => f.trim() !== "");
      const response = await axios.post("/api/plans", {
        ...formData,
        price: parseFloat(formData.price),
        features: featuresArray
      });
      setPlans([...plans, response.data]);
      setShowAddModal(false);
      setFormData({ name: "", duration: "1 Month", price: "", features: "", recommended: false });
      toast.success("New membership plan created");
    } catch (error) {
      toast.error("Failed to create plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await axios.delete(`/api/plans/${id}`);
      setPlans(plans.filter(p => p.id !== id));
      toast.success("Plan deleted successfully");
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans no-scrollbar relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Membership Plans</h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500 max-w-lg leading-relaxed">Create and manage your subscription tiers for your members.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] text-[15px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-95"
        >
          <Plus className="-ml-1 mr-2.5 h-5 w-5 stroke-[2.5px]" />
          Create Plan
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Subscription Tiers...</span>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
           <div className="h-24 w-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
            <Award className="h-12 w-12 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">No plans found</h3>
          <p className="mt-2 text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">Start by creating a membership plan to offer your gym members.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={clsx(
                "relative bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col p-8 group",
                plan.recommended ? "border-indigo-500 ring-4 ring-indigo-500/5" : "border-slate-100 hover:border-slate-200"
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-bold bg-indigo-600 text-white shadow-lg uppercase tracking-widest">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{plan.name}</h3>
                </div>
                <div className="mt-6 flex items-baseline text-5xl font-extrabold text-slate-900">
                  <span className="text-2xl font-bold text-slate-400 mr-1">₹</span>
                  {plan.price}
                  <span className="ml-2 text-[15px] font-bold text-slate-400 uppercase tracking-widest">/ {plan.duration.toLowerCase()}</span>
                </div>
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-slate-50 rounded-lg text-[13px] font-bold text-slate-500 border border-slate-100">
                  <Clock className="h-4 w-4 mr-2 text-indigo-400" />
                  {plan.duration}
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full mb-8" />

              <ul className="space-y-4 flex-1">
                {plan.features && plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center mr-3 mt-0.5 border border-emerald-100 flex-shrink-0">
                       <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3px]" />
                    </div>
                    <span className="text-[15px] font-medium text-slate-600 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-center gap-3">
                <button 
                  onClick={() => handleDeletePlan(plan.id)}
                  className="p-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl transition-all border border-rose-100/50 active:scale-90"
                >
                  <Trash2 className="h-5 w-5 stroke-[2.5px]" />
                </button>
                <button className={clsx(
                  "flex-1 px-5 py-4 text-[15px] font-bold rounded-2xl transition-all active:scale-95 border",
                  plan.recommended 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 border-transparent shadow-lg shadow-indigo-200" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}>
                  Edit Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200/50">
            <div className="p-10 pb-6 text-left">
               <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Subscription</h2>
                  <p className="mt-1.5 text-[15px] font-medium text-slate-500 leading-relaxed">Define a new membership tier and its benefits.</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                >
                  <X className="h-6 w-6 stroke-[3px]" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddPlan} className="p-10 pt-4 space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-slate-700 ml-1 uppercase tracking-widest">Plan Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Award className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      required
                      type="text"
                      className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-bold transition-all"
                      placeholder="e.g. Platinum Plus"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-slate-700 ml-1 uppercase tracking-widest">Price (INR)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      required
                      type="number"
                      className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-bold transition-all"
                      placeholder="999"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-slate-700 ml-1 uppercase tracking-widest">Plan Duration</label>
                  <select 
                    className="block w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-bold transition-all appearance-none cursor-pointer"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  >
                    <option>1 Month</option>
                    <option>3 Months</option>
                    <option>6 Months</option>
                    <option>12 Months</option>
                  </select>
                </div>

                {/* Recommended */}
                <div className="space-y-2 flex flex-col justify-end">
                   <label className="flex items-center gap-3 p-4 border border-slate-100 rounded-2xl bg-slate-50/30 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox"
                      className="h-6 w-6 rounded-lg text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      checked={formData.recommended}
                      onChange={(e) => setFormData({...formData, recommended: e.target.checked})}
                    />
                    <span className="text-[14px] font-bold text-slate-700 uppercase tracking-widest">Mark as Popular</span>
                   </label>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1 uppercase tracking-widest">Plan Benefits (One per line)</label>
                <div className="relative group">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <ListChecks className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <textarea
                    rows={4}
                    className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-bold transition-all no-scrollbar"
                    placeholder="Unlimited access&#10;Full Body Massage&#10;Nutrition Plan"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-5 py-5 text-[15px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-[22px] transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] inline-flex items-center justify-center px-5 py-5 border border-transparent rounded-[22px] shadow-xl text-[15px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Award className="h-5 w-5 mr-2 stroke-[2.5px]" />}
                  {isSubmitting ? "Creating Tier..." : "Launch Membership Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
