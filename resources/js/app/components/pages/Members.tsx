import { useState, useEffect } from "react";
import { Plus, Search, MoreVertical, Shield, Clock, CalendarDays, CheckCircle2, UserCircle, X, Loader2, MessageCircle, AlertTriangle, Trash2, QrCode, Link as LinkIcon, Users } from "lucide-react";
import { clsx } from "clsx";
import axios from "axios";
import { toast } from "sonner";

export function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("All Members");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [plans, setPlans] = useState([]);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "+91 ",
    plan: "",
    status: "Active",
    join_date: new Date().toISOString().split('T')[0],
    expire_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
  });

  const handleEditClick = (member) => {
    setEditingMember(member);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(`/api/members/${editingMember.id}`, editingMember);
      setMembers(members.map(m => m.id === editingMember.id ? response.data : m));
      setShowEditModal(false);
      setEditingMember(null);
      toast.success("Member updated successfully");
    } catch (error) {
      toast.error("Failed to update member");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("/api/plans");
      setPlans(response.data);
      if (response.data.length > 0) {
        setNewMember(prev => ({ ...prev, plan: response.data[0].name }));
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get("/api/members");
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/members", newMember);
      setMembers([response.data, ...members]);
      setShowAddModal(false);
      setNewMember({
        name: "",
        email: "",
        phone: "+91 ",
        plan: plans.length > 0 ? plans[0].name : "",
        status: "Active",
        join_date: new Date().toISOString().split('T')[0],
        expire_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      });
      toast.success("Member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error(error.response?.data?.message || "Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMember = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`/api/members/${id}`);
      setMembers(members.filter(m => m.id !== id));
      toast.success("Member deleted");
    } catch (error) {
      toast.error("Failed to delete member");
    }
  };

  const sendWhatsApp = (member) => {
    let phone = member.phone?.replace(/\D/g, '');
    if (phone && phone.length === 10) phone = '91' + phone;
    
    const expireDate = new Date(member.expire_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expireDate.setHours(0, 0, 0, 0);

    const diffTime = expireDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const formattedExpiry = new Date(member.expire_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    let timeMsg = "";
    if (diffDays < 0) {
      timeMsg = `expired ${Math.abs(diffDays)} days ago on ${formattedExpiry}`;
    } else if (diffDays === 0) {
      timeMsg = `expires today`;
    } else {
      timeMsg = `is expiring in ${diffDays} days on ${formattedExpiry}`;
    }

    const message = `Hello ${member.name}, this is Fitness Point. Your membership ${timeMsg}. Please renew your plan to ensure your training continues without interruption. Thank you!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const isExpiringSoon = (date) => {
    const expireDate = new Date(date);
    const today = new Date();
    const diffTime = expireDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone && member.phone.includes(searchQuery));
    
    const matchesPlan = planFilter === "All Plans" || member.plan === planFilter;
    
    let matchesTab = true;
    if (activeTab === "Active") matchesTab = member.status === "Active";
    else if (activeTab === "Expired") matchesTab = member.status === "Expired";
    else if (activeTab === "Expiring Soon") matchesTab = isExpiringSoon(member.expire_date);

    return matchesSearch && matchesPlan && matchesTab;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto no-scrollbar relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Members & Subscriptions</h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500 max-w-lg leading-relaxed">Manage your gym members, track expiries, and send renewal reminders via WhatsApp.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowFormModal(true)}
            className="inline-flex items-center justify-center px-5 py-3 border border-slate-200 rounded-xl hover:bg-white transition-all text-[15px] font-bold text-slate-600 bg-slate-50/50 shadow-sm"
          >
            <QrCode className="-ml-1 mr-2.5 h-5 w-5" />
            Registration Link
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] text-[15px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-95"
          >
            <Plus className="-ml-1 mr-2.5 h-5 w-5 stroke-[2.5px]" />
            Add Member
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col no-scrollbar">
        {/* Filters and Tabs */}
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
           {/* Tabs */}
           <div className="flex p-1 bg-slate-100/50 rounded-2xl w-fit">
            {["All Members", "Active", "Expiring Soon", "Expired"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap",
                  activeTab === tab ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:max-w-xl">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold text-slate-600 appearance-none cursor-pointer"
            >
              <option>All Plans</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.name}>{plan.name}</option>
              ))}
              <option>Pending Assignment</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                 <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">No Members Found</h3>
              <p className="text-slate-500 text-sm font-medium">Try adjusting your filters or add a new member.</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Member</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Plan & Status</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Valid Until</th>
                  <th className="px-6 py-4 text-right pr-10 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-indigo-50/10 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold uppercase ring-1 ring-white shadow-sm">
                          {member.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <p className="text-[15px] font-bold text-slate-900 tracking-tight uppercase">{member.name}</p>
                          <p className="text-[13px] font-medium text-slate-500 mt-0.5">{member.phone || member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className={clsx(
                        "text-[13px] font-bold uppercase",
                        member.plan === "Pending Assignment" ? "text-rose-500" : "text-slate-700"
                      )}>{member.plan}</p>
                      <div className="flex items-center mt-1.5 gap-2">
                        <span className={clsx(
                          "px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border",
                          member.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
                          member.status === "Expired" ? "bg-rose-50 text-rose-700 border-rose-100" :
                          "bg-amber-50 text-amber-700 border-amber-100"
                        )}>
                          <div className={clsx("h-1.5 w-1.5 rounded-full", 
                             member.status === "Active" ? "bg-emerald-500" : member.status === "Expired" ? "bg-rose-500" : "bg-amber-500"
                          )} />
                          {member.status}
                        </span>
                        {isExpiringSoon(member.expire_date) && member.status === "Active" && (
                          <span className="bg-rose-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">Expiring</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[14px] font-bold text-slate-700 tracking-tight">{new Date(member.expire_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <div className="flex items-center mt-1 text-[11px] font-bold text-slate-400 gap-1.5 uppercase">
                        <Clock className="h-3.5 w-3.5" />
                        Joined {new Date(member.join_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right space-x-2">
                       <button 
                        onClick={() => handleEditClick(member)}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <UserCircle className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => sendWhatsApp(member)}
                        className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => deleteMember(member.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Admin Assignment / Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Onboard New Member</h2>
                  <p className="mt-2 text-slate-500 font-medium leading-relaxed">Direct assignment of subscription and access.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 transition-all">
                  <X />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-slate-700 ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      className="block w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-slate-700 ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                      className="block w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                      placeholder="rahul@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-slate-700 ml-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                      className="block w-full px-5 py-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                      placeholder="+91 98765-43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-slate-700 ml-1">Membership Plan</label>
                    <select
                      value={newMember.plan}
                      onChange={(e) => setNewMember({...newMember, plan: e.target.value})}
                      className="block w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all text-sm font-bold text-slate-600 appearance-none"
                    >
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.name}>{plan.name}</option>
                      ))}
                      {plans.length === 0 && <option disabled>No plans available</option>}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-slate-700 ml-1">Join Date</label>
                    <input
                      required
                      type="date"
                      value={newMember.join_date}
                      onChange={(e) => setNewMember({...newMember, join_date: e.target.value})}
                      className="block w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-slate-700 ml-1">Expiry Date</label>
                    <input
                      required
                      type="date"
                      value={newMember.expire_date}
                      onChange={(e) => setNewMember({...newMember, expire_date: e.target.value})}
                      className="block w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full mt-6 py-5 bg-indigo-600 text-white rounded-[24px] font-bold text-[16px] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest"
                >
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle2 className="h-6 w-6" />}
                  {isSubmitting ? "Onboarding..." : "Confirm Access"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 text-left">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Member Profile</h2>
                  <p className="mt-1 text-[15px] font-medium text-slate-500 leading-relaxed uppercase tracking-tighter">Modify details or update subscription.</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400">
                  <X />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      value={editingMember.name} 
                      onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white font-bold"
                    />
                  </div>
                   <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone</label>
                    <input 
                      type="tel" 
                      value={editingMember.phone} 
                      onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Plan</label>
                    <select 
                      value={editingMember.plan} 
                      onChange={(e) => setEditingMember({...editingMember, plan: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl appearance-none font-bold text-slate-700"
                    >
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.name}>{plan.name}</option>
                      ))}
                      <option>Pending Assignment</option>
                    </select>
                  </div>
                   <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</label>
                    <select 
                      value={editingMember.status} 
                      onChange={(e) => setEditingMember({...editingMember, status: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl appearance-none font-bold text-slate-700"
                    >
                      <option>Active</option>
                      <option>Expired</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expiry Date</label>
                    <input 
                      type="date" 
                      value={editingMember.expire_date} 
                      onChange={(e) => setEditingMember({...editingMember, expire_date: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest">
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Member Registration Link Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowFormModal(false)} />
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="p-10 text-center">
               <div className="h-20 w-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600 ring-8 ring-indigo-50">
                 <QrCode className="h-10 w-10" />
               </div>
               <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Member Registration</h2>
               <p className="mt-2 text-[15px] font-medium text-slate-500">Send this link to new members. Once they fill it, you can assign them a plan.</p>
               
               <div className="mt-10 p-5 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-between gap-4">
                 <div className="flex-1 truncate text-left font-mono text-sm text-slate-600">
                   {window.location.origin}/register-member
                 </div>
                 <button 
                  onClick={() => { 
                    navigator.clipboard.writeText(`${window.location.origin}/register-member`); 
                    toast.success("Registration link copied!"); 
                  }}
                  className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                 >
                   <LinkIcon className="h-5 w-5 text-indigo-600" />
                 </button>
               </div>

               <button 
                onClick={() => setShowFormModal(false)} 
                className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
               >
                 Done
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
