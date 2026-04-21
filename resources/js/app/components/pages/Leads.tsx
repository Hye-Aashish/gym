import { useState, useEffect, useCallback } from "react";
import { Plus, Search, MessageSquare, Phone, MoreVertical, Calendar, X, Loader2, Trash2, Mail, Info, UserCircle, LayoutGrid, List, Link as LinkIcon, ExternalLink, QrCode, Download } from "lucide-react";
import { clsx } from "clsx";
import axios from "axios";
import { toast } from "sonner";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const LEAD_STATUSES = ["New", "Follow-up", "Converted"];

const ItemTypes = {
  LEAD: 'lead'
};

// --- Draggable Lead Card ---
function DraggableLead({ lead, onDelete }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.LEAD,
    item: { id: lead.id, status: lead.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={clsx(
        "p-4 mb-3 bg-white rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing group animate-in fade-in slide-in-from-bottom-2 duration-300",
        isDragging ? "opacity-40 scale-95" : "opacity-100"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <UserCircle className="h-6 w-6 stroke-[1.5px]" />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[120px] uppercase">
              {lead.name}
            </h4>
            <p className="text-[12px] font-medium text-slate-500">{lead.phone}</p>
          </div>
        </div>
        <button 
          onClick={() => onDelete(lead.id)}
          className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
        <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-tight">
          <Calendar className="h-3 w-3 mr-1.5 text-indigo-400" />
          {lead.follow_up_date ? new Date(lead.follow_up_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'}
        </div>
        <div className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 rounded-lg text-slate-500 uppercase">
          {lead.interest}
        </div>
      </div>
    </div>
  );
}

// --- Kanban Column ---
function KanbanColumn({ status, leads, onDropLead, onDeleteLead }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.LEAD,
    drop: (item) => onDropLead(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const columnLeads = leads.filter(l => l.status === status);

  return (
    <div 
      ref={drop}
      className={clsx(
        "flex-1 min-w-[300px] flex flex-col bg-slate-50/50 rounded-[32px] p-5 border border-slate-100 transition-all no-scrollbar",
        isOver && "bg-indigo-50/50 border-indigo-200/50 ring-4 ring-indigo-500/5"
      )}
    >
      <div className="flex items-center justify-between mb-6 px-2 text-left">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "h-3 w-3 rounded-full",
            status === "New" ? "bg-blue-500" : status === "Follow-up" ? "bg-amber-500" : "bg-emerald-500"
          )} />
          <h3 className="text-[16px] font-extrabold text-slate-900 uppercase tracking-tight">{status}</h3>
          <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-400 rounded-lg text-[12px] font-bold">
            {columnLeads.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 min-h-[300px]">
        {columnLeads.map(lead => (
          <DraggableLead key={lead.id} lead={lead} onDelete={onDeleteLead} />
        ))}
        {columnLeads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-30 border-2 border-dashed border-slate-200 rounded-2xl">
            <Info className="h-6 w-6 mb-2" />
            <p className="text-xs font-bold uppercase">No {status} Leads</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("board"); // "board" or "list"
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "", phone: "+91 ", email: "", interest: "General Fitness", status: "New", follow_up_date: "", notes: ""
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/leads");
      setLeads(response.data);
    } catch (error) {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeadStatus = async (id, newStatus) => {
    const originalLeads = [...leads];
    // Optimistic Update
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    
    try {
      await axios.put(`/api/leads/${id}`, { status: newStatus });
      toast.success(`Lead moved to ${newStatus}`);
    } catch (error) {
      setLeads(originalLeads);
      toast.error("Failed to update status");
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/leads", formData);
      setLeads([response.data, ...leads]);
      setShowAddModal(false);
      setFormData({ name: "", phone: "+91 ", email: "", interest: "General Fitness", status: "New", follow_up_date: "", notes: "" });
      toast.success("New lead added successfully");
    } catch (error) {
      toast.error("Failed to add lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/leads/${id}`);
      setLeads(leads.filter(l => l.id !== id));
      toast.success("Lead deleted");
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lead.phone.includes(searchQuery)
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-8 max-w-7xl mx-auto no-scrollbar">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 text-left">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">Lead Management</h1>
            <p className="mt-2 text-[15px] font-medium text-slate-500 max-w-lg leading-relaxed">Drag and drop leads to track conversion stages and manage your pipeline.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] text-[15px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Plus className="-ml-1 mr-2.5 h-5 w-5 stroke-[2.5px]" />
              New Lead
            </button>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div className="relative flex-1 max-w-lg group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 border border-slate-200/80 rounded-2xl leading-5 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                placeholder="Find a prospect..."
              />
            </div>
            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
              <button 
                onClick={() => setViewMode("board")}
                className={clsx(
                  "flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                  viewMode === "board" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Board View
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={clsx(
                  "flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                  viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <List className="h-4 w-4 mr-2" />
                Table List
              </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {loading ? (
             <div className="h-[500px] flex flex-col items-center justify-center gap-4 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                <span className="text-slate-400 font-bold tracking-widest uppercase text-xs">Assembling Board...</span>
             </div>
          ) : viewMode === "board" ? (
            <div className="flex flex-col md:flex-row gap-6 h-full overflow-x-auto pb-6 no-scrollbar">
              {LEAD_STATUSES.map(status => (
                <KanbanColumn 
                  key={status} 
                  status={status} 
                  leads={filteredLeads} 
                  onDropLead={handleUpdateLeadStatus} 
                  onDeleteLead={handleDeleteLead}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden text-left">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th scope="col" className="px-7 py-4 text-left text-[12px] font-bold text-slate-500 uppercase tracking-widest">Lead Profile</th>
                    <th scope="col" className="px-7 py-4 text-left text-[12px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th scope="col" className="px-7 py-4 text-left text-[12px] font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell">Follow-up</th>
                    <th scope="col" className="relative px-7 py-4"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100/80">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-indigo-50/20 transition-all duration-150">
                      <td className="px-7 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 uppercase font-bold text-xs">
                            {lead.name.substring(0, 2)}
                          </div>
                          <div className="ml-4">
                            <div className="text-[14px] font-bold text-slate-900 uppercase">{lead.name}</div>
                            <div className="text-[12px] text-slate-500">{lead.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-7 py-5 whitespace-nowrap">
                        <span className={clsx(
                           "px-3 py-1 rounded-lg text-[11px] font-bold uppercase border",
                           lead.status === "New" ? "bg-blue-50 text-blue-600 border-blue-100" :
                           lead.status === "Follow-up" ? "bg-amber-50 text-amber-600 border-amber-100" :
                           "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-7 py-5 whitespace-nowrap text-[13px] font-medium text-slate-500 hidden md:table-cell">
                        {lead.follow_up_date ? new Date(lead.follow_up_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="px-7 py-5 whitespace-nowrap text-right space-x-2">
                        <button onClick={() => handleDeleteLead(lead.id)} className="text-slate-400 hover:text-rose-500 p-2"><Trash2 className="h-5 w-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>


        {/* Add Lead Modal (Standard) */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <form onSubmit={handleAddLead} className="p-8 text-left">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900">Add New Prospect</h2>
                  <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input required type="text" className="px-5 py-4 border rounded-2xl bg-slate-50" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <input required type="tel" className="px-5 py-4 border rounded-2xl bg-slate-50" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  <input type="email" className="px-5 py-4 border rounded-2xl bg-slate-50" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  <select className="px-5 py-4 border rounded-2xl bg-slate-50" value={formData.interest} onChange={(e) => setFormData({...formData, interest: e.target.value})}>
                    <option>General Fitness</option><option>Weight Loss</option><option>Muscle Gain</option>
                  </select>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full mt-8 py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest">
                  {isSubmitting ? "Saving..." : "Launch Prospect Profile"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

