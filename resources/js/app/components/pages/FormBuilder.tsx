import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, GripVertical, Type, Hash, Calendar, Phone, Mail, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { clsx } from "clsx";

export function FormBuilder() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await axios.get("/api/form-config");
      setFields(response.data.fields || []);
    } catch (error) {
      toast.error("Failed to load form configuration");
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    const newField = {
      label: "New Field",
      name: "field_" + Date.now(),
      type: "text",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (index) => {
    // Don't allow removing core fields if they are mandatory
    const field = fields[index];
    if (['name', 'email', 'phone'].includes(field.name)) {
      toast.warning("Core fields are required for member profiles.");
      // return; // Uncomment if you want to strictly prevent deletion
    }
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post("/api/form-config", { fields });
      toast.success("Form configuration saved successfully!");
    } catch (error) {
      toast.error("Failed to save configuration");
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Form Builder</h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500 max-w-lg leading-relaxed">Customize the fields for your public member registration form.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={addField}
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 rounded-xl hover:bg-white transition-all text-[15px] font-bold text-slate-600 bg-slate-50/50 shadow-sm"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Field
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-[15px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="-ml-1 mr-2 h-5 w-5" />}
            Save Form
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-200 transition-all">
            <div className="text-slate-300 group-hover:text-slate-400 cursor-grab active:cursor-grabbing">
              <GripVertical className="h-6 w-6" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="space-y-1.5 text-left">
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">Field Label</label>
                <input 
                  type="text" 
                  value={field.label}
                  onChange={(e) => updateField(index, 'label', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
              
              <div className="space-y-1.5 text-left">
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">Input Type</label>
                <select 
                  value={field.type}
                  onChange={(e) => updateField(index, 'type', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium appearance-none"
                >
                  <option value="text">Short Text</option>
                  <option value="email">Email Address</option>
                  <option value="tel">Phone Number</option>
                  <option value="number">Number</option>
                  <option value="date">Date of Birth / Date</option>
                  <option value="textarea">Long Text</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4 h-full pt-6">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={field.required}
                    onChange={(e) => updateField(index, 'required', e.target.checked)}
                    className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all"
                  />
                  <span className="text-sm font-bold text-slate-600">Required</span>
                </label>
                
                <button 
                  onClick={() => removeField(index)}
                  className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No custom fields yet</h3>
            <p className="text-slate-500 font-medium">Click "Add Field" to start building your form.</p>
          </div>
        )}
      </div>

      <div className="bg-indigo-50/50 p-6 rounded-[24px] border border-indigo-100 flex items-start gap-4">
        <CheckCircle2 className="h-6 w-6 text-indigo-500 mt-0.5" />
        <div className="text-left">
          <h4 className="font-bold text-indigo-900">Pro Tip</h4>
          <p className="text-sm text-indigo-700/80 leading-relaxed font-medium">
            Core fields like <b>Name, Email, and Phone</b> are essential for member profiles. You can add extra fields like "Address", "Emergency Contact", or "Medical History" to collect more information.
          </p>
        </div>
      </div>
    </div>
  );
}
