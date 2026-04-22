import { useState, useEffect } from "react";
import { User, Phone, Mail, CheckCircle2, Loader2, ArrowRight, Calendar, Hash, Type } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { clsx } from "clsx";

export function PublicMemberRegistration() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [gymName, setGymName] = useState("Fitness Point");

  useEffect(() => {
    fetchConfig();
    fetchGymName();
  }, []);

  const fetchGymName = async () => {
    try {
      const response = await axios.get("/api/settings");
      if (response.data && response.data.gym_name) {
        setGymName(response.data.gym_name);
      }
    } catch (error) {}
  };

  const fetchConfig = async () => {
    try {
      const response = await axios.get("/api/form-config");
      setFields(response.data.fields || []);
      // Initialize form data with empty strings for all fields
      const initialData = {};
      response.data.fields.forEach(f => initialData[f.name || f.label.toLowerCase().replace(/\s+/g, '_')] = "");
      setFormData(initialData);
    } catch (error) {
      toast.error("Failed to load registration form");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("/api/public/register-member", formData);
      setIsSuccess(true);
      toast.success("Registration Successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'email': return <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-all" />;
      case 'tel': return <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-all" />;
      case 'date': return <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-all" />;
      case 'number': return <Hash className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-all" />;
      default: return <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-all" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center animate-in fade-in zoom-in duration-500">
          <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-emerald-50">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Registration Complete!</h2>
          <p className="mt-4 text-[16px] font-medium text-slate-500 leading-relaxed">
            Thank you for registering with <b>{gymName}</b>. Your profile has been created. Our team will contact you soon to finalize your membership plan.
          </p>
          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Welcome to the family</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full">
        <div className="flex items-center justify-center mb-10 gap-3">
          <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{gymName}</span>
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100/50 overflow-hidden">
          <div className="p-8 md:p-12 text-center border-b border-slate-50 bg-slate-50/30">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Member Registration</h1>
            <p className="mt-2 text-[15px] font-medium text-slate-500">Please fill your details below to join us.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 text-left">
            <div className="space-y-6">
              {fields.map((field, idx) => {
                const fieldName = field.name || field.label.toLowerCase().replace(/\s+/g, '_');
                return (
                  <div key={idx} className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        {getIcon(field.type)}
                      </div>
                      {field.type === 'textarea' ? (
                        <textarea
                          required={field.required}
                          disabled={isSubmitting}
                          rows={3}
                          className="block w-full pl-12 pr-5 py-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                          value={formData[fieldName] || ""}
                          onChange={(e) => setFormData({...formData, [fieldName]: e.target.value})}
                        />
                      ) : (
                        <input
                          required={field.required}
                          type={field.type}
                          disabled={isSubmitting}
                          className="block w-full pl-12 pr-5 py-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                          value={formData[fieldName] || ""}
                          onChange={(e) => setFormData({...formData, [fieldName]: e.target.value})}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-bold text-[16px] shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Register Now
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-[13px] font-bold text-slate-400 uppercase tracking-widest">
          Powered by {gymName} OS
        </p>
      </div>
    </div>
  );
}
